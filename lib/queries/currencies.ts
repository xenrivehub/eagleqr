import { prisma } from "@/lib/prisma";
import { FALLBACK_CURRENCY, type CurrencySpec, type CurrencyPosition } from "@/lib/currency";

function toSpec(row: {
  code: string;
  symbol: string;
  label: string;
  position: string;
  space: boolean;
  decimals: number;
}): CurrencySpec {
  return {
    code: row.code,
    symbol: row.symbol,
    label: row.label,
    position: (row.position === "after" ? "after" : "before") as CurrencyPosition,
    space: row.space,
    decimals: row.decimals,
  };
}

/** Açık (enabled) para birimleri, sıraya göre. */
export async function getEnabledCurrencies(): Promise<CurrencySpec[]> {
  const rows = await prisma.currency.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toSpec);
}

/** Bir koda ait para birimi tanımı; yoksa TRY fallback. */
export async function getCurrencySpec(code: string | null | undefined): Promise<CurrencySpec> {
  if (!code) return FALLBACK_CURRENCY;
  const row = await prisma.currency.findUnique({ where: { code } });
  return row ? toSpec(row) : FALLBACK_CURRENCY;
}
