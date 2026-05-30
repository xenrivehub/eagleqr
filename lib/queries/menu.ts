import { prisma } from "@/lib/prisma";
import type { AllergenOption, CategoryView } from "@/components/dashboard/types";

/** Bir menünün kategori + ürünlerini panel görünümü tipine eşler. */
export async function loadMenuForManager(menuId: string): Promise<{
  categories: CategoryView[];
  allergens: AllergenOption[];
}> {
  const [categoriesRaw, allergens] = await Promise.all([
    prisma.category.findMany({
      where: { menuId },
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
      videoUrl: p.videoUrl,
      modelGlbUrl: p.modelGlbUrl,
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      isPopular: p.isPopular,
    })),
  }));

  return {
    categories,
    allergens: allergens.map((a) => ({ id: a.id, label: a.label })),
  };
}
