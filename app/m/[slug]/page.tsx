import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMenuBusiness, loadMenuProducts } from "@/lib/queries/customer-menu";
import { cookies } from "next/headers";
import { getEnabledLanguages } from "@/lib/queries/languages";
import { getCurrencySpec } from "@/lib/queries/currencies";
import { getUiStrings } from "@/lib/queries/ui-strings";
import { getSeoSettings } from "@/lib/queries/seo";
import { fillSeo } from "@/lib/seo";
import { getTheme } from "@/lib/themes";
import ThemedMenu from "@/components/menu/ThemedMenu";
import MaintenanceScreen from "@/components/menu/MaintenanceScreen";
import TrackView from "@/components/menu/TrackView";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    select: { name: true, logoUrl: true, coverUrl: true, status: true },
  });
  if (!business) return { title: "Menü" };
  const indexable = business.status === "ACTIVE";

  // Global SEO şablonları (admin'den, tüm işletmeler için ortak)
  const seo = await getSeoSettings();
  const title = fillSeo(seo.menuTitle, { business: business.name });
  const description = fillSeo(seo.menuDescription, { business: business.name });
  const keywords = seo.keywords
    .split(",")
    .map((k) => fillSeo(k, { business: business.name }).trim())
    .filter(Boolean);
  const image = business.coverUrl || business.logoUrl || undefined;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/m/${slug}` },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/m/${slug}`,
      siteName: business.name,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function CustomerMenuPage({ params }: Params) {
  const { slug } = await params;
  const business = await getMenuBusiness(slug);
  if (!business) notFound();

  const theme = getTheme(business.themeKey);
  const c = theme.colors;

  // Bakım modu → tüm işletme için bilgilendirme ekranı
  if (business.maintenanceMode) {
    const mLang = (await cookies()).get("eq_lang")?.value ?? "tr";
    const mui = (await getUiStrings([mLang]))[mLang];
    return (
      <>
        <link rel="stylesheet" href={theme.fonts.import} />
        <MaintenanceScreen
          theme={theme}
          name={business.name}
          logoUrl={business.logoUrl}
          title={mui.maintenanceTitle}
          message={business.maintenanceMessage || mui.maintenanceHint}
        />
      </>
    );
  }

  // Zincir işletme → şube seçici (tema renkleriyle)
  if (business.type === "CHAIN") {
    const branches = await prisma.menu.findMany({
      where: { businessId: business.id, isActive: true, slug: { not: null } },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, slug: true },
    });

    const cLang = (await cookies()).get("eq_lang")?.value ?? "tr";
    const cui = (await getUiStrings([cLang]))[cLang];

    return (
      <>
        <link rel="stylesheet" href={theme.fonts.import} />
        <div style={{ minHeight: "100dvh", background: c.bg, color: c.ink, fontFamily: theme.fonts.body }}>
          <TrackView businessId={business.id} type="SCAN" />
          <header style={{ textAlign: "center", padding: "36px 20px 28px", borderBottom: `1px solid ${c.line}` }}>
            {business.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.logoUrl} alt="" style={{ width: 56, height: 56, borderRadius: 999, objectFit: "cover", margin: "0 auto 14px", display: "block", border: `1px solid ${c.line}` }} />
            )}
            <div style={{ fontSize: 10, letterSpacing: "0.4em", color: c.accent, fontWeight: 600 }}>{cui.digitalMenu}</div>
            <h1 style={{ fontFamily: theme.fonts.display, margin: "12px 0 0", fontSize: 30, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {business.name}
            </h1>
          </header>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
            <h2 style={{ fontFamily: theme.fonts.display, textAlign: "center", fontSize: 18, fontWeight: 700 }}>{cui.selectBranch}</h2>
            {branches.length === 0 ? (
              <p style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: c.sub }}>Henüz şube eklenmemiş.</p>
            ) : (
              <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
                {branches.map((b) => (
                  <Link
                    key={b.id}
                    href={`/m/${slug}/${b.slug}`}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: c.surface, border: theme.cardBorder, borderRadius: theme.radius, boxShadow: theme.cardShadow, padding: "16px 20px", textDecoration: "none", color: c.ink }}
                  >
                    <span style={{ fontFamily: theme.fonts.display, fontSize: 16, fontWeight: 700 }}>{b.name}</span>
                    <span style={{ color: c.accent }}>→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Tekil işletme → tek menü
  const menu = await prisma.menu.findFirst({
    where: { businessId: business.id, isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  const [{ products, categoryList }, languages, currency] = await Promise.all([
    menu ? loadMenuProducts(menu.id) : Promise.resolve({ products: [], categoryList: [] }),
    getEnabledLanguages(),
    getCurrencySpec(business.currency),
  ]);
  const ui = await getUiStrings(["tr", ...languages.map((l) => l.code)]);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    ...(business.coverUrl || business.logoUrl ? { image: business.coverUrl || business.logoUrl } : {}),
    ...(business.address ? { address: business.address } : {}),
    ...(business.phone ? { telephone: business.phone } : {}),
    url: `/m/${slug}`,
    hasMenu: `/m/${slug}`,
    servesCuisine: "Çeşitli",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <link rel="stylesheet" href={theme.fonts.import} />
      <ThemedMenu
        theme={theme}
        business={business}
        slug={slug}
        menuId={menu?.id}
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
