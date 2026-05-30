// ============================================================================
// Tema kayıt defteri (registry)
// Yeni tema eklemek için: aşağıdaki THEMES dizisine bir ThemeSpec objesi ekle.
// Renk/font + yapısal "tedavi" bayraklarını (imageShape, heroStyle, itemStyle…)
// doldur — sistem otomatik tanır, seçicide görünür ve müşteri menüsünde uygulanır.
// ============================================================================

export type ImageShape = "rect" | "arch"; // arch = üstü kemerli (Retro)
export type HeroStyle = "below" | "overlay" | "card" | "framed";
export type ItemStyle = "card" | "list-thumb" | "list-number" | "list-plain";
export type TabStyle = "underline" | "pill" | "segmented";
export type PriceStyle = "plain" | "pill" | "boxed";

export type ThemeSpec = {
  key: string;
  name: string;
  description: string;
  mode: "light" | "dark";
  fonts: {
    import: string; // Google Fonts <link href>
    display: string;
    body: string;
  };
  colors: {
    bg: string;
    surface: string;
    surface2: string;
    ink: string;
    sub: string;
    faint: string;
    accent: string;
    onAccent: string;
    line: string;
  };
  // Yapısal tedaviler (mockup'lardaki imzaları taşır)
  radius: number; // kart/eleman köşe yarıçapı
  imageShape: ImageShape;
  imageRadius: number; // görsel köşe yarıçapı (rect için)
  heroStyle: HeroStyle;
  itemStyle: ItemStyle;
  tabStyle: TabStyle;
  priceStyle: PriceStyle;
  cardBorder: string;
  cardShadow: string;
  headingSerif: boolean;
  chipFilled: boolean;
  chefCard: boolean; // şefin seçimi kartlı mı (yoksa çıplak görsel+metin)
  uppercase: boolean; // başlık/ürün adları büyük harf mi (Brutalist)
};

const gf = (families: string) =>
  `https://fonts.googleapis.com/css2?${families}&display=swap`;

export const THEMES: ThemeSpec[] = [
  {
    key: "klasik",
    name: "Klasik",
    description: "Koyu espresso, bakır vurgu — varsayılan",
    mode: "dark",
    fonts: {
      import: gf("family=Playfair+Display:wght@600;700;800&family=Karla:wght@400;500;600;700"),
      display: "'Playfair Display', Georgia, serif",
      body: "'Karla', system-ui, sans-serif",
    },
    colors: {
      bg: "#140d08", surface: "#221710", surface2: "#2c2017", ink: "#f2e8d9",
      sub: "#ab9883", faint: "#7c6a52", accent: "#cda86d", onAccent: "#140d08",
      line: "rgba(242,232,217,0.12)",
    },
    radius: 16, imageShape: "rect", imageRadius: 14, heroStyle: "below",
    itemStyle: "card", tabStyle: "underline", priceStyle: "plain",
    cardBorder: "1px solid rgba(242,232,217,0.12)", cardShadow: "none",
    headingSerif: true, chipFilled: false, chefCard: true, uppercase: false,
  },
  {
    key: "mineral",
    name: "Mineral",
    description: "Minimalist açık, tek kil vurgusu, ince ayraçlar",
    mode: "light",
    fonts: {
      import: gf("family=Schibsted+Grotesk:wght@400;500;600;700"),
      display: "'Schibsted Grotesk', system-ui, sans-serif",
      body: "'Schibsted Grotesk', system-ui, sans-serif",
    },
    colors: {
      bg: "#F6F4EF", surface: "#FFFFFF", surface2: "#EDEAE2", ink: "#1C1B17",
      sub: "#8C887E", faint: "#B6B2A8", accent: "#B65C3B", onAccent: "#FFFFFF",
      line: "rgba(28,27,23,0.10)",
    },
    radius: 6, imageShape: "rect", imageRadius: 6, heroStyle: "below",
    itemStyle: "list-thumb", tabStyle: "underline", priceStyle: "plain",
    cardBorder: "1px solid rgba(28,27,23,0.10)", cardShadow: "none",
    headingSerif: false, chipFilled: false, chefCard: false, uppercase: false,
  },
  {
    key: "maison",
    name: "Maison",
    description: "Lüks editöryel — krem/yeşil, à la carte liste",
    mode: "light",
    fonts: {
      import: gf("family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600"),
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Jost', system-ui, sans-serif",
    },
    colors: {
      bg: "#F1EADC", surface: "#F7F2E8", surface2: "#EDE4D2", ink: "#232a20",
      sub: "#6f6a5c", faint: "#A99F88", accent: "#2C4733", onAccent: "#F7F2E8",
      line: "rgba(44,71,51,0.22)",
    },
    radius: 2, imageShape: "rect", imageRadius: 2, heroStyle: "overlay",
    itemStyle: "list-plain", tabStyle: "underline", priceStyle: "plain",
    cardBorder: "1px solid rgba(44,71,51,0.22)", cardShadow: "none",
    headingSerif: true, chipFilled: false, chefCard: false, uppercase: false,
  },
  {
    key: "pop",
    name: "Citrus Pop",
    description: "Canlı, kalın kenarlık, offset gölge",
    mode: "light",
    fonts: {
      import: gf("family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:wght@400;500;700"),
      display: "'Bricolage Grotesque', system-ui, sans-serif",
      body: "'DM Sans', system-ui, sans-serif",
    },
    colors: {
      bg: "#FFF6E9", surface: "#FFFFFF", surface2: "#FFF0DC", ink: "#1B1626",
      sub: "#5C5468", faint: "#8a8294", accent: "#FF5A1F", onAccent: "#FFFFFF",
      line: "#1B1626",
    },
    radius: 20, imageShape: "rect", imageRadius: 14, heroStyle: "card",
    itemStyle: "card", tabStyle: "pill", priceStyle: "boxed",
    cardBorder: "2px solid #1B1626", cardShadow: "5px 5px 0 #1B1626",
    headingSerif: false, chipFilled: true, chefCard: true, uppercase: false,
  },
  {
    key: "terra",
    name: "Terra",
    description: "Organik toprak tonları, yumuşak kartlar",
    mode: "light",
    fonts: {
      import: gf("family=Spectral:wght@500;600;700&family=Karla:wght@400;500;600;700"),
      display: "'Spectral', Georgia, serif",
      body: "'Karla', system-ui, sans-serif",
    },
    colors: {
      bg: "#EBE2D2", surface: "#F6F0E3", surface2: "#EFE6D5", ink: "#3A2E25",
      sub: "#7d7264", faint: "#A99D8A", accent: "#B0623A", onAccent: "#F6F0E3",
      line: "rgba(58,46,37,0.13)",
    },
    radius: 18, imageShape: "rect", imageRadius: 14, heroStyle: "below",
    itemStyle: "card", tabStyle: "underline", priceStyle: "plain",
    cardBorder: "1px solid rgba(58,46,37,0.13)", cardShadow: "0 4px 18px rgba(58,46,37,0.07)",
    headingSerif: true, chipFilled: false, chefCard: true, uppercase: false,
  },
  {
    key: "brutalist",
    name: "Neue Brutalist",
    description: "Cesur, keskin, numaralı liste, mono",
    mode: "light",
    fonts: {
      import: gf("family=Archivo:wght@600;700;800;900&family=Space+Mono:wght@400;700"),
      display: "'Archivo', system-ui, sans-serif",
      body: "'Space Mono', monospace",
    },
    colors: {
      bg: "#E9E6DC", surface: "#F4F2EA", surface2: "#E2DFD3", ink: "#121212",
      sub: "#55524a", faint: "#85827a", accent: "#2B27EE", onAccent: "#FFFFFF",
      line: "#121212",
    },
    radius: 0, imageShape: "rect", imageRadius: 0, heroStyle: "framed",
    itemStyle: "list-number", tabStyle: "segmented", priceStyle: "boxed",
    cardBorder: "2px solid #121212", cardShadow: "4px 4px 0 #121212",
    headingSerif: false, chipFilled: true, chefCard: true, uppercase: true,
  },
  {
    key: "noir",
    name: "Noir",
    description: "Modern koyu, mint vurgu",
    mode: "dark",
    fonts: {
      import: gf("family=Space+Grotesk:wght@400;500;600;700"),
      display: "'Space Grotesk', system-ui, sans-serif",
      body: "'Space Grotesk', system-ui, sans-serif",
    },
    colors: {
      bg: "#14161B", surface: "#1D212A", surface2: "#232833", ink: "#ECEEF2",
      sub: "#969DAA", faint: "#5C636F", accent: "#54E0AE", onAccent: "#14161B",
      line: "rgba(255,255,255,0.09)",
    },
    radius: 14, imageShape: "rect", imageRadius: 10, heroStyle: "overlay",
    itemStyle: "card", tabStyle: "underline", priceStyle: "plain",
    cardBorder: "1px solid rgba(255,255,255,0.09)", cardShadow: "none",
    headingSerif: false, chipFilled: false, chefCard: true, uppercase: false,
  },
  {
    key: "pastel",
    name: "Soft Pastel",
    description: "Şeker pasteller, çok yuvarlak, yumuşak gölge",
    mode: "light",
    fonts: {
      import: gf("family=Quicksand:wght@500;600;700&family=Nunito:wght@400;600;700"),
      display: "'Quicksand', system-ui, sans-serif",
      body: "'Nunito', system-ui, sans-serif",
    },
    colors: {
      bg: "#FAF5FB", surface: "#FFFFFF", surface2: "#F3ECF8", ink: "#4B4360",
      sub: "#9089A0", faint: "#b3adc0", accent: "#B7A6EE", onAccent: "#3a3350",
      line: "rgba(75,67,96,0.10)",
    },
    radius: 22, imageShape: "rect", imageRadius: 16, heroStyle: "below",
    itemStyle: "card", tabStyle: "pill", priceStyle: "pill",
    cardBorder: "none", cardShadow: "0 8px 22px rgba(75,67,96,0.10)",
    headingSerif: false, chipFilled: true, chefCard: true, uppercase: false,
  },
  {
    key: "retro",
    name: "Retro Sun",
    description: "70'ler, kemer görseller, hasat tonları",
    mode: "light",
    fonts: {
      import: gf("family=Yeseva+One&family=Work+Sans:wght@400;500;600;700"),
      display: "'Yeseva One', Georgia, serif",
      body: "'Work Sans', system-ui, sans-serif",
    },
    colors: {
      bg: "#F2E3C3", surface: "#FBF2DB", surface2: "#F2E6C8", ink: "#3A2A16",
      sub: "#7C6A4E", faint: "#A8966E", accent: "#BC4A1C", onAccent: "#F2E3C3",
      line: "rgba(217,154,43,0.45)",
    },
    radius: 18, imageShape: "arch", imageRadius: 14, heroStyle: "overlay",
    itemStyle: "card", tabStyle: "underline", priceStyle: "plain",
    cardBorder: "1.5px solid rgba(217,154,43,0.5)", cardShadow: "none",
    headingSerif: true, chipFilled: true, chefCard: true, uppercase: false,
  },
  {
    key: "botanical",
    name: "Botanical",
    description: "Ferah adaçayı/spa, ince ayraçlı liste",
    mode: "light",
    fonts: {
      import: gf("family=Newsreader:wght@400;500;600&family=Mulish:wght@400;500;600;700"),
      display: "'Newsreader', Georgia, serif",
      body: "'Mulish', system-ui, sans-serif",
    },
    colors: {
      bg: "#EDF1E7", surface: "#F8FAF4", surface2: "#E7EEDF", ink: "#2B342A",
      sub: "#6C7567", faint: "#A2AC97", accent: "#3D5639", onAccent: "#F8FAF4",
      line: "rgba(61,86,57,0.16)",
    },
    radius: 12, imageShape: "rect", imageRadius: 10, heroStyle: "overlay",
    itemStyle: "list-thumb", tabStyle: "underline", priceStyle: "plain",
    cardBorder: "1px solid rgba(61,86,57,0.16)", cardShadow: "none",
    headingSerif: true, chipFilled: false, chefCard: true, uppercase: false,
  },
  {
    key: "editorial",
    name: "Editorial",
    description: "Dergi/İsviçre, numaralı liste, tek kırmızı",
    mode: "light",
    fonts: {
      import: gf("family=Instrument+Serif:ital@0;1&family=Libre+Franklin:wght@400;500;600;700"),
      display: "'Instrument Serif', Georgia, serif",
      body: "'Libre Franklin', system-ui, sans-serif",
    },
    colors: {
      bg: "#F4F2EB", surface: "#FBFAF5", surface2: "#ECEAE0", ink: "#16130F",
      sub: "#6A655D", faint: "#9A9489", accent: "#DE2418", onAccent: "#FBFAF5",
      line: "rgba(22,19,15,0.16)",
    },
    radius: 2, imageShape: "rect", imageRadius: 0, heroStyle: "below",
    itemStyle: "list-number", tabStyle: "underline", priceStyle: "plain",
    cardBorder: "1px solid rgba(22,19,15,0.16)", cardShadow: "none",
    headingSerif: true, chipFilled: false, chefCard: false, uppercase: false,
  },
];

export const DEFAULT_THEME_KEY = "mineral";

// Ücretsiz (herkese açık) temalar. Diğer tüm temalar kilitlidir ve yalnızca
// admin panelinden işletmeye özel açıldığında (Business.allowedThemes) kullanılabilir.
export const FREE_THEME_KEYS = ["mineral", "maison"] as const;

export function isThemeFree(key: string): boolean {
  return (FREE_THEME_KEYS as readonly string[]).includes(key);
}

// Bir tema işletme için kullanılabilir mi? (ücretsiz VEYA admin tarafından açılmış)
export function isThemeUnlocked(key: string, allowedThemes: string[] = []): boolean {
  return isThemeFree(key) || allowedThemes.includes(key);
}

export function getTheme(key: string | null | undefined): ThemeSpec {
  return THEMES.find((t) => t.key === key) ?? THEMES[0];
}
