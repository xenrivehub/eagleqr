import { prisma } from "@/lib/prisma";
import type { MenuProduct } from "@/components/menu/MenuBrowser";
import type { MenuBusiness } from "@/components/menu/MenuView";

const businessSelect = {
  id: true,
  name: true,
  type: true,
  themeKey: true,
  currency: true,
  ratingsEnabled: true,
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

type CatTrans = Record<string, { name?: string }>;
type ProdTrans = Record<string, { name?: string; description?: string }>;

export async function loadMenuProducts(menuId: string): Promise<{
  products: MenuProduct[];
  categoryList: { id: string; name: string; translations: CatTrans }[];
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

  // Ürün başına yıldız ortalaması + oy sayısı
  const productIds = categories.flatMap((c) => c.products.map((p) => p.id));
  const ratingRows = productIds.length
    ? await prisma.productRating.groupBy({
        by: ["productId"],
        where: { productId: { in: productIds } },
        _avg: { stars: true },
        _count: { _all: true },
      })
    : [];
  const ratingMap = new Map(
    ratingRows.map((r) => [
      r.productId,
      { avg: Math.round((r._avg.stars ?? 0) * 10) / 10, count: r._count._all },
    ]),
  );

  const products: MenuProduct[] = categories.flatMap((c) =>
    c.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price.toFixed(2),
      calories: p.calories,
      prepMinutes: p.prepMinutes,
      imageUrl: p.imageUrl,
      hasVideo: !!p.videoUrl,
      hasAr: !!p.modelGlbUrl,
      categoryId: c.id,
      categoryName: c.name,
      translations: (p.translations as ProdTrans) ?? {},
      rating: ratingMap.get(p.id) ?? { avg: 0, count: 0 },
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
    .map((c) => ({ id: c.id, name: c.name, translations: (c.translations as CatTrans) ?? {} }));

  return { products, categoryList };
}
