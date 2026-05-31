import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getActiveBranch } from "@/lib/branch-context";
import QrCode from "@/components/dashboard/QrCode";

export default async function QrPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { name: true, slug: true, type: true, logoUrl: true },
  });
  if (!business) redirect("/login");

  // Zincir → aktif şubenin QR'ı
  if (business.type === "CHAIN") {
    const { active } = await getActiveBranch(businessId);
    if (!active) {
      return (
        <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
          <h1 className="font-display text-2xl font-bold text-ink">QR Kod</h1>
          <p className="mt-8 rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/60">
            Önce <Link href="/dashboard/branches" className="font-semibold text-brand-dark hover:underline">bir şube ekleyin</Link>.
          </p>
        </div>
      );
    }

    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-2xl font-bold text-ink">QR Kod</h1>
        <p className="mt-2 text-ink/60">
          <span className="font-semibold text-ink">{active.name}</span> şubesinin
          QR kodu. Başka şube için sol menüden şube değiştirin.
        </p>
        <div className="mt-8">
          <QrCode
            path={`/m/${business.slug}/${active.slug}`}
            slug={`${business.slug}-${active.slug}`}
            businessName={`${business.name} · ${active.name}`}
            logoUrl={business.logoUrl}
          />
        </div>
      </div>
    );
  }

  // Tekil
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">QR Kod</h1>
      <p className="mt-2 text-ink/60">
        Menünüzün QR kodunu indirip masalarınızda kullanın.
      </p>
      <div className="mt-8">
        <QrCode path={`/m/${business.slug}`} slug={business.slug} businessName={business.name} logoUrl={business.logoUrl} />
      </div>
    </div>
  );
}
