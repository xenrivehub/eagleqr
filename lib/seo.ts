// ============================================================================
// Global SEO ayarları — Google'da render edilen tüm sayfa tipleri için ortak
// şablonlar. Admin panelinden (tek sayfa) yönetilir; AppSetting'te saklanır.
// Yer tutucular: {business} (işletme adı), {product} (ürün adı), {branch} (şube).
// ============================================================================

export const SEO_KEYS = {
  homeTitle: "seo_home_title",
  homeDescription: "seo_home_description",
  menuTitle: "seo_menu_title",
  menuDescription: "seo_menu_description",
  productTitle: "seo_product_title",
  productDescription: "seo_product_description",
  branchTitle: "seo_branch_title",
  branchDescription: "seo_branch_description",
  keywords: "seo_keywords",
} as const;

export type SeoSettings = {
  homeTitle: string;
  homeDescription: string;
  menuTitle: string;
  menuDescription: string;
  productTitle: string;
  productDescription: string;
  branchTitle: string;
  branchDescription: string;
  keywords: string;
};

export const SEO_DEFAULTS: SeoSettings = {
  homeTitle: "Eagle Menu — Restoranlar için QR Dijital Menü",
  homeDescription:
    "Video, AR ve çok dilli QR dijital menü platformu. Alerjen filtresi, kampanyalar ve analitik. 15 dakikada kurun, anında yayınlayın.",
  menuTitle: "{business} — Menü | QR Dijital Menü",
  menuDescription:
    "{business} dijital menüsü. QR ile açın; güncel fiyatlar, fotoğraflı ürünler, alerjen bilgisi ve çok dilli menü.",
  productTitle: "{product} — {business}",
  productDescription: "{product} · {business} menüsünde. Fiyat, içerik ve alerjen bilgisi.",
  branchTitle: "{branch} — {business} | Menü",
  branchDescription: "{business} {branch} şubesi dijital menüsü. QR ile açın.",
  keywords: "qr menü, dijital menü, menü, restoran menü",
};

/** Şablondaki {business}/{product}/{branch} yer tutucularını doldurur. */
export function fillSeo(
  template: string,
  vars: { business?: string; product?: string; branch?: string },
): string {
  return template
    .replaceAll("{business}", vars.business ?? "")
    .replaceAll("{product}", vars.product ?? "")
    .replaceAll("{branch}", vars.branch ?? "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
