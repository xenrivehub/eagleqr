// ============================================================================
// Plan bazlı özellik bayrakları (boolean)
// ----------------------------------------------------------------------------
// video / AR adetle (PlanLimit.videoLimit / arLimit) yönetilir — burada DEĞİL.
// Buradaki bayraklar "açık/kapalı" özelliklerdir (toplu fiyat, AI, kampanya...).
//
// Efektif değer = FEATURE_DEFAULTS[plan] üzerine PlanLimit.features override'ı.
// Admin panelinden plan başına aç/kapat yapılır; kapalıysa server action reddeder.
// ============================================================================

import type { Plan } from "@/lib/plans";

export type FeatureKey =
  | "bulkPrice"
  | "ai"
  | "aiTranslation"
  | "campaigns"
  | "advancedAnalytics"
  | "pdfMenu"
  | "menuScan"
  | "splashScreen";

export const FEATURE_KEYS: FeatureKey[] = [
  "bulkPrice",
  "ai",
  "aiTranslation",
  "campaigns",
  "advancedAnalytics",
  "pdfMenu",
  "menuScan",
  "splashScreen",
];

export const FEATURE_META: Record<
  FeatureKey,
  { label: string; desc: string; group: string }
> = {
  bulkPrice: {
    label: "Toplu fiyat yönetimi",
    desc: "Tüm menüye veya kategoriye yüzde/sabit zam–indirim uygulama.",
    group: "Menü",
  },
  campaigns: {
    label: "Kampanya & servis saatleri",
    desc: "Ürün/kategori kampanya etiketleri ve zamana göre görünürlük.",
    group: "Menü",
  },
  pdfMenu: {
    label: "PDF menü çıktısı",
    desc: "Baskıya hazır A4 PDF menü indirme.",
    group: "Menü",
  },
  ai: {
    label: "AI açıklama & eşleşme önerisi",
    desc: "Yapay zeka ile ürün açıklaması yazma ve 'Yanında iyi gider' önerileri.",
    group: "Yapay Zeka",
  },
  aiTranslation: {
    label: "Tek tıkla AI çevirisi",
    desc: "Menüyü açık olan dillere yapay zeka ile çevirme.",
    group: "Yapay Zeka",
  },
  advancedAnalytics: {
    label: "Gelişmiş analitik",
    desc: "Yoğunluk ısı haritası, ilgi oranı ve ürün/kategori popülerliği.",
    group: "Analitik",
  },
  menuScan: {
    label: "Fotoğraftan menü oluşturma (AI)",
    desc: "Basılı menü fotoğrafını yapay zekaya okutup ürünleri toplu oluşturma.",
    group: "Yapay Zeka",
  },
  splashScreen: {
    label: "QR açılış ekranı",
    desc: "QR okununca menü öncesi tam ekran karşılama (görsel/video) + 'Menüyü Görüntüle'.",
    group: "Menü",
  },
};

// Plan başına varsayılan açık/kapalı (admin override etmezse bu geçerli)
export const FEATURE_DEFAULTS: Record<Plan, Record<FeatureKey, boolean>> = {
  STANDART: {
    bulkPrice: false,
    campaigns: false,
    pdfMenu: false,
    ai: false,
    aiTranslation: false,
    advancedAnalytics: false,
    menuScan: false,
    splashScreen: false,
  },
  PRO: {
    bulkPrice: true,
    campaigns: true,
    pdfMenu: true,
    ai: true,
    aiTranslation: true,
    advancedAnalytics: true,
    menuScan: false,
    splashScreen: true,
  },
  MAX: {
    bulkPrice: true,
    campaigns: true,
    pdfMenu: true,
    ai: true,
    aiTranslation: true,
    advancedAnalytics: true,
    menuScan: true,
    splashScreen: true,
  },
};

export type PlanFeatures = Record<FeatureKey, boolean>;

/**
 * Plan varsayılanları + DB override'ını birleştirip efektif bayrakları döndürür.
 * `overrides` PlanLimit.features JSON'ı (bilinmeyen/eksik anahtarlar yok sayılır).
 */
export function resolveFeatures(
  plan: Plan,
  overrides: Record<string, unknown> | null | undefined,
): PlanFeatures {
  const base = FEATURE_DEFAULTS[plan] ?? FEATURE_DEFAULTS.STANDART;
  const out = { ...base };
  if (overrides) {
    for (const key of FEATURE_KEYS) {
      const v = overrides[key];
      if (typeof v === "boolean") out[key] = v;
    }
  }
  return out;
}
