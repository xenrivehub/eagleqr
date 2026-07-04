# Eagle Menu — Proje Dokümantasyonu

> Bu dosya; QR_MENU, FRONTEND_PLAN, BACKEND_PLAN ve docs/ altındaki planlama
> notlarının tek dosyada birleştirilmiş halidir. (Otomatik toplandı)


---

# ► Kaynak: QR_MENU.md

# QR Menü Sistemi — MVP Dokümanı

**Versiyon 1.0 • Mayıs 2026**  
15+ rakip analizi ile hazırlanmıştır.

---

# 1. Yönetici Özeti

QR Menü Sistemi, restoran ve cafe işletmelerinin fiziksel menü ihtiyacını ortadan kaldıran, hem işletme sahibi hem de müşteri için uçtan uca kişiselleştirilmiş bir dijital menü platformudur.

Piyasadaki 15+ rakip analiz edilmiş; mevcut çözümlerin hiçbirinin sunmadığı kullanıcı kimlik profili ve çapraz restoran öneri motoru bu sistemin temel rekabet avantajını oluşturmaktadır.

| Analiz edilen rakip | Toplam özellik | Fark yaratan | Hedef kullanıcı    |
| ------------------- | -------------- | ------------ | ------------------ |
| 15+                 | 80+            | 6 benzersiz  | Restoran & Müşteri |

---

# 2. Problem & Fırsat

## 2.1 Mevcut Sorunlar

- Basılı menüler: güncelleme maliyeti yılda 200–500$, baskı süresi kayıpları
- PDF menüler: mobilde okunaksız, zoom gerektirir, statik yapı
- Mevcut QR menü rakipleri: işletme odaklı — müşteriyi anonim ziyaretçi görür
- Alerjen bilgisi eksik ya da yetersiz — AB regülasyonu uyumsuzluk riski
- Çok dil desteği ya yok ya da makine çevirisiyle kötü kalitede

## 2.2 Pazar Fırsatı

- QR kod menü pazarı 2026 itibarıyla yıllık %20 büyüyor
- Tüketicilerin %78'i QR menüleri fiziksel menüye tercih ediyor
- Rakip platformlar 50–200$/ay/lokasyon alıyor
- Kullanıcı profili + çapraz restoran önerisi: rakiplerin hiçbiri yapmıyor

---

# 3. Ürün Vizyonu & Farklılaştırıcılar

Hedef: Hem restorana hem müşteriye değer katan, rakiplerin ortalamasındaki tüm özellikleri barındıran ve hiçbirinin sunmadığı kullanıcı profil katmanını içeren tek QR menü platformu olmak.

## 3.1 Rakiplerden Fark Yaratan 6 Özellik

| Özellik                      | Açıklama                                   | Rakiplerde durumu |
| ---------------------------- | ------------------------------------------ | ----------------- |
| Kullanıcı profil sistemi     | Alerjen, dil, favori mutfak, acı toleransı | Hiçbirinde yok    |
| Çapraz restoran öneri motoru | Kişiye özel öneriler                       | Hiçbirinde yok    |
| AI menü mühendisliği         | Marj odaklı öneriler                       | Çok azında        |
| Ürün hazırlanış videosu      | 30 sn kısa clip (ürün karta gömülü)        | Hemen hiçbirinde  |
| Arttırılmış Gerçeklik (AR)   | model-viewer ile 3D/AR ürün önizleme       | Hiçbirinde yok    |
| Menü versiyonlama            | Tek tıkla geri dönüş                       | Yok               |
| Eşleşen içecek önerisi       | Yemek–içecek pairing                       | Yok               |

---

# 4. Kullanıcı Profil Sistemi

## 4.1 Profil İçeriği

| Veri alanı       | Açıklama                     | Kullanım amacı      |
| ---------------- | ---------------------------- | ------------------- |
| Alerjen listesi  | 14 AB kategorisi + tercihler | Otomatik filtreleme |
| Favori mutfaklar | Çoklu seçim                  | Otomatik sıralama   |
| Acı toleransı    | Hiç / Az / Orta / Çok        | Kişisel uyarı       |
| Puanlama geçmişi | Yıldız verileri              | Öneri motoru        |
| Dil tercihi      | Tek seçim                    | Global kullanım     |
| Ziyaret geçmişi  | Restoran ziyaretleri         | Sadakat & öneri     |

## 4.2 Kullanıcı Yolculuğu

1. QR tara → anonim menü açılır
2. “Alerjenimi kaydet” daveti
3. Menü otomatik filtrelenir
4. Sistem öğrenmeye başlar
5. Collaborative filtering devreye girer

---

# 5. Müşteri Deneyimi Özellikleri

## 5.1 Menüye Erişim & Navigasyon

- PWA destekli anlık açılış
- Masa bazlı QR sistemi
- Offline önbellekleme
- Karanlık/Aydınlık mod
- NFC desteği (Faz 2)

## 5.2 Ürün Listeleme & Filtreleme

- Anlık arama
- Alerjen filtreleri
- Kalori ve besin değerleri
- Fiyat filtreleme
- Popüler / Chef's Special etiketleri
- Dinamik öneri bandı

## 5.3 Çok Dil & Lokalizasyon

Desteklenen diller:

- TR
- EN
- DE
- FR
- AR
- RU
- ZH
- JA
- ES
- IT

## 5.4 Ürün Detay & Geri Bildirim

- Büyük ürün görselleri
- Videolu ürün — hazırlanış / tanıtım videosu (30 sn)
- 3D / AR ile görüntüleme — model-viewer (webde 360°, mobilde “AR’da gör”)
- Eşleşen içecek önerisi
- Yıldız puanı ve yorum
- “Diğerleri de baktı” alanı

---

# 6. İşletme Sahibi Paneli

## 6.1 Menü Yönetimi

- Sürükle-bırak editör
- Excel/CSV import
- Sold-out yönetimi
- Menü versiyonlama
- AI destekli açıklama oluşturma

## 6.2 Çoklu Menü Yönetimi

- Sabah/öğle/akşam menüsü
- Mevsimlik menü
- Özel gün menüsü

## 6.3 Analitik & Raporlama

- Tarama sayısı
- Ürün görüntüleme analizi
- Heatmap
- Masa analizi
- Menü mühendisliği
- PDF/Excel export

---

# 7. Teknik Mimari

## 7.1 Performans Hedefleri

| Metrik          | Hedef         |
| --------------- | ------------- |
| LCP             | < 1.5 saniye  |
| Kurulum → yayın | < 15 dakika   |
| Offline çalışma | Destekleniyor |

## 7.2 Teknoloji Kararları

- Next.js fullstack (App Router · Server Actions + Route Handlers), React 19, TypeScript
- PostgreSQL + Prisma ORM — deploy: Railway
- Cloudflare R2 (S3 uyumlu, CDN) — görsel / video / 3D model depolama
- Auth.js (NextAuth v5) + 2FA zorunluluğu, rol tabanlı erişim
- `<model-viewer>` web component — 3D / AR ürün önizleme (GLB/USDZ)
- PWA mimarisi · WebP + CDN · dinamik QR
- GDPR / KVKK uyumluluğu

---

# 8. MVP Kapsamı

## 8.1 MVP’ye Girecekler (0–3 ay)

| Özellik             | Öncelik |
| ------------------- | ------- |
| QR menü görüntüleme | Kritik  |
| Menü editörü        | Kritik  |
| Çok dil desteği     | Kritik  |
| Alerjen filtreleme  | Kritik  |
| Temel analitik      | Yüksek  |
| Kullanıcı profili   | Yüksek  |
| Videolu ürün        | Yüksek  |
| AR / 3D ürün (model-viewer) | Yüksek  |

## 8.2 Faz 2

- Menü versiyonlama
- Çoklu şube
- Kampanya sistemi
- WhatsApp entegrasyonu

## 8.3 Faz 3

- POS entegrasyonu
- White-label
- API erişimi
- NFC
- Sesli erişilebilirlik

---

# 9. Fiyatlandırma

> **TBD —** Fiyatlandırma stratejisi (kademeler, fiyatlar, ücretsiz limitler) **uygulama aşamasında ayrıca belirlenecektir.** Bu doküman fiyatlandırmayı bilinçli olarak açık bırakır; ilgili ekran (Landing Page pricing bölümü) "Yakında" durumunda geliştirilecektir.

---

# 10. Başarı Metrikleri

| Metrik              | Ay 3 Hedef |
| ------------------- | ---------- |
| Kayıtlı işletme     | 50         |
| Ödeme yapan işletme | 20         |
| Son kullanıcı       | 5.000      |
| Aylık QR tarama     | 30.000     |

---

# 11. Riskler

| Risk                | Çözüm              |
| ------------------- | ------------------ |
| Kayıt sürtünmesi    | Anonim kullanım    |
| Alerjen sorumluluğu | Veri doğrulama     |
| GDPR riski          | Veri minimizasyonu |
| Büyük rakipler      | Veri hendeği       |

---

# 12. Sonuç

QR Menü Sistemi, klasik QR menü çözümlerinden farklı olarak kullanıcı profil katmanını merkeze alan bir platform yaklaşımı sunmaktadır.

En güçlü tarafı:

- Çapraz restoran kullanıcı profili
- Ölçeklendikçe güçlenen öneri motoru

Bu yapı uzun vadede ciddi bir veri avantajı ve rekabet hendeği oluşturabilir.


---

# ► Kaynak: FRONTEND_PLAN.md

# QR Menü Sistemi — Frontend Planı

**Proje:** eagle-qr · **Tarih:** Mayıs 2026
**İlgili dokümanlar:** [QR_MENU.md](./QR_MENU.md) (MVP) · [BACKEND_PLAN.md](./BACKEND_PLAN.md)

---

## 0. Teknoloji & Genel Yaklaşım

| Karar | Seçim |
| --- | --- |
| Framework | Next.js 16 (App Router) · React 19 · TypeScript |
| Stil | Tailwind CSS 4 (tema token'ları) |
| Auth (istemci) | Auth.js (NextAuth v5) client/server helpers |
| 3D / AR | `<model-viewer>` web component (GLB / USDZ) |
| i18n | 10 dil (TR, EN, DE, FR, AR, RU, ZH, JA, ES, IT) — `next-intl` veya App Router dil segmentleri |
| PWA | Service worker + offline cache (müşteri menüsü) |
| Deploy | Railway |

**Performans hedefi:** LCP < 1.5s (müşteri menüsü kritik). Görseller WebP + CDN (R2), kod bölme, sunucu bileşenleri varsayılan.

**Tasarım sistemi:** Tailwind tema token'ları (renk/spacing/tipografi), karanlık/aydınlık mod, erişilebilirlik (klavye + ARIA), tutarlı bileşen kütüphanesi (button, input, modal, card, table).

**Rota / layout haritası:**

```
app/
  (marketing)/          → Landing (public)
  (auth)/               → login, register, forgot-password, 2fa
  dashboard/            → İşletme paneli (business-owner, staff)
  admin/                → Platform paneli (super-admin)
  m/[slug]/             → Müşteri menüsü (public, dinamik tema)
```

---

## 1. SaaS Landing Page — `/`

**Amaç:** Ziyaretçiyi kayda dönüştürmek; ürün değerini ve farklılaştırıcıları anlatmak.

**Bölümler / bileşenler:**
- Hero — başlık, alt başlık, CTA ("Ücretsiz başla" → `/register`), ürün görseli/mockup.
- Farklılaştırıcılar — kullanıcı profili, çapraz restoran önerisi, **videolu ürün**, **AR/3D ürün**, menü versiyonlama (kart grid).
- Canlı demo / örnek menü linki (`/m/demo`).
- Özellik bölümleri (müşteri deneyimi · işletme paneli · analitik).
- **Fiyatlandırma bölümü — "Yakında" durumunda** (TBD; bkz. QR_MENU.md §9). Kademe iskeleti gösterilir, fiyatlar boş/placeholder.
- SSS, footer (yasal linkler, dil seçici).

**Teknik:** SSG/ISR (static), SEO (metadata, OpenGraph, sitemap), LCP optimizasyonu (hero görseli öncelikli yükleme).

---

## 2. Login / Register UI — `/login`, `/register`, `/forgot-password`, 2FA

**Amaç:** Auth.js üzerinden güvenli kayıt/giriş ve 2FA.

**Ekranlar:**
- **Register** — email/şifre + OAuth (Google), işletme adı, şartlar onayı.
- **Login** — email/şifre + OAuth; hatalı giriş durumları.
- **2FA doğrulama** — TOTP kodu girişi (kayıt sonrası 2FA kurulum ekranı: QR + secret).
- **Forgot / reset password** — email ile token akışı.

**Durumlar:** yükleniyor, hata (geçersiz kimlik/kilitlenme), başarı, rate-limit uyarısı.

**Yönlendirme (rol tabanlı):** business-owner/staff → `/dashboard`, super-admin → `/admin`. Middleware ile korunan rotalar.

**Teknik:** Form validasyonu (Zod + react-hook-form), Auth.js server actions, CSRF korumalı formlar.

---

## 3. İşletme Arayüzü (Business Dashboard) — `/dashboard/*`

**Amaç:** İşletme sahibinin menüyü, medyayı, temayı ve analitiği yönetmesi.

**Modüller:**

| Modül | Rota | İçerik |
| --- | --- | --- |
| Genel bakış | `/dashboard` | Özet kartlar (bugünkü tarama, popüler ürün, sold-out sayısı). |
| Menü editörü | `/dashboard/menu` | Sürükle-bırak kategori/ürün sıralama, ürün CRUD, AI açıklama önerisi, CSV/Excel import. |
| Ürün medyası | ürün düzenleme | Görsel + **video** + **GLB/USDZ 3D model** yükleme → R2 presigned upload, önizleme (model-viewer ile 3D test). |
| Çoklu menü | `/dashboard/menu/schedules` | Sabah/öğle/akşam, mevsimlik, özel gün menüleri; zaman bazlı aktiflik. |
| Versiyonlama | `/dashboard/menu/versions` | Versiyon listesi, tek tıkla geri dönüş (diff görünümü). |
| Sold-out | menü editörü içi | Hızlı ürün stok-dışı toggle. |
| Tema / şablon | `/dashboard/theme` | Layout preset seçimi (3-5 şablon) + renk/font/logo/arka plan; **canlı önizleme** (müşteri menüsünü iframe/preview ile render). |
| QR kod | `/dashboard/qr` | Dinamik QR üretimi, masa bazlı QR, indirme (PNG/SVG/PDF). |
| Analitik | `/dashboard/analytics` | Tarama sayısı, ürün görüntüleme, heatmap, masa analizi, menü mühendisliği; PDF/Excel export. |
| Ayarlar | `/dashboard/settings` | İşletme bilgisi, kullanıcılar (staff davet), dil, abonelik durumu. |

**Durumlar:** boş durum (ilk kurulum sihirbazı — "15 dk'da yayında" hedefi), kaydetme/yükleme, yükleme ilerleme çubuğu (büyük video/3D dosyaları).

---

## 4. Admin Arayüzü (Platform) — `/admin/*`

**Amaç:** Platform sahibinin tüm işletmeleri, abonelikleri ve içeriği yönetmesi. Yalnızca super-admin erişimi.

**Modüller:**

| Modül | Rota | İçerik |
| --- | --- | --- |
| İşletme yönetimi | `/admin/businesses` | Tüm işletmeleri listele/ara/filtrele, onayla, askıya al, detay görüntüle. |
| Abonelik & ödeme | `/admin/subscriptions` | Kademe ve ödeme durumu, manuel kademe değişikliği. |
| Platform analitiği | `/admin/analytics` | Toplam QR tarama, aktif/ödeyen işletme, son kullanıcı, gelir, büyüme (QR_MENU.md §10 metrikleri). |
| Şablon moderasyonu | `/admin/templates` | Global layout şablonları yönetimi, uygunsuz içerik moderasyonu, alerjen veri doğrulama. |
| Kullanıcı & rol | `/admin/users` | Platform personeli rolleri, destek erişimi. |
| Audit log | `/admin/audit` | Kritik işlem geçmişi (filtreli tablo). |

**Teknik:** Yoğun tablo bileşenleri (sıralama/sayfalama/filtre), rol bazlı görünürlük, server-side veri çekimi.

---

## 5. Müşteri Menü Arayüzü (Dinamik) — `/m/[slug]` (+ `?table=`)

**Amaç:** QR taranınca açılan, **her işletmeye özel temalı** müşteri deneyimi. En kritik performans ve UX katmanı.

### 5.1 Dinamik Tema Engine

Her işletmenin teması DB'de JSON config olarak tutulur (bkz. BACKEND_PLAN.md `ThemeConfig`). Frontend bu config'i okuyup render eder.

```ts
type ThemeConfig = {
  layoutPreset: "classic" | "grid" | "magazine" | "compact" | "story"; // 3-5 hazır şablon
  colors: { primary: string; secondary: string; background: string; surface: string; text: string };
  typography: { headingFont: string; bodyFont: string };
  branding: { logoUrl: string; coverUrl?: string };
  options: { showRatings: boolean; showCalories: boolean; darkModeDefault: boolean };
};
```

- **Layout preset** → hangi düzen bileşeninin kullanılacağını seçer (kategori sekmeli, grid, dergi tarzı vb.).
- **Token uygulama** → renk/font değerleri CSS değişkenlerine (`--color-primary` …) basılır; Tailwind bu değişkenler üzerinden stillenir. Böylece tek render motoru tüm işletmelere custom görünüm sağlar.
- Server component config'i çeker → tema sağlayıcı (provider) ile alt ağaca dağıtır.

### 5.2 Özellikler

- **PWA** — anlık açılış, offline cache (son görülen menü), "ana ekrana ekle".
- **Çok dil** — 10 dil seçici, içerik çevirileri.
- **Navigasyon & filtre** — kategori sekmeleri, anlık arama, alerjen filtresi, fiyat filtresi, Chef's Special / popüler etiketleri, dinamik öneri bandı.
- **Ürün detay** (modal/sayfa):
  - Büyük görsel galerisi
  - **Videolu ürün** — gömülü oynatıcı (lazy load)
  - **3D / AR** — `<model-viewer src="model.glb" ios-src="model.usdz" ar>` → webde 360° döndürme, mobilde "AR'da gör"
  - Kalori/besin değeri, alerjen rozetleri
  - Eşleşen içecek önerisi, yıldız puanı + yorum, "diğerleri de baktı"
- **Anonim profil daveti** — "Alerjenini kaydet" → otomatik filtre; profil yerel + (opsiyonel) hesap ile senkron.
- **Karanlık/aydınlık mod**, masa bazlı bağlam (`?table=`).

### 5.3 Performans

- Server components ile ilk render, görseller WebP + R2 CDN, video/3D lazy + iskelet (skeleton).
- LCP < 1.5s için kritik CSS inline, font preload, model/video yalnızca detay açılınca yüklenir.

---

## 6. Çapraz Kesen Konular

- **Tasarım sistemi & bileşen kütüphanesi** — paylaşılan UI primitifleri (`/components/ui`).
- **i18n stratejisi** — sözlük yapısı, çeviri eksik fallback (TR/EN).
- **Erişilebilirlik** — WCAG AA hedefi, klavye navigasyonu, kontrast (tema token'ları kontrol edilmeli).
- **Hata & boş durumlar** — tutarlı error boundary, toast bildirimleri.
- **State** — sunucu bileşenleri öncelikli; istemci state'i minimal (form, filtre).

## 7. Frontend Yol Haritası (öneri sıralama)

1. Tasarım sistemi + auth ekranları (login/register/2FA).
2. İşletme paneli — menü editörü + ürün medyası (görsel → video → 3D).
3. Müşteri menüsü — tema engine + ürün detay (video + model-viewer/AR).
4. İşletme paneli — tema seçici (canlı önizleme), QR, analitik.
5. Admin paneli.
6. Landing page (pricing "Yakında").


---

# ► Kaynak: BACKEND_PLAN.md

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


---

# ► Kaynak: docs/PROJE-TANITIM.md

# Eagle Menu — Proje Tanıtımı

> **Eagle Menu**, restoran ve kafeler için tasarlanmış, çok kiracılı (multi-tenant) **QR dijital menü platformudur.** Amacı bir sipariş/adisyon (POS) sistemi olmak değil; menüyü mümkün olan en iştah açıcı, en akıllı ve en "yaşayan" hâle getirerek **masadaki ortalama harcamayı ve müşteri etkileşimini artırmaktır.** Kısaca: bir pazarlama platformu.

**Alan adı:** eaglemenu.com

---

## 1. Eagle Menu Nedir?

İşletmeler dakikalar içinde hesap açar, menülerini oluşturur ve bir QR kod ile yayınlar. Müşteriler herhangi bir uygulama indirmeden, telefonlarının kamerasıyla QR'ı okutup menüye anında ulaşır. Ama bu sıradan bir PDF menü değildir:

- Ürünler **videoyla** canlanır,
- **3D / AR** ile müşteri ürünü kendi masasında gerçek boyutuyla görebilir,
- Menü **farklı dillere** tek tıkla çevrilir,
- **Alerjen ve içerik bilgisi**, **kampanyalar**, **mutlu saatler** ve daha fazlası içerir.

İşletme her şeyi kendi panelinden yönetir; platform sahibi ise gelişmiş bir admin panelinden tüm sistemi (planlar, diller, içerikler, anasayfa, fiyatlar) dinamik olarak yapılandırır.

---

## 2. Kimler İçin?

- **Tekil işletmeler:** Tek lokasyonlu kafe, restoran, pastane.
- **Zincir işletmeler:** Birden çok şubesi olan markalar — her şube kendi teması, iletişimi, fiyatı ve hatta bakım moduyla **bağımsız** yönetilir; marka geneli ayarlar ortak kalır.

---

## 3. Müşteri Menüsü (QR ile açılan taraf)

Müşterinin gördüğü, markaya özel tasarlanmış mobil-öncelikli menü deneyimi:

| Özellik | Açıklama |
|---|---|
| **Temalı menü** | 11 hazır tema; renk/font + yapısal stiller (kart, liste, à-la-carte, kemer görsel vb.). |
| **Videolu ürünler** | Ürün görselinin yerinde sessiz, otomatik döngü oynayan iştah açıcı video. |
| **3D / AR — "Masamda Görüntüle"** | Müşteri ürünü 360° döndürür ve telefonuyla gerçek boyutta masasına yerleştirir. Uygulama gerekmez. |
| **Çok dil + AI çeviri** | Menü farklı dillere yapay zekayla çevrilir; RTL ve dil seçici dahil. |
| **Alerjen filtresi** | Müşteri kaçındığı alerjeni seçer; uyan ürünler soluklaşır + uyarı rozeti (anonim, kalıcı). |
| **Gramaj & porsiyon** | Ürün başına gramaj/hacim, porsiyon ve kalori bilgisi. |
| **Para birimi** | İşletmenin/şubenin seçtiği birim ve sembol konumuyla. |
| **Yıldız puanı** | Anonim 1-5 yıldız (yorumsuz); spam koruması (anonId + IP hash + hız limiti). İşletme kapatabilir. |
| **Kampanya & Mutlu Saatler** | Ürün/kategori bazlı kampanya rozetleri + indirimli fiyat; saate/tarihe göre otomatik. |
| **Servis saatleri** | Kategori/ürün tanımlı saat dışında otomatik gizlenir. |
| **Tükendi** | Stokta olmayan ürün soluk + "Tükendi" rozeti. |
| **Bakım modu** | (Şubeye özel) açıkken menü yerine bilgilendirme ekranı. |
| **Footer** | Harita "yol tarifi" + sosyal medya. |
| **Zincir** | Şube seçici; her şube kendi menüsü ve ayarlarıyla. |
| **"Yanında iyi gider"** | Ürün detayında manuel/AI ile eşleştirilmiş öneriler. |

---

## 4. İşletme Paneli (`/dashboard`)

İşletme sahibinin menüsünü ve görünümünü yönettiği yer:

- **Menü editörü:** Sürükle-bırak sıralama (dnd-kit), kategori/ürün CRUD, anlık "Tükendi" ve fiyat değişimi.
- **Ürün medyası:** Görsel + **video** (Pro/Max) + **3D model** (Max); plan/kotaya göre kilitli.
- **Varyasyonlar:** Boy/seçenek (L/M/S) + ekstra ücret.
- **Gramaj & porsiyon, kalori, hazırlık süresi.**
- **Kampanyalar & servis saatleri** (Pro+): ürün/kategori bazlı.
- **Toplu fiyat güncelleme** (Pro+): tüm menüye/kategoriye %/sabit zam-indirim.
- **AI açıklama & "yanında iyi gider" önerisi** (Pro+).
- **Fotoğraftan menü oluşturma (AI)** (Max): basılı menü fotoğrafını yapay zekaya okutup ürünleri toplu oluşturma — önizle, düzenle, ekle.
- **Toplu içe aktarma (CSV).**
- **Menüyü çevir** (Pro+): açık dillere AI çevirisi.
- **Tema seçici, Vitrin/Hero, QR özelleştirme** (renk/çerçeve/logo/alt yazı, PNG/SVG).
- **PDF menü** (Max): baskıya hazır A4 çıktı.
- **Ayarlar:** Tekil işletmede tek form; **zincirde her şube kendi ayarları** (logo, iletişim, harita, sosyal, tema, para birimi, bakım modu) + ayrı "marka geneli" bölümü.
- **Şube yönetimi:** ekle/düzenle/sil, içerik kopyalama, şube değiştirici.
- **Analitik:** tarama, görüntüleme, ilgi oranı; (Pro+) gün×saat yoğunluk ısı haritası, kategori/ürün popülerliği, tarih aralığı.

---

## 5. Admin Paneli (`/admin`) — Platform Yönetimi

Her şey dinamik ve admin'den yönetilebilir:

| Bölüm | Ne yapar |
|---|---|
| **İşletmeler** | Onay/askı, tür (tekil/zincir), plan, ekstra medya kotası, premium tema erişimi. |
| **Plan Limitleri** | Plan başına video/AR adet limiti. |
| **Plan Özellikleri** | Plan başına özellik aç/kapat (toplu fiyat, AI, çeviri, kampanya, gelişmiş analitik, PDF, fotoğraftan menü). |
| **Diller & Çeviri** | Dinamik dil ekleme + AI çeviri modeli seçimi. |
| **Para Birimleri** | Dinamik para birimi + sembol konumu. |
| **Arayüz Metinleri** | Menüdeki sabit etiketlerin çevirileri. |
| **Kampanya Etiketleri** | Renkli, çok dilli kampanya rozetleri. |
| **SEO Ayarları** | Sayfa tipi bazında (anasayfa, menü, ürün, şube) başlık/açıklama şablonları (`{business}`, `{product}`, `{branch}` yer tutucuları). |
| **Sayfalar** | Blok tabanlı sayfa oluşturucu (`/slug`): Hero, Metin+Görsel, Kart grid, İstatistik, CTA, SSS, Zengin metin, Görsel. Taslak/Yayın + SEO. **Yasal sayfalar (Kullanım, Gizlilik, KVKK) da buradan düzenlenir.** |
| **Navbar** | Mega-menü kurucusu: ikon (Lucide) + açıklamalı, gruplu açılır menüler; sayfalara veya URL'lere link. |
| **Anasayfa** | Landing'i bölüm bölüm düzenleme (Hero, istatistik, adımlar, özellikler, SSS, CTA) — görünüm korunarak. |
| **Fiyatlandırma** | Plan kartları: ad, aylık/yıllık fiyat, özellik listesi, "En Popüler", hediye rozeti. |

---

## 6. Üyelik Planları

| Plan | Görsel | Video | AR/3D | Öne çıkan |
|---|:--:|:--:|:--:|---|
| **Standart** | ✓ | ✗ | ✗ | 2 ücretsiz tema, QR, alerjen, yıldız, temel analitik |
| **Pro** | ✓ | ✓ | ✗ | + AI açıklama/çeviri, kampanya, gelişmiş analitik, toplu fiyat |
| **Max** | ✓ | ✓ | ✓ | + AR, tüm temalar, PDF menü, fotoğraftan menü (AI), çoklu şube |

Tüm özellikler **admin panelinden plan başına açılıp kapatılabilir**; arka planda da (server action) erişim kontrol edilir.

---

## 7. Teknoloji Mimarisi

- **Framework:** Next.js 16 (App Router, Server Actions + Route Handlers), React 19, TypeScript.
- **Stil:** Tailwind CSS v4; ikonlar **Lucide**.
- **Veritabanı:** PostgreSQL (Railway) + Prisma 7 (`@prisma/adapter-pg`).
- **Kimlik doğrulama:** Auth.js v5, rol tabanlı (SUPER_ADMIN / BUSINESS_OWNER), ayrı admin girişi.
- **Medya:** Cloudflare R2 (görsel/video/GLB), presigned upload.
- **Yapay zeka:** OpenRouter (çeviri, açıklama, eşleşme, **görselden menü okuma**); model admin'den seçilir.
- **AR:** `<model-viewer>` (GLB; web 360° + Android Scene Viewer).
- **SEO:** Dinamik şablonlar + canonical + OpenGraph/Twitter + Restaurant JSON-LD; `metadataBase: eaglemenu.com`.
- **Çapraz kesitler:** Multi-tenant satır izolasyonu (`businessId`), dinamik yönetim (her config DB'de + admin sayfası), puanlama spam koruması (KVKK uyumlu).

---

## 8. Tek Cümleyle

> Eagle Menu; kurulumu 15 dakika süren, video & AR ile fark yaratan, çok dilli ve tamamen admin'den yönetilebilen, zincirler için şube-bazlı bir **dijital menü pazarlama platformudur.**


---

# ► Kaynak: docs/OZELLIKLER.md

# Eagle QR — Özellikler

Çok kiracılı (multi-tenant) QR menü SaaS platformu. Restoran/kafeler için dijital menü.
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Prisma 7 + PostgreSQL (Railway) · Auth.js v5 · Cloudflare R2 · OpenRouter (AI) · dnd-kit · qrcode.

> Mevcut özelliklerin özeti. Son güncelleme: 31 Mayıs 2026.

---

## 1. Genel / Pazarlama
- **Landing page** (`/`) — hero, özellikler, "nasıl çalışır", **fiyatlandırma** (Standart/Pro/Max, "Yakında"), SSS, footer.
- **Yasal sayfalar** — Kullanım Koşulları (`/kullanim-kosullari`, alerjen sorumluluk maddesi), Gizlilik (`/gizlilik`), KVKK (`/kvkk`).
- **Auth** — e-posta/şifre, rol tabanlı (SUPER_ADMIN / BUSINESS_OWNER), ayrı admin girişi (`/admin/login`), JWT.

## 2. Müşteri Menüsü (`/m/[slug]`)
- **Temalı menü** — 11 tema; renk/font + **yapısal stiller** (kemer görsel, hero kart/çerçeve/overlay, liste/kart/numaralı/à-la-carte, segment/pill sekme, kutulu/pill fiyat).
- **Arama + filtre çipleri** (Şefin Seçimi / Popüler / Yeni).
- **Çok dil** — ürün ad/açıklama + kategori + alerjen + tüm arayüz metinleri çevrilir; sağ üstte dil seçici, **RTL** desteği, localStorage + cookie.
- **Alerjen filtresi** — kaçınılan alerjeni içeren ürün soluklaşır + "⚠ … içerir" rozeti (anonim, kalıcı).
- **Para birimi** — işletmenin seçtiği birim + sembol konumuyla (₺85 / 85 €).
- **Yıldız puanı** — anonim 1-5 (yorumsuz); kartlarda ★ortalama. (İşletme kapatabilir.)
- **🔥 Fırsatlar şeridi + kampanya rozetleri** — kampanyalı ürünler en üstte; kartlarda renkli rozet + (varsa) **indirimli fiyat** (eski üstü çizili).
- **Tükendi** — stoktaki olmayan ürün soluk + "Tükendi" rozeti.
- **Servis saatleri** — kategori/ürün, tanımlı saat dışında otomatik gizlenir.
- **Footer** — harita "Yol tarifi" butonu + sosyal medya ikonları.
- **Bakım modu** — açıkken menü yerine bilgilendirme ekranı.
- **Zincir işletme** — şube seçici, şubeye özel menü/iletişim.

### Ürün Detayı (`/m/[slug]/urun/[id]`)
- Video varsa **görselin yerinde sessiz/otomatik/döngü** oynar; 3D model varsa parlak **"Masamda Görüntüle"** (AR / `<model-viewer>`).
- **Varyasyonlar** — ortalanmış kutular (ikon + ad + "+ekstra ücret").
- Yıldız puanlama, alerjen bilgisi + uyarı şeridi, kampanya rozeti + indirimli fiyat, **"Yanında iyi gider"** + benzer seçimler.

## 3. İşletme Paneli (`/dashboard`)
- **Menü editörü** — kategori/ürün CRUD, **sürükle-bırak sıralama** (dnd-kit), müşteriye birebir yansır.
- **Ürün medyası** — görsel (R2) + **video** (Pro/Max) + **3D GLB** (Max); plan/kota kapalıysa kilitli.
- **Varyasyonlar** — ürüne dinamik: etiket (harf/ikon) + ekstra ücret.
- **Stokta yok** — ürün satırında tek tık toggle.
- **Kampanya** — ürüne ve **kategoriye** etiket (Happy Hour vb.) + saat/tarih aralığı; üründe kampanya fiyatı, kategoride % / sabit indirim.
- **Servis saatleri** — kategori/ürün bazında görünürlük penceresi.
- **Toplu fiyat güncelleme** — kapsam (tüm/kategori) × indirim/zam × %/sabit; önizleme → kalıcı (varyasyonlar opsiyonel, tam sayıya yuvarlanır).
- **AI açıklama önerisi** + **eşleşen ürün (AI ile öner)**.
- **Toplu içe aktarma (CSV)** — şablon + önizleme/onay.
- **Menüyü çevir** (açık dillere AI), **Tema seçici** (`/dashboard/tema`), **Vitrin/Hero**.
- **PDF menü** — zarif A4 çıktı (`/menu-pdf`), tarayıcıdan "PDF kaydet".
- **QR kod** — renk + çerçeve + alt yazı + ortaya logo özelleştirme, PNG/SVG indir.
- **Ayarlar** — işletme bilgileri, logo, iletişim, **para birimi**, **yıldız aç/kapat**, **bakım modu**, **harita linki**, **sosyal medya**; zincirde şubeye özel iletişim.
- **Şube yönetimi** — ekle/düzenle/sil, içerik kopyalama, şube değiştirici.

### Analitik (`/dashboard/analytics`)
- Tarih aralığı (7/30/90), zincirde şube/tüm kapsam.
- Tarama, görüntüleme, **ilgi oranı**; **yoğunluk ısı haritası** (gün×saat); günlük grafik; **kategori + tüm ürün** popülerliği.

## 4. Admin Paneli (`/admin`)
- **İşletmeler** — onay/askı, tür, **plan** (Standart/Pro/Max), ekstra medya kotası, premium tema erişimi.
- **Plan Limitleri** (`/admin/plans`) · **Diller & Çeviri** (`/admin/languages`, AI modeli dahil) · **Para Birimleri** (`/admin/currencies`).
- **Arayüz Metinleri** (`/admin/ui-strings`) · **Kampanya Etiketleri** (`/admin/campaigns`, renk + çeviri) · **SEO Ayarları** (`/admin/seo`).

## 5. Üyelik Planları (medya yetkileri)
| Plan | Görsel | Video | AR/3D | Temalar |
|------|:------:|:-----:|:-----:|---------|
| **Standart** | ✓ | ✗ | ✗ | 2 ücretsiz (Mineral, Maison) |
| **Pro** | ✓ | ✓ | ✗ | + 1 premium tema |
| **Max** | ✓ | ✓ | ✓ | Tüm temalar |

Limitler **admin'den dinamik**; işletmeye plan-dışı **ekstra kota** verilebilir.

## 6. Altyapı / Çapraz Kesit
- **Multi-tenant** — `businessId` satır izolasyonu + sahiplik doğrulaması.
- **Medya** — Cloudflare R2 presigned upload (görsel/video/GLB).
- **AI** — OpenRouter (çeviri, açıklama, eşleşme önerisi); model admin'den.
- **SEO** — dinamik title/description/keywords + OpenGraph/Twitter + canonical + Restaurant JSON-LD.
- **Dinamik yönetim** — tema, plan limiti, dil, para birimi, arayüz metni, kampanya, SEO: hepsi admin panelinden.
- **Spam koruması (puanlama)** — anonId çerezi + IP hash + hız limiti (KVKK).

---

## Yapılacaklar (yol haritası)
Efor: `S` · `M` · `L`. *(italik)* = altyapı kısmen mevcut.

### Yayın & güvenlik
- [ ] Taslak / Yayınlama sistemi `L`
- [ ] Audit log (işlem geçmişi) `M` — *`AuditLog` modeli var*
- [ ] Geri alma / Undo (silinen ürün-kategori) `M`
- [ ] 2FA + şifre sıfırlama `M`
- [ ] Genel güvenlik denetimi `M`

### Müşteri deneyimi
- [ ] Favori ürünler (cihazda) `S`
- [ ] Sesli menü (TTS, Web Speech) `S-M`
- [ ] PWA / offline önbellek `M`

### Menü yönetimi
- [ ] Menü/kategori kopyalama (şubeler arası) `M` — *kısmen var*

### AI
- [ ] AI menü asistanı (müşteri soru sorar) `M-L`
- [ ] AI menü optimizasyonu (analitiğe göre öneri) `M`

### Analitik
- [ ] Şube karşılaştırma (geliştirme) `S-M` — *kısmen var*

### Teknik (ileride / opsiyonel)
- [ ] E-posta bildirimleri `M`
- [ ] Webhook / API `L`
- [ ] Canlı kur dönüşümü (turist modu) `M`
- [ ] Kullanıcı profili + çapraz restoran öneri motoru `L`
- [ ] Menü mühendisliği (kâr-marj — satış/maliyet verisi gerekir) `L`

### Askıya alındı / kapsam dışı
- **Özel gün menüleri** (Ramazan/yılbaşı) — şimdilik askıda; gerekirse tarih aralıklı kategori ile.
- WhatsApp sipariş, garson çağırma → sipariş/servis domaini.
- Dil / alerjen / lokasyon analitiği — listeden çıkarıldı.
