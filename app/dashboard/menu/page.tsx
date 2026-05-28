import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateDefaultMenu } from "@/lib/actions/menu";
import MenuManager from "@/components/dashboard/MenuManager";
import type { CategoryView } from "@/components/dashboard/types";

export default async function MenuPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const menu = await getOrCreateDefaultMenu(businessId);

  const [categoriesRaw, allergens] = await Promise.all([
    prisma.category.findMany({
      where: { menuId: menu.id },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          orderBy: { createdAt: "asc" },
          include: { allergens: { select: { allergenId: true } } },
        },
      },
    }),
    prisma.allergen.findMany({ orderBy: { label: "asc" } }),
  ]);

  const categories: CategoryView[] = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    products: c.products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price.toFixed(2),
      description: p.description,
      calories: p.calories,
      prepMinutes: p.prepMinutes,
      categoryId: c.id,
      allergenIds: p.allergens.map((a) => a.allergenId),
      imageUrl: p.imageUrl,
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      isPopular: p.isPopular,
    })),
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <MenuManager
        categories={categories}
        allergens={allergens.map((a) => ({ id: a.id, label: a.label }))}
      />
    </div>
  );
}
