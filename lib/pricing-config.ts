// ============================================================================
// Fiyatlandırma içeriği — admin'den ayrı sayfada düzenlenir (AppSetting "pricing_config").
// Boşsa aşağıdaki varsayılan (mevcut landing fiyatları) kullanılır.
// ============================================================================

export type PricingTier = {
  name: string;
  tagline: string;
  monthly: number;
  yearlyMonthly: number;
  yearlyTotal: number;
  features: string[];
  featured: boolean;
  highlight?: string;
};

export type PricingConfig = {
  heading: string;
  subtitle: string;
  yearlyBadge: string;
  note: string; // alttaki konumlandırma notu
  tiers: PricingTier[];
};

export const PRICING_DEFAULT: PricingConfig = {
  heading: "İşletmenize uygun paketi seçin",
  subtitle: "Tüm paketlerde kurulum ücretsiz. İstediğiniz zaman yükseltin — sözleşme, komisyon, gizli ücret yok.",
  yearlyBadge: "%25 indirim",
  note: "Karmaşık adisyon sistemleri değiliz. Kilitlenen mutfak yazıcıları, yüksek komisyonlar ya da kurulum derdi yok. Eagle QR, müşterinizin iştahını kabartarak masadaki sepet ortalamanızı artırmaya odaklanan bir pazarlama platformudur.",
  tiers: [
    {
      name: "Standart",
      tagline: "Temel ve şık — bütçe odaklı küçük işletmeler ve kafeler için.",
      monthly: 399, yearlyMonthly: 299, yearlyTotal: 3588, featured: false,
      features: [
        "Sınırsız kategori ve ürün",
        "2 ücretsiz tema (Mineral & Maison)",
        "Gelişmiş QR oluşturucu (renk, çerçeve, logo)",
        "Akıllı alerjen filtresi",
        "Anonim yıldız puanlaması",
        "Temel analitik (tarama & görüntüleme)",
        "Tek tıkla 'Tükendi' & anlık fiyat değişimi",
      ],
    },
    {
      name: "Pro",
      tagline: "Büyüyen ve akıllı işletmeler — video ve AI gücüyle satışı katlayın.",
      monthly: 899, yearlyMonthly: 699, yearlyTotal: 8388, featured: true,
      features: [
        "Standart'taki her şey",
        "Video menü desteği (sessiz, otomatik döngü)",
        "AI açıklama yazımı & 'Yanında iyi gider' önerisi",
        "Tek tıkla AI çevirisi (RTL + dil seçici)",
        "+1 premium tema & gelişmiş stiller",
        "Akıllı kampanya & servis saatleri (Happy Hour)",
        "Gelişmiş analitik (ısı haritası, ilgi oranı)",
        "Toplu fiyat yönetimi (zam / indirim)",
      ],
    },
    {
      name: "Max",
      tagline: "Premium ve deneyim odaklı — sosyal medyada fark yaratan mekanlar için.",
      monthly: 2499, yearlyMonthly: 1899, yearlyTotal: 22788, featured: false,
      highlight: "Lansmana özel: İlk 5 Hero ürünün 3D modellemesi + AR çekimi hediye!",
      features: [
        "Pro'daki her şey",
        "'Masamda Görüntüle' — web tabanlı AR",
        "Tüm premium temalara sınırsız erişim (11 tema)",
        "Gelişmiş zincir & şube yönetimi (içerik kopyalama)",
        "Zarif PDF menü çıktısı (baskıya hazır A4)",
        "Maksimum medya kotası (3D / video / HD görsel)",
        "Öncelikli destek & VIP kurulum",
      ],
    },
  ],
};
