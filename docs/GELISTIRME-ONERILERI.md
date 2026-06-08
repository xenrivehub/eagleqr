# Eagle Menu — Geliştirme Önerileri & Profesyonel Değerlendirme

> Projeye "ürünü yayına/ölçeğe hazırlayan bir ekip gözüyle" bakıldığında öncelik sırasına göre yapılabilecekler. Efor etiketleri: `S` (küçük) · `M` (orta) · `L` (büyük). 🔴 kritik · 🟡 önemli · 🟢 iyileştirme.

---

## 1. 🔴 Kritik / Teknik Borç — yayına çıkmadan önce

| # | Konu | Neden kritik | Efor |
|---|---|---|---|
| 1.1 | **Medyayı custom domaine taşı** (`cdn.eaglemenu.com`) | Şu an görseller/3D `*.r2.dev` üzerinden geliyor. Cloudflare bunu throttle ediyor + birçok cihaz/ağ engelliyor → "bazı cihazlarda resim/AR gelmiyor" sorunu doğrudan bu. **Production için kritik.** | `S` (Cloudflare'de bağlama) + `S` (mevcut URL'leri toplu güncelleme scripti) |
| 1.2 | **iOS'ta AR çalışmıyor** | iPhone AR = Quick Look ve **USDZ** ister; biz sadece GLB veriyoruz. iPhone'da "Masamda Görüntüle" sessizce başarısız. GLB→USDZ dönüşümü (yüklemede sunucu tarafı) ya da her ürüne USDZ alanı gerekir. | `M` |
| 1.3 | **Görsel optimizasyonu** | Menü kartlarında ham `<img>` kullanılıyor (next/image değil). Mobilde yavaş yükleme + CLS (layout kayması). `next/image` + boyut/aspect-ratio + lazy-load. | `M` |
| 1.4 | **Güvenlik sertleştirme** | Genel güvenlik denetimi yapılmadı. Eksikler: public uçlarda rate limiting, güvenlik header'ları (CSP vb.), giriş denemesi sınırlama, 2FA, şifre sıfırlama. | `M-L` |
| 1.5 | **Hata izleme & loglama** | Üretimde hata görünürlüğü yok. Sentry/log altyapısı + server action hatalarının izlenmesi. | `S` |
| 1.6 | **Test yokluğu** | Otomatik test yok. En azından kritik server action'lar (plan gating, multi-tenant izolasyon, fiyat hesaplama) için birim/entegrasyon testleri. | `M` |
| 1.7 | **Yedekleme & migration disiplini** | Railway DB yedekleme stratejisi netleştirilmeli; migration'lar elle yazılıyor — bir staging DB ile doğrulama akışı. | `S` |

---

## 2. 🔴 İş Modeli / Gelir — "SaaS" olmanın eksiği

| # | Konu | Açıklama | Efor |
|---|---|---|---|
| 2.1 | **Ödeme & abonelik** | Planlar (Standart/Pro/Max) var ama **gerçek ödeme/abonelik yok.** iyzico/Stripe entegrasyonu, plan satın alma, otomatik yenileme, fatura, başarısız ödeme akışı. SaaS'ı SaaS yapan parça. | `L` |
| 2.2 | **Ücretsiz deneme & onboarding** | Kayıt sonrası adım adım kurulum sihirbazı (işletme bilgisi → ilk menü → QR). "İlk değer"e hızlı ulaşım dönüşümü artırır. **Fotoğraftan menü oluşturma** burada harika bir onboarding adımı olur. | `M` |
| 2.3 | **Plan limiti aşımı deneyimi** | Kota dolunca net "yükselt" çağrısı + plan karşılaştırma modalı. | `S` |

---

## 3. 🟡 Müşteri Deneyimi (Frontend / Menü tarafı)

| # | Konu | Açıklama | Efor |
|---|---|---|---|
| 3.1 | **PWA / offline** | Menü "ana ekrana ekle" + zayıf bağlantıda önbellekten açılma. Restoran Wi-Fi'ı kötü olduğunda büyük fark. | `M` |
| 3.2 | **İskelet (skeleton) yüklemeler** | Menü/görsel yüklenirken shimmer; algılanan hızı artırır. | `S` |
| 3.3 | **Favori ürünler** | Cihazda (localStorage) favori işaretleme. | `S` |
| 3.4 | **Sesli menü (TTS)** | Erişilebilirlik + fark yaratan özellik; ürün açıklamasını sesli okuma. | `S-M` |
| 3.5 | **Erişilebilirlik denetimi** | Kontrast, odak halkaları, ekran okuyucu, `prefers-reduced-motion`. Şu an kısmen var; tam denetim gerek. | `M` |
| 3.6 | **Mikro animasyon & geçişler** | Kart giriş animasyonları, yumuşak sekme geçişleri (ölçülü). | `S` |

---

## 4. 🟡 Menü / İşletme Özellikleri

| # | Konu | Açıklama | Efor |
|---|---|---|---|
| 4.1 | **Taslak / Yayınlama** | Menüde değişiklikleri "taslak"ta biriktirip tek seferde yayınlama. | `L` |
| 4.2 | **Audit log + Geri al (Undo)** | `AuditLog` modeli mevcut ama arayüzü yok. Silinen ürün/kategoriyi geri alma. | `M` |
| 4.3 | **Şubeye özel ayarların tamamlanması** | Tema artık şubeye özel ama **`/dashboard/tema`** sayfası hâlâ marka teması ayarlıyor; **vitrin/hero** ve **QR ortadaki logo** marka düzeyinde. Zincirde bunları da şubeye taşımak. | `M` |
| 4.4 | **Menü/kategori kopyalama** | Şubeler arası kopyalama kısmen var (şube oluştururken); ürün/kategori bazlı kopyalama-yapıştır. | `M` |
| 4.5 | **Çoklu menü (kahvaltı/akşam)** | Aynı şubede zaman bazlı farklı menüler. | `M` |

---

## 5. 🟢 Yapay Zeka (güçlü diferansiyatör)

| # | Konu | Açıklama | Efor |
|---|---|---|---|
| 5.1 | **AI menü asistanı (müşteri)** | Müşteri "vejetaryen ne var?", "acılı bir şey öner" diye sorar; menü verisine dayalı yanıt. | `M-L` |
| 5.2 | **AI menü optimizasyonu** | Analitiğe göre öneri: "X ürünü çok bakılıyor az satıyor, açıklamasını güçlendir / öne çıkar". | `M` |
| 5.3 | **Fotoğraftan menü — geliştirmeler** | Çok sayfalı PDF desteği, okunan dili otomatik çevirme, alerjen/kategori tahmini iyileştirme. | `S-M` |
| 5.4 | **AI görsel üretimi** | Ürünün yapay zeka ile "stüdyo kalitesi" görsel/iyileştirme (FineDine'ın yaptığı). | `L` |

---

## 6. 🟢 Analitik

| # | Konu | Açıklama | Efor |
|---|---|---|---|
| 6.1 | **Şube karşılaştırma** | Zincirde şubeleri yan yana kıyaslama. | `S-M` |
| 6.2 | **Dönüşüm hunisi & trendler** | Tarama → görüntüleme → favori akışı; dönemsel trend. | `M` |
| 6.3 | **Dışa aktarma** | Analitik/menü CSV-PDF export (kısmen var). | `S` |

---

## 7. 🟢 Landing / Pazarlama Frontend Cilası

Mevcut landing artık admin'den düzenlenebilir ve şık; bir üst seviyeye taşımak için:

| # | Konu | Açıklama | Efor |
|---|---|---|---|
| 7.1 | **Alternating özellik + gerçek mockup'lar** | Her özelliği metin + yanında gerçek ürün/menü/telefon görseliyle anlatan bloklar (FineDine etkisi). Gerçek ürün görselleri çıkınca. | `M` |
| 7.2 | **Hero'da canlı telefon önizleme** | Hero'da dönen/parlayan bir telefonda gerçek menü + AR/video rozeti. | `M` |
| 7.3 | **Sosyal kanıt** | Müşteri logoları, sayısal başarılar, kısa video/teftişimonial. | `S` |
| 7.4 | **Üst duyuru bandı** | Admin'den yönetilen kampanya bandı ("Lansmana özel…"). | `S` |
| 7.5 | **Marka kimliği** | Logo hâlâ kartal görseli + "Eagle Menu" yazısı. Profesyonel bir logo/marka kiti + favicon güncellemesi. | `S` |
| 7.6 | **Blog / SEO içerik** | Sayfa oluşturucu hazır; "QR menü nedir", "restoran dijitalleşme" gibi SEO içerikleri. | `M` |

---

## 8. Önerilen Yol Haritası (sıra)

1. **Hemen (yayın blokerleri):** 1.1 CDN domaini · 1.3 görsel optimizasyonu · 1.5 hata izleme · 1.4 güvenlik (rate limit + header + şifre sıfırlama).
2. **Gelir için:** 2.1 ödeme/abonelik · 2.2 onboarding (fotoğraftan menü ile).
3. **iOS deneyimi:** 1.2 USDZ/AR.
4. **Diferansiyatör:** 5.1 AI menü asistanı · 5.2 AI optimizasyon · 7.2 hero canlı önizleme.
5. **Olgunlaşma:** 4.1 taslak/yayın · 4.2 audit+undo · 3.1 PWA · 6.x analitik.

---

## 9. Kısa Notlar (kod kalitesi)

- **Marka tutarlılığı:** "Eagle QR" → "Eagle Menu" geçişi yapıldı; logo görseli (kartal) ve favicon hâlâ güncellenmeyi bekliyor.
- **Dosya boyutu:** Bazı bileşenler (ThemedMenu, MenuManager, ProductForm) 500 satıra yakın; ileride alt bileşenlere bölmek bakım kolaylığı sağlar.
- **i18n varsayılanları:** Bazı arayüz metni varsayılanları admin'de DB'de override edilmişse, marka geçişinde manuel güncellenmeli.
- **Tek dilli admin:** Admin paneli yalnız Türkçe; ileride çoklu dil gerekebilir.
