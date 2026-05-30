import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMenuBusiness, loadMenuProducts } from "@/lib/queries/customer-menu";
import { getEnabledLanguages } from "@/lib/queries/languages";
import { getCurrencySpec } from "@/lib/queries/currencies";
import { getUiStrings } from "@/lib/queries/ui-strings";
import { getTheme } from "@/lib/themes";
import ThemedMenu from "@/components/menu/ThemedMenu";

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
  return {
    title: `${data.menu.name} — ${data.business.name}`,
    description: `${data.business.name} ${data.menu.name} menüsü`,
  };
}

export default async function BranchMenuPage({ params }: Params) {
  const { slug, branchSlug } = await params;
  const data = await getBranch(slug, branchSlug);
  if (!data) notFound();

  const { business, menu } = data;
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
