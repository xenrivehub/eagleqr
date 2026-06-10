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
import SplashGate from "@/components/menu/SplashGate";
import { getBusinessFeatures } from "@/lib/queries/plan-features";

type Params = { params: Promise<{ slug: string; branchSlug: string }> };

async function getBranch(slug: string, branchSlug: string) {
  const business = await getMenuBusiness(slug);
  if (!business || business.type !== "CHAIN") return null;

  const menu = await prisma.menu.findFirst({
    where: { businessId: business.id, slug: branchSlug, isActive: true },
    select: {
      id: true, name: true, phone: true, address: true, openingHours: true,
      logoUrl: true, contactEmail: true, mapUrl: true, socialLinks: true,
      currency: true, themeKey: true, maintenanceMode: true, maintenanceMessage: true,
    },
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
    robots: data.business.status === "ACTIVE" ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title, description, type: "website", url: `/m/${slug}/${branchSlug}`, siteName: data.business.name },
  };
}

export default async function BranchMenuPage({ params }: Params) {
  const { slug, branchSlug } = await params;
  const data = await getBranch(slug, branchSlug);
  if (!data) notFound();

  const { business, menu } = data;

  // Şubeye özel ayar varsa onu, yoksa marka genelini kullan (effective)
  const menuSocial = (menu.socialLinks as Record<string, string>) ?? {};
  const eff = {
    themeKey: menu.themeKey || business.themeKey,
    currency: menu.currency || business.currency,
    logoUrl: menu.logoUrl ?? business.logoUrl,
    phone: menu.phone ?? business.phone,
    address: menu.address ?? business.address,
    openingHours: menu.openingHours ?? business.openingHours,
    mapUrl: menu.mapUrl ?? business.mapUrl,
    socialLinks: Object.keys(menuSocial).length ? menuSocial : business.socialLinks,
    maintenanceMode: menu.maintenanceMode,
    maintenanceMessage: menu.maintenanceMessage,
  };

  const theme = getTheme(eff.themeKey);
  if (eff.maintenanceMode) {
    const mLang = (await cookies()).get("eq_lang")?.value ?? "tr";
    const mui = (await getUiStrings([mLang]))[mLang];
    return (
      <>
        <link rel="stylesheet" href={theme.fonts.import} />
        <MaintenanceScreen
          theme={theme}
          name={business.name}
          logoUrl={eff.logoUrl}
          title={mui.maintenanceTitle}
          message={eff.maintenanceMessage || mui.maintenanceHint}
        />
      </>
    );
  }
  const [{ products, categoryList }, languages, currency] = await Promise.all([
    loadMenuProducts(menu.id),
    getEnabledLanguages(),
    getCurrencySpec(eff.currency),
  ]);
  const ui = await getUiStrings(["tr", ...languages.map((l) => l.code)]);

  const merged = {
    ...business,
    themeKey: eff.themeKey,
    logoUrl: eff.logoUrl,
    phone: eff.phone,
    address: eff.address,
    openingHours: eff.openingHours,
    mapUrl: eff.mapUrl,
    socialLinks: eff.socialLinks,
  };

  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `${business.name} — ${menu.name}`,
    ...(eff.logoUrl ? { image: eff.logoUrl } : {}),
    ...(eff.address ? { address: eff.address } : {}),
    ...(eff.phone ? { telephone: eff.phone } : {}),
    url: `/m/${slug}/${branchSlug}`,
    servesCuisine: "Çeşitli",
  };

  // QR açılış (splash) ekranı — işletme genelinde, Pro/Max
  const splashOn =
    business.splashEnabled &&
    Boolean(business.splashVideoUrl || business.splashImageUrl) &&
    (await getBusinessFeatures(business.id)).splashScreen;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <link rel="stylesheet" href={theme.fonts.import} />
      {splashOn && (
        <SplashGate slug={slug} imageUrl={business.splashImageUrl} videoUrl={business.splashVideoUrl} />
      )}
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
