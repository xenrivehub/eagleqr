import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [businesses, pending, active, suspended, products, users, scans] =
    await Promise.all([
      prisma.business.count(),
      prisma.business.count({ where: { status: "PENDING" } }),
      prisma.business.count({ where: { status: "ACTIVE" } }),
      prisma.business.count({ where: { status: "SUSPENDED" } }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.scanEvent.count(),
    ]);

  const stats = [
    { label: "Toplam işletme", value: businesses },
    { label: "Aktif", value: active },
    { label: "Onay bekleyen", value: pending },
    { label: "Askıya alınmış", value: suspended },
    { label: "Toplam ürün", value: products },
    { label: "Kullanıcı", value: users },
    { label: "QR tarama", value: scans },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Genel Bakış</h1>
      <p className="mt-2 text-ink/60">Platform özeti.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink/10 bg-white p-5">
            <div className="font-display text-3xl font-bold tabular-nums text-ink">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-ink/60">{s.label}</div>
          </div>
        ))}
      </div>

      {pending > 0 && (
        <Link
          href="/admin/businesses"
          className="mt-6 flex items-center justify-between rounded-2xl border border-brand/40 bg-brand-soft px-5 py-4 transition-colors hover:bg-brand-soft/70"
        >
          <span className="text-sm font-semibold text-ink">
            {pending} işletme onay bekliyor
          </span>
          <span className="text-sm font-semibold text-brand-dark">İncele →</span>
        </Link>
      )}
    </div>
  );
}
