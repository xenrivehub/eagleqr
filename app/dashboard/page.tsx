import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  const business = session?.user?.businessId
    ? await prisma.business.findUnique({
        where: { id: session.user.businessId },
        select: { name: true, slug: true, status: true },
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">
        Hoş geldiniz{business ? `, ${business.name}` : ""} 👋
      </h1>
      <p className="mt-2 text-ink/60">
        Menünüzü düzenlemek için sol menüden “Menü” bölümüne geçin.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/menu"
          className="group rounded-2xl border border-ink/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
            Menü Yönetimi
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-ink">
            Kategori ve ürünleri düzenle →
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Ürün ekle, fiyatları belirle, alerjenleri işaretle.
          </p>
        </Link>

        {business && (
          <div className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
              İşletme
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/60">Menü adresi</dt>
                <dd className="font-medium text-ink">/m/{business.slug}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/60">Durum</dt>
                <dd className="font-medium text-ink">{business.status}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
