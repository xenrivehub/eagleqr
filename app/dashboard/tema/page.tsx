import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getTheme } from "@/lib/themes";
import ThemePicker from "@/components/dashboard/ThemePicker";

export default async function ThemePage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    select: { themeKey: true, slug: true, allowedThemes: true },
  });
  if (!business) redirect("/login");

  const active = getTheme(business.themeKey);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Tema</h1>
          <p className="mt-2 text-ink/60">
            Müşterilerin gördüğü menünün görünümünü seçin. Seçtiğiniz tema anında
            menünüze uygulanır.
          </p>
        </div>
        <Link
          href={`/m/${business.slug}`}
          target="_blank"
          className="shrink-0 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
        >
          Menüyü önizle ↗
        </Link>
      </div>

      <div className="mt-8">
        <ThemePicker current={active.key} allowed={business.allowedThemes} />
      </div>
    </div>
  );
}
