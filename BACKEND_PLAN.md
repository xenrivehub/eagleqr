# QR Menü Sistemi — Backend Planı

**Proje:** eagle-qr · **Tarih:** Mayıs 2026
**İlgili dokümanlar:** [QR_MENU.md](./QR_MENU.md) (MVP) · [FRONTEND_PLAN.md](./FRONTEND_PLAN.md)

---

## 0. Teknoloji & Genel Yaklaşım

| Karar | Seçim |
| --- | --- |
| Çalışma zamanı | Next.js 16 fullstack — Server Actions + Route Handlers (`app/api/*`) |
| Veritabanı | PostgreSQL + Prisma ORM |
| Deploy / DB host | Railway |
| Auth | Auth.js (NextAuth v5) + 2FA (TOTP) |
| Medya depolama | Cloudflare R2 (S3 uyumlu, CDN) |
| Validasyon | Zod (tüm sistem sınırlarında) |
| Mimari | Multi-tenant; her veri satırı `businessId` ile izole |

**Sınır kuralı:** İstemciden gelen her girdi sistem sınırında Zod ile doğrulanır. İç çağrılarda gereksiz savunmacı kod yok.

---

## 1. Veritabanı (PostgreSQL + Prisma)

Multi-tenant relational şema. Çekirdek modeller:

| Model | Açıklama / Önemli alanlar |
| --- | --- |
| `User` | id, email, passwordHash, role (`SUPER_ADMIN` / `BUSINESS_OWNER` / `STAFF`), twoFactorSecret (şifreli), businessId? |
| `Business` | id, slug (unique), name, status (`PENDING`/`ACTIVE`/`SUSPENDED`), subscriptionId, createdAt |
| `ThemeConfig` | id, businessId, layoutPreset, colors(JSON), typography(JSON), branding(JSON), options(JSON) |
| `Menu` | id, businessId, name, schedule (sabah/öğle/akşam/mevsimlik/özel), isActive |
| `MenuVersion` | id, menuId, versionNo, snapshot(JSON), createdAt, createdBy → tek tıkla geri dönüş |
| `Category` | id, menuId, name, sortOrder |
| `Product` | id, categoryId, businessId, name, description, price, calories, isSoldOut, sortOrder, **mediaType** (`IMAGE`/`VIDEO`/`MODEL_3D`), imageUrl, videoUrl, modelGlbUrl, modelUsdzUrl |
| `Allergen` | id, code (14 AB kategorisi), label |
| `ProductAllergen` | productId, allergenId (M:N) |
| `CustomerProfile` | id, anonId/userId?, allergens(JSON), favoriteCuisines(JSON), spiceTolerance, languagePref |
| `Rating` | id, productId, customerId, stars, comment, createdAt |
| `ScanEvent` | id, businessId, menuId, tableNo?, productId?, type (scan/view), ts → analitik |
| `Subscription` | id, businessId, tier (TBD kademeler), status, currentPeriodEnd |
| `AuditLog` | id, actorId, action, targetType, targetId, meta(JSON), ts |

**İzolasyon & indeksler:** Tenant'a ait tüm tablolar `businessId` taşır ve bu alan indekslenir. Sık sorgular: `Business.slug` (menü açılışı), `ScanEvent(businessId, ts)` (analitik), `Product(categoryId, sortOrder)`.

**i18n:** Ürün/kategori metinleri için çeviri tablosu veya JSON çoklu-dil alanı (10 dil) — uygulama aşamasında netleşir.

---

## 2. Veritabanı Güvenliği

- **En az ayrıcalık** — uygulama DB rolü yalnızca gerekli CRUD; DDL ayrı migration rolü.
- **Parametreli sorgular** — Prisma varsayılan; ham SQL kullanılırsa `$queryRaw` parametreli.
- **Satır seviyesi izolasyon** — her tenant sorgusu zorunlu `where: { businessId }` ile; ortak guard helper (`scopedQuery(businessId)`) ile yanlışlıkla kaçak veri erişimi engellenir.
- **Şifrelenmiş alanlar** — 2FA secret ve hassas alanlar uygulama katmanında şifrelenir; şifreler bcrypt/argon2 hash.
- **Migration & backup** — Prisma Migrate (versiyonlu), Railway otomatik yedek; geri dönüş prosedürü.
- **Bağlantı** — TLS zorunlu, connection pool limiti (Railway), `DATABASE_URL` env'de.

---

## 3. Genel Güvenlik

- **Rate limiting** — Route handler/middleware seviyesinde IP + kullanıcı bazlı (özellikle auth, upload, public menü). Sliding window (örn. Upstash Redis veya in-memory + Railway).
- **CSRF / CORS** — Auth.js CSRF token; CORS yalnızca bilinen origin'ler.
- **Input validation** — Zod şemaları tüm Route Handler / Server Action girişlerinde.
- **Dosya yükleme güvenliği** — R2 **presigned URL**; sunucu tarafında MIME + boyut + uzantı doğrulama (video: mp4/webm boyut limiti; 3D: glb/usdz boyut limiti); dosya adı sanitizasyonu (path traversal yok).
- **Security headers** — CSP, HSTS, X-Content-Type-Options, Referrer-Policy (Next.js config / middleware).
- **GDPR / KVKK** — veri minimizasyonu, anonim müşteri profili, silme/dışa aktarma akışı, çerez/onay.
- **Secret yönetimi** — tüm sırlar env (Railway variables); repoda asla secret yok.
- **2FA** — TOTP zorunlu (panel kullanıcıları).

---

## 4. Auth & Yetkilendirme

- **Auth.js v5** — email/şifre (Credentials) + OAuth (Google); session stratejisi (JWT veya DB session).
- **Roller** — `SUPER_ADMIN`, `BUSINESS_OWNER`, `STAFF`, anonim müşteri (oturumsuz).
- **2FA akışı** — kayıt sonrası TOTP kurulum (secret + QR), girişte kod doğrulama, recovery kodları.
- **Erişim kontrolü** — middleware ile rota koruması (`/dashboard` → owner/staff, `/admin` → super-admin); Server Action'larda rol + tenant kontrolü.

---

## 5. Medya Pipeline (Cloudflare R2)

- **Yükleme akışı** — istemci yükleme isteği → sunucu presigned PUT URL üretir (tip/boyut limitleri ile) → istemci doğrudan R2'ye yükler → sunucu kaydı `Product.*Url` günceller.
- **Tipler** — görsel (WebP'e dönüştürme/optimizasyon), **video** (mp4/webm, boyut limiti, opsiyonel transcode notu), **3D model** (GLB web + USDZ iOS AR için).
- **Teslimat** — R2 public/CDN URL; cache header'ları; büyük dosyalar için lazy yükleme (frontend).
- **Temizlik** — ürün silinin­ce ilişkili R2 nesnelerinin temizliği (arka plan işi).

---

## 6. İşletme Paneli İşlemleri (API / Server Actions)

- Menü CRUD, kategori/ürün CRUD + sıralama (sürükle-bırak persist).
- Ürün medya yükleme (presigned URL üretimi).
- Tema/şablon güncelleme (`ThemeConfig` upsert).
- Çoklu menü & zamanlama (schedule), sold-out toggle.
- Menü versiyonlama — snapshot oluştur / geri yükle.
- CSV/Excel import (parse + Zod doğrulama + toplu insert).
- QR kod üretimi (dinamik, masa bazlı) — URL imzalama opsiyonu.
- Analitik sorguları — tarama/görüntüleme/heatmap/menü mühendisliği; PDF/Excel export.
- Staff davet & rol atama (işletme içi).

## 7. Admin Paneli İşlemleri (API / Server Actions)

- İşletme listeleme/arama, onay (`PENDING`→`ACTIVE`), askıya alma (`SUSPENDED`).
- Abonelik yönetimi (kademe/durum — fiyatlar TBD).
- Platform analitiği toplama (toplam tarama, aktif/ödeyen işletme, gelir, büyüme).
- Şablon moderasyonu + global layout şablon yönetimi, alerjen veri doğrulama.
- Kullanıcı & rol yönetimi (platform personeli).
- Audit log yazımı (kritik işlemler) ve sorgulama.

---

## 8. Performans & Altyapı

- **Deploy** — Railway (Next.js servisi + PostgreSQL eklentisi); env ile R2/Auth secret'ları.
- **Önbellekleme** — müşteri menüsü read-heavy → ISR/edge cache + DB sorgu cache; tema config cache.
- **Analitik yazımı** — `ScanEvent` hafif insert; ağır raporlar için zamanlanmış toplama (materialized view / cron) opsiyonu.
- **Hedefler** — LCP < 1.5s (menü), kurulum → yayın < 15 dk, offline çalışma (PWA — frontend).
- **Migration güvenliği** — geri-uyumlu migration'lar, deploy öncesi `prisma migrate deploy`.

## 9. Backend Yol Haritası (öneri sıralama)

1. Prisma şeması + migration + Auth.js (roller, 2FA).
2. Güvenlik temeli (rate limit, Zod, header'lar, tenant scope helper).
3. İşletme paneli API — menü/ürün CRUD + R2 presigned upload (görsel/video/3D).
4. Müşteri menü read API + tema config servisi.
5. Analitik (ScanEvent) + versiyonlama + QR.
6. Admin API (işletme/abonelik/moderasyon/audit).
