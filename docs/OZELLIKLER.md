# Eagle QR — Özellikler

Çok kiracılı (multi-tenant) QR menü SaaS platformu. Restoran/kafeler için dijital menü.
**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Prisma 7 + PostgreSQL (Railway) · Auth.js v5 · Cloudflare R2 · OpenRouter (AI).

> Bu doküman mevcut özelliklerin özetidir. Son güncelleme: 31 Mayıs 2026.

---

## 1. Genel / Pazarlama

- **Landing page** (`/`) — hero, özellikler, "nasıl çalışır", **fiyatlandırma** (Standart/Pro/Max paketleri, "Yakında"), SSS, footer.
- **Yasal sayfalar** — Kullanım Koşulları (`/kullanim-kosullari`, alerjen sorumluluk maddesi dahil), Gizlilik Politikası (`/gizlilik`), KVKK Aydınlatma Metni (`/kvkk`).
- **Auth** — e-posta/şifre, rol tabanlı (SUPER_ADMIN / BUSINESS_OWNER), ayrı admin girişi (`/admin/login`), JWT oturum.

## 2. Müşteri Menüsü (`/m/[slug]`)

- **Temalı dijital menü** — 11 hazır tema; her tema sadece renk/font değil **yapısal stiller** de taşır (kemer görseller, hero kart/çerçeve/overlay, liste/kart/numaralı/à-la-carte düzenleri, segment/pill sekmeler, kutulu/pill fiyat).
- **Arama + filtre çipleri** (Şefin Seçimi / Popüler / Yeni).
- **Çok dil** — müşteri sağ üstten dil seçer; ürün adı/açıklama + kategori + alerjen + tüm arayüz metinleri çevrilir. Çevirisi olan diller görünür, yoksa TR'ye düşer. **Arapça vb. için RTL** düzen. Seçim localStorage + cookie'de saklanır.
- **Alerjen filtresi** — müşteri kaçındığı alerjenleri seçer; içeren ürünler **soluklaşır + "⚠ … içerir" rozeti** alır (gizlenmez). Anonim, localStorage'da kalıcı.
- **Para birimi** — işletmenin seçtiği birim ve sembol konumuyla (₺85 / 85 €) gösterilir.
- **Yıldız puanı** — anonim 1-5 yıldız (yorumsuz); kartlarda ★ortalama rozeti.
- **Zincir işletme** — şube seçici ekranı, şubeye özel menü/iletişim.

### Ürün Detay Sayfası (`/m/[slug]/urun/[id]`)
- Büyük görsel **veya** ürünün videosu varsa **görselin yerinde sessiz/otomatik/döngü video**.
- **3D/AR:** model varsa kalori satırında parlak **"Masamda Görüntüle"** butonu → `<model-viewer>` ile AR (web 360°, Android'de AR'da gör).
- Yıldız puanlama widget'ı, alerjen bilgisi + uyarı şeridi, **"Yanında iyi gider"** eşleşen ürün şeridi, benzer seçimler.

## 3. İşletme Paneli (`/dashboard`)

- **Menü editörü** — kategori/ürün CRUD, **sürükle-bırak sıralama** (dnd-kit; dokunmatik+klavye), sıralama müşteri menüsüne birebir yansır.
- **Ürün medyası** — görsel (R2), **video** (Pro/Max), **3D model GLB** (Max) yükleme; plan/kota kapalıysa kilitli görünür.
- **AI açıklama önerisi** — "✨ AI ile açıklama öner" → öneri kutusu → Kullan/Yeniden öner/Kapat.
- **Eşleşen ürün ("Yanında iyi gider")** — manuel seç veya **AI ile öner** (menüdeki ürünlerden), onayla → kaydet.
- **Toplu içe aktarma (CSV)** — şablon indir, yükle, **önizleme + onay** (kaç geçerli/hatalı), eksik kategori otomatik oluşur, tekrar atlanır.
- **Menüyü çevir** — açık dillere tek tıkla AI çevirisi (DB'ye cache'lenir).
- **Tema seçici** (`/dashboard/tema`) — canlı önizlemeli; kilitli temalar "iletişime geçin".
- **Vitrin/Hero** — kapak görseli, hero başlık/alt metin.
- **Ayarlar** — işletme bilgileri, logo, iletişim, **para birimi**, **yıldız puanı aç/kapat**; zincirde şubeye özel iletişim.
- **QR kod** — oluştur/indir. **Analitik** (aşağıda). **Şube yönetimi** — ekle/düzenle/sil, içerik kopyalama, şube değiştirici.

### Analitik (`/dashboard/analytics`)
- Tarih aralığı (7/30/90 gün), zincirde şube/tüm işletme kapsamı.
- Tarama, görüntüleme, **ilgi oranı** (görüntüleme/tarama).
- **Yoğunluk ısı haritası** (gün × saat, yerel saat) — en yoğun saatler.
- Günlük tarama grafiği, **kategori** + **tüm ürün** popülerliği (oranlı çubuklar).

## 4. Admin Paneli (`/admin`)

- **İşletmeler** — onay/askı, tür (tekil/zincir), **plan** (Standart/Pro/Max), **ekstra medya kotası** (plan dışı video/AR hakkı), **premium tema erişimi** (işletmeye özel açma).
- **Plan Limitleri** (`/admin/plans`) — plan başına video/AR adet limiti (dinamik).
- **Diller & Çeviri** (`/admin/languages`) — dil ekle/aç-kapat (RTL dahil), AI çeviri modelini seç.
- **Para Birimleri** (`/admin/currencies`) — ekle/aç-kapat, sembol konumu (sol/sağ), ondalık/boşluk.
- **Arayüz Metinleri** (`/admin/ui-strings`) — müşteri menüsündeki sabit etiketlerin çevirilerini dil bazında düzenle.

## 5. Üyelik Planları (medya yetkileri)

| Plan | Görsel | Video | AR/3D | Temalar |
|------|:------:|:-----:|:-----:|---------|
| **Standart** | ✓ | ✗ | ✗ | 2 ücretsiz (Mineral, Maison) |
| **Pro** | ✓ | ✓ | ✗ | + 1 premium tema |
| **Max** | ✓ | ✓ | ✓ | Tüm temalar |

- Plan limitleri **admin panelinden dinamik**; admin ayrıca işletmeye **plan dışı ekstra kota** verebilir.

## 6. Altyapı / Çapraz Kesit

- **Multi-tenant** — `businessId` ile satır izolasyonu; tüm aksiyonlarda sahiplik doğrulaması.
- **Medya** — Cloudflare R2 presigned upload (görsel/video/GLB).
- **AI** — OpenRouter (çeviri, açıklama, eşleşme önerisi); model admin'den seçilir.
- **Dinamik yönetim** — tema, plan limiti, dil, para birimi, arayüz metni: hepsi admin panelinden, kod değişikliği gerektirmeden.
- **Spam koruması (puanlama)** — anonId çerezi (cihaz başına 1 oy) + IP hash + hız limiti (KVKK için IP hash'lenir).

---

## Yapılacaklar (yol haritası)

Efor: `S` küçük · `M` orta · `L` büyük. *(italik)* = altyapı kısmen mevcut.

### Menü yönetimi
- [ ] Ürün varyasyonları (boy + ekstra malzeme, çoklu fiyat) `L`
- [ ] Stokta yok toggle `S` — *`isSoldOut` alanı var, UI eksik*
- [ ] Kampanya rozetleri (İndirimde / Günün Menüsü / Happy Hour) `S` — *rozet altyapısı var*
- [ ] Toplu fiyat güncelleme (% zam vb.) `M`
- [ ] Menü/kategori kopyalama (şubeler arası) `M` — *kısmen var*
- [ ] Menü zamanlaması (kahvaltı/öğle/akşam otomatik) `M` — *`MenuSchedule` enum'u var*
- [ ] Özel gün menüleri (Ramazan/yılbaşı geçici) `M`

### Yayın & güvenlik
- [ ] Taslak / Yayınlama sistemi `L`
- [ ] Audit log (işlem geçmişi) `M` — *`AuditLog` modeli var*
- [ ] Geri alma / Undo (silinen ürün-kategori) `M`
- [ ] Bakım modu (ziyaretçiye bilgi ekranı) `S`
- [ ] 2FA + şifre sıfırlama `M`
- [ ] Genel güvenlik denetimi `M`

### Müşteri deneyimi
- [ ] Favori ürünler (cihazda) `S`
- [ ] Sesli menü (TTS, tarayıcı Web Speech) `S-M`
- [ ] Harita entegrasyonu (konuma navigasyon) `S`
- [ ] Sosyal medya bağlantıları `S`
- [ ] PDF menü çıktısı `M`
- [ ] SEO dostu ürün sayfaları (+ structured data/sitemap) `M`
- [ ] PWA / offline önbellek `M`

### AI (OpenRouter altyapısı üstüne)
- [ ] AI menü asistanı (müşteri soru sorar) `M-L`
- [ ] AI menü optimizasyonu (analitiğe göre işletmeye öneri) `M`

### Analitik (mevcut altyapı üstüne)
- [ ] Şube karşılaştırma (geliştirme) `S-M` — *kısmen var*
- [ ] Dil analitiği `M`
- [ ] Alerjen analitiği (en çok filtrelenen) `M`
- [ ] Lokasyon analitiği (ülke/şehir, IP-geo) `M`

### Teknik (ileride / opsiyonel)
- [ ] QR tasarım özelleştirme (logo/renk/çerçeve) `M`
- [ ] E-posta bildirimleri `M`
- [ ] Webhook / API `L`
- [ ] Canlı kur dönüşümü (turist modu) `M`
- [ ] Kullanıcı profili + çapraz restoran öneri motoru `L`
- [ ] Menü mühendisliği (kâr-marj — satış/maliyet verisi gerekir) `L`

### Kapsam dışı (bilinçli)
- WhatsApp sipariş, garson çağırma / hesap iste → sipariş/servis domaini.
- Ürün karşılaştırma analitiği → mevcut "ürün popülerliği" karşılıyor.
