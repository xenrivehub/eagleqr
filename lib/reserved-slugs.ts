// /[slug] altında oluşturulamayacak rezerve yollar (mevcut/gelecek rotalarla çakışmasın)
export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "dashboard",
  "login",
  "register",
  "m",
  "menu-pdf",
  "ozellikler",
  "sayfa",
  "_next",
  "favicon.ico",
]);
// Not: gizlilik / kullanim-kosullari / kvkk artık sayfa-builder'da düzenlenen
// gerçek Page kayıtlarıdır (bkz. lib/legal-defaults.ts), bu yüzden rezerve değil.

/** Slug'ı normalize eder: küçük harf, boşluk→tire, geçersiz karakterleri at. */
export function normalizeSlug(input: string): string {
  return input
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}
