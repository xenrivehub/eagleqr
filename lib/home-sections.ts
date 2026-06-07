// ============================================================================
// Anasayfa (landing) bölümleri — admin'den düzenlenebilir, sıralı section listesi.
// AppSetting "home_sections" (JSON) içinde saklanır. Boşsa aşağıdaki varsayılan
// (mevcut landing içeriği) kullanılır. Fiyatlar ayrı yönetilir (lib/pricing-config).
// ============================================================================

export type HomeSectionType = "hero" | "stats" | "steps" | "features" | "pricing" | "faq" | "cta";

export type HomeItem = {
  // steps: no/title/desc · features: icon/title/desc · stats: prefix/value/suffix/label · faq: q/a
  no?: string; title?: string; desc?: string; icon?: string;
  prefix?: string; value?: string; suffix?: string; label?: string;
  q?: string; a?: string;
};

export type HomeSection = {
  id: string;
  type: HomeSectionType;
  enabled: boolean;
  overline?: string;
  heading?: string;
  subtitle?: string;
  // hero
  badge?: string;
  titleLead?: string;
  titleAccent?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  bullets?: string[];
  chip1?: string;
  chip2?: string;
  // cta
  ctaLead?: string;
  ctaAccent?: string;
  ctaTail?: string;
  items?: HomeItem[];
};

export const HOME_SECTION_META: Record<HomeSectionType, { label: string; desc: string }> = {
  hero: { label: "Hero (üst alan)", desc: "Büyük başlık, alt metin, butonlar, logo + rozetler" },
  stats: { label: "İstatistik şeridi", desc: "Animasyonlu 3-4 rakam" },
  steps: { label: "Nasıl Çalışır (adımlar)", desc: "Numaralı 3 adım kartı" },
  features: { label: "Özellikler", desc: "İkonlu özellik kartları" },
  pricing: { label: "Fiyatlar (yer tutucu)", desc: "Fiyatlandırma bölümü — içerik 'Fiyatlandırma' sayfasından düzenlenir" },
  faq: { label: "SSS", desc: "Soru-cevap akordeonu" },
  cta: { label: "CTA bandı", desc: "Koyu zeminli çağrı + butonlar" },
};

export const HOME_SECTION_ORDER: HomeSectionType[] = ["hero", "stats", "steps", "features", "pricing", "faq", "cta"];

/** Mevcut landing içeriğiyle birebir varsayılan bölüm listesi. */
export function defaultHomeSections(): HomeSection[] {
  return [
    {
      id: "hero", type: "hero", enabled: true,
      badge: "AR & videolu menü ile yeni nesil deneyim",
      titleLead: "Menünüz artık", titleAccent: "canlanıyor.",
      subtitle: "Eagle Menu ile müşterileriniz ürünlerinizi videoyla izler, 3D ve AR ile masalarında görür. Çok dilli, alerjen filtreli, işletmenize özel tasarlanan dijital menü — 15 dakikada yayında.",
      primaryLabel: "Ücretsiz Dene", primaryHref: "/register",
      secondaryLabel: "Nasıl Çalışır?", secondaryHref: "#nasil-calisir",
      bullets: ["Kurulum 15 dakika", "Kredi kartı gerekmez", "KVKK uyumlu"],
      chip1: "AR'da Gör", chip2: "Ürün Videosu",
    },
    {
      id: "stats", type: "stats", enabled: true,
      items: [
        { prefix: "< ", value: "1.5", suffix: " sn", label: "Menü açılış süresi" },
        { value: "10", suffix: " dil", label: "Çok dilli menü" },
        { prefix: "< ", value: "15", suffix: " dk", label: "Kurulum süresi" },
        { prefix: "%", value: "78", label: "QR'ı tercih eden müşteri" },
      ],
    },
    {
      id: "steps", type: "steps", enabled: true,
      overline: "Nasıl Çalışır", heading: "Üç adımda dijital menünüz hazır",
      subtitle: "Karmaşık kurulum yok, teknik bilgi gerekmez. Bugün başlayın — bugün yayınlayın.",
      items: [
        { no: "01", title: "Hesabını oluştur", desc: "Dakikalar içinde işletme hesabını aç, kredi kartı gerekmeden ücretsiz başla." },
        { no: "02", title: "Menünü tasarla", desc: "Ürünlerini ekle; fotoğraf, video ve 3D/AR model yükle. Temanı işletmene özel düzenle." },
        { no: "03", title: "QR'ı paylaş", desc: "Masa bazlı QR kodlarını oluştur, yazdır ve müşterilerin menüne anında ulaşsın." },
      ],
    },
    {
      id: "features", type: "features", enabled: true,
      overline: "Özellikler", heading: "İşletmenizi büyütecek her şey, tek platformda",
      items: [
        { icon: "LayoutGrid", title: "Dinamik Menü Editörü", desc: "Sürükle-bırak ile kategori ve ürünleri düzenle, sold-out yönet, Excel/CSV ile içe aktar." },
        { icon: "Sparkles", title: "AR / 3D Ürünler", desc: "GLB/USDZ model yükle; müşteri ürünü 360° döndürsün, mobilde 'AR'da gör' ile masasına yerleştirsin." },
        { icon: "Camera", title: "Videolu Ürünler", desc: "Her ürüne kısa hazırlanış veya tanıtım videosu ekle, iştahı menüde aç." },
        { icon: "Leaf", title: "Profil & Alerjen Filtresi", desc: "14 AB alerjen kategorisine göre otomatik filtre, kişisel tercihlerle akıllı sıralama." },
        { icon: "BarChart3", title: "Analitik & Raporlar", desc: "Tarama sayısı, ürün görüntüleme, heatmap ve menü mühendisliği; PDF/Excel export." },
        { icon: "Globe", title: "Çok Dil & KVKK", desc: "10 dile kadar menü, KVKK/GDPR uyumlu veri yaklaşımı ve 2FA korumalı panel." },
      ],
    },
    { id: "pricing", type: "pricing", enabled: true },
    {
      id: "faq", type: "faq", enabled: true,
      overline: "SSS", heading: "Sıkça Sorulan Sorular",
      items: [
        { q: "Mevcut menümü nasıl aktarırım?", a: "Ürünlerinizi tek tek ekleyebilir veya Excel/CSV dosyanızı içe aktararak menünüzü dakikalar içinde oluşturabilirsiniz. Sürükle-bırak editörle kategori ve sıralamayı kolayca düzenlersiniz." },
        { q: "AR ve videolu ürün nasıl çalışıyor?", a: "Ürüne bir tanıtım videosu veya 3D model (GLB/USDZ) yüklersiniz. Müşteri menüde ürünü 360° döndürebilir, mobil cihazda 'AR'da gör' ile ürünü kendi masasına yerleştirebilir — ek uygulama gerekmez." },
        { q: "Kurulum ne kadar sürer?", a: "Hesabınızı oluşturup menünüzü ekledikten sonra QR kodunuz anında hazır olur. Tipik kurulum 15 dakikadan kısa sürer." },
        { q: "Müşterilerim uygulama indirmek zorunda mı?", a: "Hayır. Menü doğrudan tarayıcıda açılır (PWA). Müşteriler QR'ı okutur, menü anında yüklenir; isterlerse ana ekranlarına ekleyebilir." },
        { q: "Çok dilli menü ve alerjen filtresi var mı?", a: "Evet. 10 dile kadar menü sunabilir, 14 AB alerjen kategorisine göre otomatik filtreleme sağlayabilirsiniz. KVKK/GDPR uyumlu veri yaklaşımı kullanılır." },
      ],
    },
    {
      id: "cta", type: "cta", enabled: true,
      ctaLead: "Menünüzü", ctaAccent: "canlandırmaya", ctaTail: "bugün başlayın.",
      subtitle: "Kredi kartı gerekmez — 15 dakikada kurun, ilk QR kodunuzu hemen paylaşın.",
      primaryLabel: "Ücretsiz Başla", primaryHref: "/register",
      secondaryLabel: "İşletme Girişi", secondaryHref: "/login",
    },
  ];
}
