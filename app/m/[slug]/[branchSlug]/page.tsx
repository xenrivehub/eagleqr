import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMenuBusiness, loadMenuProducts } from "@/lib/queries/customer-menu";
import MenuView from "@/components/menu/MenuView";

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
  const { products, categoryList } = await loadMenuProducts(menu.id);

  // Şube iletişim bilgisi varsa onu, yoksa işletme genelini göster
  const merged = {
    ...business,
    phone: menu.phone ?? business.phone,
    address: menu.address ?? business.address,
    openingHours: menu.openingHours ?? business.openingHours,
  };

  return (
    <MenuView
      slug={slug}
      business={merged}
      menuId={menu.id}
      branchName={menu.name}
      products={products}
      categoryList={categoryList}
    />
  );
}
