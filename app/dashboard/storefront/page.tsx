import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import StorefrontForm from "@/components/dashboard/StorefrontForm";
import SplashForm from "@/components/dashboard/SplashForm";
import { getBusinessFeatures } from "@/lib/queries/plan-features";

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
      splashEnabled: true,
      splashImageUrl: true,
      splashVideoUrl: true,
    },
  });
  if (!business) redirect("/login");

  const splashAllowed = (await getBusinessFeatures(session.user.businessId)).splashScreen;

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

      <div className="mt-12 border-t border-ink/10 pt-10">
        <h2 className="font-display text-xl font-bold text-ink">QR Açılış Ekranı</h2>
        <p className="mt-2 text-ink/60">
          QR okutulduğunda menüden önce gösterilecek tam ekran karşılama (video veya görsel).
        </p>
        <div className="mt-6">
          {splashAllowed ? (
            <SplashForm
              enabled={business.splashEnabled}
              imageUrl={business.splashImageUrl}
              videoUrl={business.splashVideoUrl}
            />
          ) : (
            <div className="max-w-2xl rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center">
              <p className="font-display text-lg font-semibold text-ink">Açılış ekranı kilitli</p>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-ink/60">
                QR açılış (karşılama) ekranı Pro ve Max planlarında. Açtırmak için iletişime geçin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
