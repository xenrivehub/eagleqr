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
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          include: {
            allergens: { select: { allergenId: true } },
            pairings: { orderBy: { sortOrder: "asc" }, select: { pairedId: true } },
          },
        },
      },
    }),
    prisma.allergen.findMany({ orderBy: { label: "asc" } }),
  ]);

  const categories: CategoryView[] = categoriesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    imageUrl: c.imageUrl,
    videoUrl: c.videoUrl,
    availStart: c.availStart,
    availEnd: c.availEnd,
    campaignId: c.campaignId,
    campaignStart: c.campaignStart,
    campaignEnd: c.campaignEnd,
    campaignDateStart: c.campaignDateStart,
    campaignDateEnd: c.campaignDateEnd,
    campaignDiscType: c.campaignDiscType,
    campaignDiscValue: c.campaignDiscValue ? c.campaignDiscValue.toFixed(2) : null,
    products: c.products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price.toFixed(2),
      description: p.description,
      calories: p.calories,
      prepMinutes: p.prepMinutes,
      weight: p.weight,
      portion: p.portion,
      categoryId: c.id,
      allergenIds: p.allergens.map((a) => a.allergenId),
      imageUrl: p.imageUrl,
      videoUrl: p.videoUrl,
      modelGlbUrl: p.modelGlbUrl,
      pairedIds: p.pairings.map((x) => x.pairedId),
      campaignId: p.campaignId,
      campaignStart: p.campaignStart,
      campaignEnd: p.campaignEnd,
      campaignDateStart: p.campaignDateStart,
      campaignDateEnd: p.campaignDateEnd,
      campaignPrice: p.campaignPrice ? p.campaignPrice.toFixed(2) : null,
      availStart: p.availStart,
      availEnd: p.availEnd,
      variations: ((p.variations as { name: string; icon?: string; price: number }[]) ?? []).map((v) => ({
        name: v.name,
        icon: v.icon ?? "",
        price: String(v.price),
      })),
      isSoldOut: p.isSoldOut,
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
