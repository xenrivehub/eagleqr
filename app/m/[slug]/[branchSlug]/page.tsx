import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMenuBusiness, loadMenuProducts } from "@/lib/queries/customer-menu";
import { getEnabledLanguages } from "@/lib/queries/languages";
import { getCurrencySpec } from "@/lib/queries/currencies";
import { getUiStrings } from "@/lib/queries/ui-strings";
import { getSeoSettings } from "@/lib/queries/seo";
import { fillSeo } from "@/lib/seo";
import { cookies } from "next/headers";
import { getTheme } from "@/lib/themes";
import ThemedMenu from "@/components/menu/ThemedMenu";
import MaintenanceScreen from "@/components/menu/MaintenanceScreen";

type Params = { params: Promise<{ slug: string; branchSlug: string }> };

async function getBranch(slug: string, branchSlug: string) {
  const business = await getMenuBusiness(slug);
  if (!business || business.type !== "CHAIN") return null;

  const menu = await prisma.menu.findFirst({
    where: { businessId: business.id, slug: branchSlug, isActive: true },
    select: { id: true, name: true, phone: true, address: true, openingHours: true },
  });
  if (!menu) return null;

  return { business, menu };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, branchSlug } = await params;
  const data = await getBranch(slug, branchSlug);
  if (!data) return { title: "Menü" };
  const seo = await getSeoSettings();
  const vars = { business: data.business.name, branch: data.menu.name };
  const title = fillSeo(seo.branchTitle, vars);
  const description = fillSeo(seo.branchDescription, vars);
  const keywords = seo.keywords.split(",").map((k) => fillSeo(k, vars).trim()).filter(Boolean);
  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/m/${slug}/${branchSlug}` },
    robots: { index: true, follow: true },
    openGraph: { title, description, type: "website", url: `/m/${slug}/${branchSlug}`, siteName: data.business.name },
  };
}

export default async function BranchMenuPage({ params }: Params) {
  const { slug, branchSlug } = await params;
  const data = await getBranch(slug, branchSlug);
  if (!data) notFound();

  const { business, menu } = data;
  const theme0 = getTheme(business.themeKey);
  if (business.maintenanceMode) {
    const mLang = (await cookies()).get("eq_lang")?.value ?? "tr";
    const mui = (await getUiStrings([mLang]))[mLang];
    return (
      <>
        <link rel="stylesheet" href={theme0.fonts.import} />
        <MaintenanceScreen
          theme={theme0}
          name={business.name}
          logoUrl={business.logoUrl}
          title={mui.maintenanceTitle}
          message={business.maintenanceMessage || mui.maintenanceHint}
        />
      </>
    );
  }
  const [{ products, categoryList }, languages, currency] = await Promise.all([
    loadMenuProducts(menu.id),
    getEnabledLanguages(),
    getCurrencySpec(business.currency),
  ]);
  const ui = await getUiStrings(["tr", ...languages.map((l) => l.code)]);
  const theme = getTheme(business.themeKey);

  // Şube iletişim bilgisi varsa onu, yoksa işletme genelini göster
  const merged = {
    ...business,
    phone: menu.phone ?? business.phone,
    address: menu.address ?? business.address,
    openingHours: menu.openingHours ?? business.openingHours,
  };

  return (
    <>
      <link rel="stylesheet" href={theme.fonts.import} />
      <ThemedMenu
        theme={theme}
        business={merged}
        slug={slug}
        menuId={menu.id}
        branchName={menu.name}
        products={products}
        categories={categoryList}
        languages={languages}
        currency={currency}
        ui={ui}
        ratingsEnabled={business.ratingsEnabled}
      />
    </>
  );
}
