import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import QrCode from "@/components/dashboard/QrCode";

export default async function QrPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    select: { name: true, slug: true, type: true },
  });
  if (!business) redirect("/login");

  const isChain = business.type === "CHAIN";
  const branches = isChain
    ? await prisma.menu.findMany({
        where: { businessId: session.user.businessId, slug: { not: null } },
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, slug: true },
      })
    : [];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">QR Kod</h1>
      <p className="mt-2 text-ink/60">
        {isChain
          ? "Her şubenin QR kodunu indirip ilgili lokasyonda kullanın."
          : "Menünüzün QR kodunu indirip masalarınızda kullanın."}
      </p>

      {isChain ? (
        branches.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/60">
            Önce “Menü” bölümünden şube ekleyin.
          </p>
        ) : (
          <div className="mt-8 space-y-10">
            {branches.map((b) => (
              <div key={b.id} className="border-b border-ink/10 pb-10 last:border-0 last:pb-0">
                <h2 className="mb-4 font-display text-lg font-semibold text-ink">{b.name}</h2>
                <QrCode
                  path={`/m/${business.slug}/${b.slug}`}
                  slug={`${business.slug}-${b.slug}`}
                  businessName={`${business.name} · ${b.name}`}
                />
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="mt-8">
          <QrCode
            path={`/m/${business.slug}`}
            slug={business.slug}
            businessName={business.name}
          />
        </div>
      )}
    </div>
  );
}
