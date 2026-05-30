import { prisma } from "@/lib/prisma";
import CurrencyManager, { type CurrencyRow } from "@/components/admin/CurrencyManager";

export default async function AdminCurrenciesPage() {
  const currencies = await prisma.currency.findMany({ orderBy: { sortOrder: "asc" } });

  const rows: CurrencyRow[] = currencies.map((c) => ({
    code: c.code,
    symbol: c.symbol,
    label: c.label,
    position: c.position === "after" ? "after" : "before",
    space: c.space,
    decimals: c.decimals,
    enabled: c.enabled,
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Para Birimleri</h1>
      <p className="mt-2 text-ink/60">
        Para birimlerini ekleyin, sembol konumunu (solda/sağda) ve formatını
        ayarlayın. Açık olan para birimlerini işletmeler menülerinde seçebilir.
      </p>
      <div className="mt-8">
        <CurrencyManager currencies={rows} />
      </div>
    </div>
  );
}
