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
