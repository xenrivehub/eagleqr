import { prisma } from "@/lib/prisma";
import type { MenuProduct } from "@/components/menu/MenuBrowser";
import type { MenuBusiness } from "@/components/menu/MenuView";

const businessSelect = {
  id: true,
  name: true,
  type: true,
  logoUrl: true,
  coverUrl: true,
  heroOverline: true,
  heroTitle: true,
  heroSubtitle: true,
  phone: true,
  address: true,
  openingHours: true,
} as const;

export async function getMenuBusiness(slug: string) {
  return prisma.business.findUnique({
    where: { slug },
    select: businessSelect,
  });
}

export type MenuBusinessWithType = MenuBusiness & {
  type: "SINGLE" | "CHAIN";
};

export async function loadMenuProducts(menuId: string): Promise<{
  products: MenuProduct[];
  categoryList: { id: string; name: string }[];
}> {
  const categories = await prisma.category.findMany({
    where: { menuId },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        orderBy: { createdAt: "asc" },
        include: { allergens: { include: { allergen: true } } },
      },
    },
  });

  const products: MenuProduct[] = categories.flatMap((c) =>
    c.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price.toFixed(2),
      calories: p.calories,
      prepMinutes: p.prepMinutes,
      imageUrl: p.imageUrl,
      categoryId: c.id,
      categoryName: c.name,
      allergens: p.allergens.map((a) => ({
        code: a.allergen.code,
        label: a.allergen.label,
      })),
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      isPopular: p.isPopular,
    })),
  );

  const categoryList = categories
    .filter((c) => c.products.length > 0)
    .map((c) => ({ id: c.id, name: c.name }));

  return { products, categoryList };
}
