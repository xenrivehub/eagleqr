import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Türkiye UTC+3 — günlük sınırlar için
const TR_OFFSET = 3 * 3600_000;

const statusLabel: Record<string, string> = {
  PENDING: "Onay bekliyor",
  ACTIVE: "Aktif",
  SUSPENDED: "Askıda",
};

export default async function DashboardPage() {
  const session = await auth();
  const businessId = session?.user?.businessId ?? null;

  const business = businessId
    ? await prisma.business.findUnique({
        where: { id: businessId },
        select: { name: true, slug: true, status: true, type: true },
      })
    : null;
  const isChain = business?.type === "CHAIN";

  const now = Date.now();
  const trNow = new Date(now + TR_OFFSET);
  const trMidnight = Date.UTC(trNow.getUTCFullYear(), trNow.getUTCMonth(), trNow.getUTCDate());
  const todayStart = new Date(trMidnight - TR_OFFSET);
  const since30 = new Date(now - 30 * 86400_000);
  const since14 = new Date(now - 14 * 86400_000);
  const where: Prisma.ScanEventWhereInput = businessId ? { businessId } : { businessId: "__none__" };

  const [todayScans, todayViews, scans30, views30, arOpens, scanTs14, langRows, topViews] =
    await Promise.all([
      prisma.scanEvent.count({ where: { ...where, type: "SCAN", ts: { gte: todayStart } } }),
      prisma.scanEvent.count({ where: { ...where, type: "VIEW", ts: { gte: todayStart } } }),
      prisma.scanEvent.count({ where: { ...where, type: "SCAN", ts: { gte: since30 } } }),
      prisma.scanEvent.count({ where: { ...where, type: "VIEW", ts: { gte: since30 } } }),
      prisma.scanEvent.count({ where: { ...where, type: "AR_OPEN", ts: { gte: since30 } } }),
      prisma.scanEvent.findMany({ where: { ...where, type: "SCAN", ts: { gte: since14 } }, select: { ts: true } }),
      prisma.scanEvent.groupBy({ by: ["lang"], where: { ...where, type: "SCAN", lang: { not: null }, ts: { gte: since30 } }, _count: { lang: true } }),
      prisma.scanEvent.groupBy({ by: ["productId"], where: { ...where, type: "VIEW", productId: { not: null }, ts: { gte: since30 } }, _count: { productId: true } }),
    ]);

  const interest = scans30 > 0 ? Math.round((views30 / scans30) * 100) : 0;

  // 14 günlük tarama serisi
  const buckets = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    buckets.set(new Date(now - i * 86400_000 + TR_OFFSET).toISOString().slice(0, 10), 0);
  }
  for (const e of scanTs14) {
    const k = new Date(e.ts.getTime() + TR_OFFSET).toISOString().slice(0, 10);
    if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + 1);
  }
  const series = [...buckets.entries()];
  const maxDaily = Math.max(1, ...series.map(([, v]) => v));

  // Dil dağılımı
  const langTotal = langRows.reduce((s, r) => s + r._count.lang, 0);
  const langDist = langRows
    .map((r) => ({ lang: (r.lang as string).toUpperCase(), c: r._count.lang }))
    .sort((a, b) => b.c - a.c)
    .slice(0, 4);

  // En çok bakılan ürünler
  const topIds = topViews
    .map((r) => ({ id: r.productId as string, c: r._count.productId }))
    .sort((a, b) => b.c - a.c)
    .slice(0, 4);
  const prods = topIds.length
    ? await prisma.product.findMany({
        where: { id: { in: topIds.map((t) => t.id) } },
        select: { id: true, name: true, imageUrl: true, videoUrl: true, modelGlbUrl: true, category: { select: { name: true } } },
      })
    : [];
  const prodMap = new Map(prods.map((p) => [p.id, p]));
  const topProducts = topIds
    .map((t) => ({ ...t, p: prodMap.get(t.id) }))
    .filter((t): t is typeof t & { p: NonNullable<typeof t.p> } => Boolean(t.p));

  const hasData = scans30 > 0 || views30 > 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      {/* Karşılama */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Hoş geldiniz{business ? `, ${business.name}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {hasData
              ? `Son 30 günde ${scans30.toLocaleString("tr-TR")} tarama aldınız.`
              : "Menünüzü hazırlayın, QR'ınızı paylaşın; veriler burada birikecek."}
          </p>
        </div>
        <Link
          href="/dashboard/menu"
          className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark"
        >
          Menüyü düzenle
        </Link>
      </div>

      {/* Stat kutuları */}
      <div className="mt-7 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Bugünkü tarama" value={todayScans} />
        <Stat label="Bugünkü görüntüleme" value={todayViews} />
        <Stat label="İlgi oranı (30 gün)" value={`%${interest}`} hint="görüntüleme / tarama" />
        <Stat label="AR açılışı (30 gün)" value={arOpens} accent />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        {/* 14 günlük grafik */}
        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-lg font-semibold text-ink">Tarama, son 14 gün</h2>
            <Link href="/dashboard/analytics" className="text-xs font-bold text-brand-dark hover:underline">Tüm analitik →</Link>
          </div>
          {hasData ? (
            <>
              <div className="mt-6 flex h-40 items-end gap-1.5" role="img" aria-label="Son 14 gün günlük tarama sayıları">
                {series.map(([day, v], i) => (
                  <div key={day} className="flex flex-1 flex-col items-center justify-end" title={`${day}: ${v}`}>
                    <div
                      className={`w-full rounded-t ${i === series.length - 1 ? "bg-brand" : "bg-ink/10"}`}
                      style={{ height: `${Math.max(4, (v / maxDaily) * 100)}%`, minHeight: 4 }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[11px] tabular-nums text-ink/40">
                <span>{series[0]?.[0].slice(5)}</span>
                <span>{series[series.length - 1]?.[0].slice(5)}</span>
              </div>
            </>
          ) : (
            <p className="py-12 text-center text-sm text-ink/50">Henüz tarama verisi yok.</p>
          )}
        </section>

        {/* Dil dağılımı */}
        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Misafirin dili</h2>
          <p className="mt-1 text-xs text-ink/50">Son 30 gün, menü açılış dili.</p>
          {langDist.length > 0 ? (
            <ul className="mt-5 space-y-3.5 text-sm">
              {langDist.map((l) => {
                const pct = langTotal > 0 ? Math.round((l.c / langTotal) * 100) : 0;
                return (
                  <li key={l.lang}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-ink">{l.lang}</span>
                      <span className="tabular-nums text-ink/55">%{pct}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/5">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 text-sm text-ink/50">Henüz dil verisi yok.</p>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        {/* En çok bakılan */}
        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Son 30 günde en çok bakılan</h2>
          {topProducts.length > 0 ? (
            <ul className="mt-4 divide-y divide-ink/5">
              {topProducts.map((t) => (
                <li key={t.id} className="flex items-center gap-4 py-3.5">
                  {t.p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.p.imageUrl} alt="" className="h-11 w-11 rounded-xl border border-ink/10 object-cover" />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-dashed border-ink/15 text-ink/30" aria-hidden>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></svg>
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{t.p.name}</p>
                    <p className="text-xs text-ink/50">{t.p.category.name}</p>
                  </div>
                  {t.p.modelGlbUrl && <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-dark">AR</span>}
                  {!t.p.modelGlbUrl && t.p.videoUrl && <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-bold text-ink/50">Video</span>}
                  <span className="w-10 text-right font-display text-lg font-bold tabular-nums text-ink">{t.c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-ink/50">Henüz ürün görüntülemesi yok.</p>
          )}
        </section>

        {/* Hızlı erişim */}
        <section className="rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Hızlı erişim</h2>
          <div className="mt-4 grid gap-2.5">
            <QuickLink href="/dashboard/menu" label={isChain ? "Şube & menü yönetimi" : "Menü ve ürünler"} />
            <QuickLink href="/dashboard/qr" label="QR kodu indir" />
            <QuickLink href="/dashboard/storefront" label="Vitrin & açılış ekranı" />
            <QuickLink href="/dashboard/analytics" label="Detaylı analitik" />
          </div>
          {business && (
            <dl className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Menü adresi</dt>
                <dd className="font-medium text-ink">/m/{business.slug}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Durum</dt>
                <dd className="font-medium text-ink">{statusLabel[business.status] ?? business.status}</dd>
              </div>
            </dl>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: number | string; hint?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-brand/30 bg-brand-soft/40" : "border-ink/10 bg-white"}`}>
      <div className={`font-display text-3xl font-bold tabular-nums ${accent ? "text-brand-dark" : "text-ink"}`}>{value}</div>
      <div className="mt-1 text-sm text-ink/60">{label}</div>
      {hint && <div className="text-xs text-ink/40">{hint}</div>}
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-ink/10 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:bg-brand-soft/40"
    >
      {label}
      <span className="text-ink/40" aria-hidden>→</span>
    </Link>
  );
}
