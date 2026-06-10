import Link from "next/link";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getActiveBranch } from "@/lib/branch-context";
import { getBusinessFeatures } from "@/lib/queries/plan-features";

// Türkiye UTC+3 (DST yok) — UTC zaman damgasını yerel saate çevir
const TR_OFFSET_MS = 3 * 3600_000;
const WEEKDAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function localParts(ts: Date) {
  const d = new Date(ts.getTime() + TR_OFFSET_MS);
  const wd = (d.getUTCDay() + 6) % 7; // 0=Pzt
  return { wd, hour: d.getUTCHours(), dayKey: d.toISOString().slice(0, 10) };
}

type Params = { searchParams: Promise<{ scope?: string; range?: string; view?: string }> };

export default async function AnalyticsPage({ searchParams }: Params) {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { type: true },
  });
  const isChain = business?.type === "CHAIN";
  const advanced = (await getBusinessFeatures(businessId)).advancedAnalytics;

  const { scope: scopeParam, range: rangeParam, view: viewParam } = await searchParams;
  const view = viewParam === "etki" ? "etki" : "genel";
  const showAll = !isChain || scopeParam === "all";
  const RANGE = [7, 30, 90].includes(Number(rangeParam)) ? Number(rangeParam) : 30;

  let activeBranch: { id: string; name: string } | null = null;
  let branches: { id: string; name: string }[] = [];
  if (isChain) {
    const res = await getActiveBranch(businessId);
    branches = res.branches.map((b) => ({ id: b.id, name: b.name }));
    activeBranch = res.active ? { id: res.active.id, name: res.active.name } : null;
  }

  const where: Prisma.ScanEventWhereInput =
    !showAll && activeBranch ? { businessId, menuId: activeBranch.id } : { businessId };

  const now = new Date();
  const since = new Date(now.getTime() - RANGE * 86400_000);

  const [rangeViews, scanTs, viewByProduct] = await Promise.all([
    prisma.scanEvent.count({ where: { ...where, type: "VIEW", ts: { gte: since } } }),
    prisma.scanEvent.findMany({
      where: { ...where, type: "SCAN", ts: { gte: since } },
      select: { ts: true },
    }),
    prisma.scanEvent.groupBy({
      by: ["productId"],
      where: { ...where, type: "VIEW", productId: { not: null }, ts: { gte: since } },
      _count: { productId: true },
    }),
  ]);

  const rangeScans = scanTs.length;
  const interest = rangeScans > 0 ? Math.round((rangeViews / rangeScans) * 100) : 0;

  // Günlük seri
  const buckets = new Map<string, number>();
  for (let i = RANGE - 1; i >= 0; i--) {
    buckets.set(new Date(now.getTime() - i * 86400_000 + TR_OFFSET_MS).toISOString().slice(0, 10), 0);
  }
  // Isı haritası 7×24
  const heat: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const ev of scanTs) {
    const { wd, hour, dayKey } = localParts(ev.ts);
    if (buckets.has(dayKey)) buckets.set(dayKey, (buckets.get(dayKey) ?? 0) + 1);
    heat[wd][hour] += 1;
  }
  const series = [...buckets.entries()];
  const maxDaily = Math.max(1, ...series.map(([, v]) => v));
  const maxHeat = Math.max(1, ...heat.flat());

  // Ürün + kategori popülerlik
  const prodWhere: Prisma.ProductWhereInput =
    !showAll && activeBranch
      ? { businessId, category: { menuId: activeBranch.id } }
      : { businessId };
  const products = await prisma.product.findMany({
    where: prodWhere,
    select: { id: true, name: true, category: { select: { name: true } } },
  });
  const prodInfo = new Map(products.map((p) => [p.id, { name: p.name, category: p.category.name }]));

  const productPop = viewByProduct
    .map((v) => ({
      id: v.productId as string,
      name: prodInfo.get(v.productId as string)?.name ?? "—",
      category: prodInfo.get(v.productId as string)?.category ?? "—",
      count: v._count.productId,
    }))
    .filter((p) => prodInfo.has(p.id))
    .sort((a, b) => b.count - a.count);
  const maxProd = Math.max(1, ...productPop.map((p) => p.count));

  const catMap = new Map<string, number>();
  for (const p of productPop) catMap.set(p.category, (catMap.get(p.category) ?? 0) + p.count);
  const categoryPop = [...catMap.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  const maxCat = Math.max(1, ...categoryPop.map((c) => c.count));

  const hasData = rangeScans > 0 || rangeViews > 0;

  // ---- Etki paneli (#11) + dil analitiği (#6) — yalnız Etki sekmesi & gelişmiş analitik ----
  let etki: {
    langDist: { lang: string; count: number }[];
    totalLang: number;
    videoViews: number;
    arOpens: number;
    pairClicks: number;
    campaignViews: number;
  } | null = null;

  if (view === "etki" && advanced) {
    const [videoRows, campRows] = await Promise.all([
      prisma.product.findMany({ where: { ...prodWhere, videoUrl: { not: null } }, select: { id: true } }),
      prisma.product.findMany({ where: { ...prodWhere, campaignId: { not: null } }, select: { id: true } }),
    ]);
    const videoIds = videoRows.map((p) => p.id);
    const campIds = campRows.map((p) => p.id);
    const [langRows, arOpens, pairClicks, videoViews, campaignViews] = await Promise.all([
      prisma.scanEvent.groupBy({ by: ["lang"], where: { ...where, type: "SCAN", lang: { not: null }, ts: { gte: since } }, _count: { lang: true } }),
      prisma.scanEvent.count({ where: { ...where, type: "AR_OPEN", ts: { gte: since } } }),
      prisma.scanEvent.count({ where: { ...where, type: "PAIR_CLICK", ts: { gte: since } } }),
      videoIds.length ? prisma.scanEvent.count({ where: { ...where, type: "VIEW", productId: { in: videoIds }, ts: { gte: since } } }) : Promise.resolve(0),
      campIds.length ? prisma.scanEvent.count({ where: { ...where, type: "VIEW", productId: { in: campIds }, ts: { gte: since } } }) : Promise.resolve(0),
    ]);
    const langDist = langRows
      .map((r) => ({ lang: (r.lang as string).toUpperCase(), count: r._count.lang }))
      .sort((a, b) => b.count - a.count);
    etki = {
      langDist,
      totalLang: langDist.reduce((s, r) => s + r.count, 0),
      videoViews, arOpens, pairClicks, campaignViews,
    };
  }

  const tab = (active: boolean, href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-ink text-cream" : "border border-ink/15 text-ink/60 hover:bg-ink/5"
      }`}
    >
      {label}
    </Link>
  );
  const rangeHref = (r: number) =>
    `/dashboard/analytics?range=${r}${isChain && showAll ? "&scope=all" : ""}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Analitik</h1>
      <p className="mt-2 text-ink/60">
        {isChain
          ? showAll
            ? "Tüm işletmenin (tüm şubeler) istatistikleri."
            : `${activeBranch?.name ?? "Aktif şube"} şubesinin istatistikleri.`
          : "Menünüzün tarama ve görüntülenme istatistikleri."}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {isChain && activeBranch && (
          <>
            {tab(!showAll, `/dashboard/analytics?range=${RANGE}`, activeBranch.name)}
            {tab(showAll, `/dashboard/analytics?range=${RANGE}&scope=all`, "Tüm işletme")}
            <span className="mx-1 h-5 w-px bg-ink/10" />
          </>
        )}
        {[7, 30, 90].map((r) => tab(RANGE === r, rangeHref(r), `${r} gün`))}
      </div>

      {!hasData ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/20 bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-ink">Henüz veri yok</p>
          <p className="mt-1 text-sm text-ink/60">QR kodunuz tarandıkça veriler burada görünecek.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat label={`Tarama (${RANGE} gün)`} value={rangeScans} />
            <Stat label={`Görüntüleme (${RANGE} gün)`} value={rangeViews} />
            <Stat label="İlgi oranı" value={`%${interest}`} hint="görüntüleme / tarama" />
          </div>

          {/* Günlük tarama */}
          <Card title={`Günlük tarama (${RANGE} gün)`}>
            <div className="flex items-end gap-[3px]" style={{ height: 150 }}>
              {series.map(([day, val]) => (
                <div key={day} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${day}: ${val}`}>
                  <div
                    className="w-full rounded-t bg-brand"
                    style={{ height: `${(val / maxDaily) * 120}px`, minHeight: 2, opacity: val > 0 ? 1 : 0.2 }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[10px] tabular-nums text-ink/40">
              <span>{series[0]?.[0].slice(5)}</span>
              <span>{series[series.length - 1]?.[0].slice(5)}</span>
            </div>
          </Card>

          {advanced ? (
          <>
          {/* Yoğunluk ısı haritası */}
          <Card title="Yoğunluk ısı haritası (gün × saat)">
            <p className="mb-3 text-xs text-ink/50">En yoğun tarama saatleriniz (yerel saat).</p>
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="flex">
                  <div className="w-9 shrink-0" />
                  {Array.from({ length: 24 }, (_, h) => (
                    <div key={h} className="flex-1 text-center text-[8px] tabular-nums text-ink/40">
                      {h % 3 === 0 ? h : ""}
                    </div>
                  ))}
                </div>
                {heat.map((row, wd) => (
                  <div key={wd} className="mt-[3px] flex items-center">
                    <div className="w-9 shrink-0 text-[10px] font-medium text-ink/50">{WEEKDAYS[wd]}</div>
                    {row.map((val, h) => (
                      <div key={h} className="flex-1 px-[1.5px]">
                        <div
                          className="h-4 rounded-[3px]"
                          title={`${WEEKDAYS[wd]} ${h}:00 — ${val} tarama`}
                          style={{
                            background: val > 0 ? "var(--color-brand, #e0a82e)" : "rgba(0,0,0,0.05)",
                            opacity: val > 0 ? 0.25 + 0.75 * (val / maxHeat) : 1,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Kategori popülerlik */}
          {categoryPop.length > 0 && (
            <Card title="Kategori bazında görüntülenme">
              <ul className="space-y-2.5">
                {categoryPop.map((c) => (
                  <li key={c.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate text-ink">{c.name}</span>
                      <span className="shrink-0 tabular-nums text-ink/55">{c.count}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/5">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Tüm ürünler popülerlik */}
          <Card title="Ürün popülerliği (görüntülenme)">
            {productPop.length === 0 ? (
              <p className="text-sm text-ink/50">Henüz ürün görüntülemesi yok.</p>
            ) : (
              <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {productPop.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <span className="w-6 shrink-0 text-sm font-bold tabular-nums text-ink/30">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate text-ink">{p.name}</span>
                        <span className="shrink-0 font-semibold tabular-nums text-brand-dark">{p.count}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/5">
                        <div className="h-full rounded-full bg-brand/70" style={{ width: `${(p.count / maxProd) * 100}%` }} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          </>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center">
              <p className="font-display text-lg font-semibold text-ink">Gelişmiş analitik kilitli</p>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-ink/60">
                Yoğunluk ısı haritası, ürün ve kategori popülerliği gibi gelişmiş
                raporlar Pro ve Max planlarında. Açtırmak için iletişime geçin.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="font-display text-3xl font-bold tabular-nums text-ink">{value}</div>
      <div className="mt-1 text-sm text-ink/60">{label}</div>
      {hint && <div className="text-xs text-ink/40">{hint}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">{title}</h2>
      {children}
    </div>
  );
}
