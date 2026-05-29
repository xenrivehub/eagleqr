import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateDefaultMenu } from "@/lib/actions/menu";
import { loadMenuForManager } from "@/lib/queries/menu";
import MenuManager from "@/components/dashboard/MenuManager";
import BranchManager, { type BranchView } from "@/components/dashboard/BranchManager";

export default async function MenuPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { type: true },
  });
  if (!business) redirect("/login");

  // Zincir işletme → şube listesi
  if (business.type === "CHAIN") {
    const menus = await prisma.menu.findMany({
      where: { businessId },
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { categories: true } } },
    });

    // ürün sayıları
    const counts = await prisma.product.groupBy({
      by: ["categoryId"],
      where: { businessId },
      _count: { _all: true },
    });
    const catToMenu = await prisma.category.findMany({
      where: { menu: { businessId } },
      select: { id: true, menuId: true },
    });
    const menuProductCount = new Map<string, number>();
    for (const c of catToMenu) {
      const n = counts.find((x) => x.categoryId === c.id)?._count._all ?? 0;
      menuProductCount.set(c.menuId, (menuProductCount.get(c.menuId) ?? 0) + n);
    }

    const branches: BranchView[] = menus.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      productCount: menuProductCount.get(m.id) ?? 0,
    }));

    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <BranchManager branches={branches} />
      </div>
    );
  }

  // Tekil işletme → tek menü
  const menu = await getOrCreateDefaultMenu(businessId);
  const { categories, allergens } = await loadMenuForManager(menu.id);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <MenuManager menuId={menu.id} categories={categories} allergens={allergens} />
    </div>
  );
}
