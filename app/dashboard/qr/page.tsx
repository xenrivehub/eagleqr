import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import QrCode from "@/components/dashboard/QrCode";

export default async function QrPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    select: { name: true, slug: true },
  });
  if (!business) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">QR Kod</h1>
      <p className="mt-2 text-ink/60">
        Menünüzün QR kodunu indirip masalarınızda kullanın.
      </p>
      <div className="mt-8">
        <QrCode
          path={`/m/${business.slug}`}
          slug={business.slug}
          businessName={business.name}
        />
      </div>
    </div>
  );
}
