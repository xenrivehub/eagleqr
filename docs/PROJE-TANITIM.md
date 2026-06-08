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
