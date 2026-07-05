import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ResetProductButton, ResetAllButton } from "@/components/dashboard/RatingResetButtons";

export const metadata = { title: "Puanlar — Eagle Menu" };

export default async function RatingsPage() {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) redirect("/login");

  const groups = await prisma.productRating.groupBy({
    by: ["productId"],
    where: { product: { businessId } },
    _avg: { stars: true },
    _count: { _all: true },
  });

  const products = groups.length
    ? await prisma.product.findMany({
        where: { id: { in: groups.map((g) => g.productId) } },
        select: { id: true, name: true, category: { select: { name: true } } },
      })
    : [];
  const pmap = new Map(products.map((p) => [p.id, p]));
  const rows = groups
    .map((g) => ({ id: g.productId, avg: g._avg.stars ?? 0, count: g._count._all, p: pmap.get(g.productId) }))
    .filter((r): r is typeof r & { p: NonNullable<typeof r.p> } => Boolean(r.p))
    .sort((a, b) => b.count - a.count);

  const totalVotes = rows.reduce((n, r) => n + r.count, 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Ürün puanları</h1>
          <p className="mt-1 text-sm text-ink/60">
            Müşterilerin bıraktığı yıldız puanları. Kötü niyetli/hatalı oyları sıfırlayabilirsin.
          </p>
        </div>
        {rows.length > 0 && <ResetAllButton />}
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/50">
          Henüz puan verilmemiş. Müşteriler ürün sayfasında yıldız bıraktıkça burada görünecek.
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-ink/50">{rows.length} ürün · toplam {totalVotes} oy</p>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-4 py-3 font-semibold">Ürün</th>
                  <th className="px-4 py-3 font-semibold">Ortalama</th>
                  <th className="px-4 py-3 font-semibold">Oy</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-ink/5 last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">{r.p.name}</div>
                      <div className="text-xs text-ink/50">{r.p.category.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                        <span className="text-amber-500" aria-hidden>★</span>
                        {r.avg.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink/70">{r.count}</td>
                    <td className="px-4 py-3 text-right">
                      <ResetProductButton productId={r.id} name={r.p.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
