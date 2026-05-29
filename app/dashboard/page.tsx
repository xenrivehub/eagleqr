import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

  const [products, scans, views, weekScans, branches] = businessId
    ? await Promise.all([
        prisma.product.count({ where: { businessId } }),
        prisma.scanEvent.count({ where: { businessId, type: "SCAN" } }),
        prisma.scanEvent.count({ where: { businessId, type: "VIEW" } }),
        prisma.scanEvent.count({
          where: {
            businessId,
            type: "SCAN",
            ts: { gte: new Date(Date.now() - 7 * 86400_000) },
          },
        }),
        isChain ? prisma.menu.count({ where: { businessId } }) : Promise.resolve(0),
      ])
    : [0, 0, 0, 0, 0];

  const stats = [
    { label: "Toplam tarama", value: scans },
    { label: "Son 7 gün", value: weekScans },
    { label: "Ürün görüntüleme", value: views },
    isChain
      ? { label: "Şube", value: branches }
      : { label: "Ürün", value: products },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">
        Hoş geldiniz{business ? `, ${business.name}` : ""} 👋
      </h1>
      <p className="mt-2 text-ink/60">
        İşletmenizin özetine göz atın, menünüzü buradan yönetin.
      </p>

      {/* İstatistik kartları */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="font-display text-3xl font-bold tabular-nums text-ink">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-ink/60">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/menu"
          className="group rounded-2xl border border-ink/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
            {isChain ? "Şube & Menü" : "Menü Yönetimi"}
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-ink">
            {isChain ? "Şubeleri ve menüleri düzenle →" : "Kategori ve ürünleri düzenle →"}
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Ürün ekle, fiyatları belirle, alerjenleri işaretle.
          </p>
        </Link>

        <Link
          href="/dashboard/analytics"
          className="group rounded-2xl border border-ink/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
            Analitik
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-ink">
            İstatistikleri görüntüle →
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Tarama ve görüntülenme verilerinizi inceleyin.
          </p>
        </Link>

        {business && (
          <div className="rounded-2xl border border-ink/10 bg-white p-5 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
              İşletme
            </p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0.5">
                <dt className="text-ink/60">Menü adresi</dt>
                <dd className="font-medium text-ink">/m/{business.slug}</dd>
              </div>
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0.5">
                <dt className="text-ink/60">Tür</dt>
                <dd className="font-medium text-ink">{isChain ? "Zincir" : "Tekil"}</dd>
              </div>
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0.5">
                <dt className="text-ink/60">Durum</dt>
                <dd className="font-medium text-ink">
                  {statusLabel[business.status] ?? business.status}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
