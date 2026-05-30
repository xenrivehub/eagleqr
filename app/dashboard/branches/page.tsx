import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BranchManager, { type BranchView } from "@/components/dashboard/BranchManager";

export default async function BranchesPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { type: true },
  });
  // Tekil işletmede şube kavramı yok → menüye yönlendir
  if (business?.type !== "CHAIN") redirect("/dashboard/menu");

  const menus = await prisma.menu.findMany({
    where: { businessId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const counts = await prisma.product.groupBy({
    by: ["categoryId"],
    where: { businessId },
    _count: { _all: true },
  });
  const cats = await prisma.category.findMany({
    where: { menu: { businessId } },
    select: { id: true, menuId: true },
  });
  const menuProductCount = new Map<string, number>();
  for (const c of cats) {
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
