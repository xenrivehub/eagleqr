import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const DAYS = 14;

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

type Params = { searchParams: Promise<{ branch?: string }> };

export default async function AnalyticsPage({ searchParams }: Params) {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { type: true },
  });
  const isChain = business?.type === "CHAIN";

  const branches = isChain
    ? await prisma.menu.findMany({
        where: { businessId },
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true },
      })
    : [];

  const { branch: branchParam } = await searchParams;
  const activeBranch =
    isChain && branchParam && branches.some((b) => b.id === branchParam)
      ? branchParam
      : null;

  // Seçili şubeye (veya tüm işletmeye) göre filtre
  const scope: Prisma.ScanEventWhereInput = activeBranch
    ? { businessId, menuId: activeBranch }
    : { businessId };

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400_000);
  const since = new Date(now.getTime() - DAYS * 86400_000);

  const [totalScans, weekScans, totalViews, recentScans, topRaw] =
    await Promise.all([
      prisma.scanEvent.count({ where: { ...scope, type: "SCAN" } }),
      prisma.scanEvent.count({ where: { ...scope, type: "SCAN", ts: { gte: weekAgo } } }),
      prisma.scanEvent.count({ where: { ...scope, type: "VIEW" } }),
      prisma.scanEvent.findMany({
        where: { ...scope, type: "SCAN", ts: { gte: since } },
        select: { ts: true },
      }),
      prisma.scanEvent.groupBy({
        by: ["productId"],
        where: { ...scope, type: "VIEW", productId: { not: null } },
        _count: { productId: true },
        orderBy: { _count: { productId: "desc" } },
        take: 5,
      }),
    ]);

  // Şube bazında özet (zincir)
  const perBranch = isChain
    ? await Promise.all(
        branches.map(async (b) => {
          const [s, v] = await Promise.all([
            prisma.scanEvent.count({ where: { businessId, menuId: b.id, type: "SCAN" } }),
            prisma.scanEvent.count({ where: { businessId, menuId: b.id, type: "VIEW" } }),
          ]);
          return { ...b, scans: s, views: v };
        }),
      )
    : [];

  const buckets = new Map<string, number>();
  for (let i = DAYS - 1; i >= 0; i--) {
    buckets.set(dayKey(new Date(now.getTime() - i * 86400_000)), 0);
  }
  for (const ev of recentScans) {
    const k = dayKey(ev.ts);
    if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + 1);
  }
  const series = [...buckets.entries()];
  const maxVal = Math.max(1, ...series.map(([, v]) => v));

  const productIds = topRaw.map((t) => t.productId).filter(Boolean) as string[];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  });
  const nameById = new Map(products.map((p) => [p.id, p.name]));
  const topViewed = topRaw.map((t) => ({
    name: nameById.get(t.productId as string) ?? "—",
    count: t._count.productId,
  }));

  const stats = [
    { label: "Toplam tarama", value: totalScans },
    { label: "Son 7 gün tarama", value: weekScans },
    { label: "Ürün görüntüleme", value: totalViews },
  ];

  const hasData = totalScans > 0 || totalViews > 0;
  const tab = (id: string | null, label: string) => {
    const active = activeBranch === id || (id === null && !activeBranch);
    const href = id ? `/dashboard/analytics?branch=${id}` : "/dashboard/analytics";
    return (
      <Link
        key={id ?? "all"}
        href={href}
        className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
          active ? "bg-ink text-cream" : "border border-ink/15 text-ink/60 hover:bg-ink/5"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Analitik</h1>
      <p className="mt-2 text-ink/60">
        {isChain
          ? "Tüm işletme veya şube bazında tarama ve görüntülenme istatistikleri."
          : "Menünüzün tarama ve görüntülenme istatistikleri."}
      </p>

      {isChain && branches.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tab(null, "Tümü")}
          {branches.map((b) => tab(b.id, b.name))}
        </div>
      )}

      {!hasData ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/20 bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-ink">Henüz veri yok</p>
          <p className="mt-1 text-sm text-ink/60">
            QR kodunuz tarandıkça veriler burada görünecek.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink/10 bg-white p-5">
                <div className="font-display text-3xl font-bold tabular-nums text-ink">{s.value}</div>
                <div className="mt-1 text-sm text-ink/60">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink">
              Günlük tarama (son {DAYS} gün)
            </h2>
            <div className="mt-5 flex items-end gap-1.5" style={{ height: 160 }}>
              {series.map(([day, val]) => (
                <div key={day} className="flex flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-[10px] tabular-nums text-ink/50">{val}</span>
                  <div
                    className="w-full rounded-t bg-brand"
                    style={{ height: `${(val / maxVal) * 120}px`, minHeight: val > 0 ? 4 : 2, opacity: val > 0 ? 1 : 0.25 }}
                    title={`${day}: ${val} tarama`}
                  />
                  <span className="text-[9px] tabular-nums text-ink/40">
                    {day.slice(8, 10)}.{day.slice(5, 7)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isChain && perBranch.length > 0 && (
            <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-5">
              <h2 className="font-display text-lg font-semibold text-ink">Şube bazında</h2>
              <ul className="mt-4 space-y-2.5">
                {perBranch.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 text-sm">
                    <Link href={`/dashboard/analytics?branch=${b.id}`} className="font-medium text-ink hover:text-brand-dark hover:underline">
                      {b.name}
                    </Link>
                    <span className="tabular-nums text-ink/60">
                      {b.scans} tarama · {b.views} görüntüleme
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-5">
            <h2 className="font-display text-lg font-semibold text-ink">
              En çok görüntülenen ürünler
            </h2>
            {topViewed.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">Henüz ürün görüntülemesi yok.</p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {topViewed.map((p, i) => (
                  <li key={p.name + i} className="flex items-center gap-3">
                    <span className="w-5 shrink-0 text-sm font-bold text-ink/40">{i + 1}</span>
                    <span className="flex-1 truncate text-sm text-ink">{p.name}</span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-brand-dark">
                      {p.count} görüntüleme
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
