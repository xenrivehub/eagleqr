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
