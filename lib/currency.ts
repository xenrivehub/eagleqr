// ============================================================================
// Para birimi biçimlendirme. Tanımlar artık DB'de (Currency tablosu) tutulur
// ve admin panelinden yönetilir. Bu dosya yalnızca tip + saf biçimlendirici.
// ============================================================================

export type CurrencyPosition = "before" | "after";

export type CurrencySpec = {
  code: string; // ISO 4217 — "TRY"
  symbol: string; // "₺"
  label: string; // Türkçe ad
  position: CurrencyPosition; // sembol fiyatın solunda mı sağında mı
  space: boolean; // sembol ile rakam arası boşluk
  decimals: number; // ondalık basamak
};

export const FALLBACK_CURRENCY: CurrencySpec = {
  code: "TRY",
  symbol: "₺",
  label: "Türk Lirası",
  position: "before",
  space: false,
  decimals: 2,
};

/** Tutarı verilen para birimi tanımına göre formatlar. Örn. 85 → "₺85,00" / "85,00 €" */
export function formatPrice(
  amount: number | string,
  spec: CurrencySpec | null | undefined,
): string {
  const cur = spec ?? FALLBACK_CURRENCY;
  const n = typeof amount === "string" ? Number(amount) : amount;
  const safe = Number.isFinite(n) ? n : 0;
  const num = safe.toLocaleString("tr-TR", {
    minimumFractionDigits: cur.decimals,
    maximumFractionDigits: cur.decimals,
  });
  const sep = cur.space ? " " : "";
  return cur.position === "before"
    ? `${cur.symbol}${sep}${num}`
    : `${num}${sep}${cur.symbol}`;
}
