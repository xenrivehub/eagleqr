import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StorefrontForm from "@/components/dashboard/StorefrontForm";

export default async function StorefrontPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    select: {
      coverUrl: true,
      heroOverline: true,
      heroTitle: true,
      heroSubtitle: true,
    },
  });
  if (!business) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Vitrin</h1>
      <p className="mt-2 text-ink/60">
        Müşteri menünüzün üst kısmında görünecek kapak görseli ve karşılama
        metnini düzenleyin.
      </p>
      <div className="mt-8">
        <StorefrontForm
          coverUrl={business.coverUrl}
          heroOverline={business.heroOverline ?? ""}
          heroTitle={business.heroTitle ?? ""}
          heroSubtitle={business.heroSubtitle ?? ""}
        />
      </div>
    </div>
  );
}
