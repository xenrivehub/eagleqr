import { prisma } from "@/lib/prisma";
import { isCampaignLive, isWithinWindow, applyDiscount } from "@/lib/campaign";
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
  mapUrl: true,
  socialLinks: true,
  maintenanceMode: true,
  maintenanceMessage: true,
} as const;

export async function getMenuBusiness(slug: string) {
  const b = await prisma.business.findUnique({
    where: { slug },
    select: businessSelect,
  });
  if (!b) return null;
  return { ...b, socialLinks: (b.socialLinks as Record<string, string>) ?? {} };
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
      campaign: { select: { label: true, color: true, translations: true, enabled: true } },
      products: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          allergens: { include: { allergen: true } },
          campaign: { select: { label: true, color: true, translations: true, enabled: true } },
        },
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

  const products: MenuProduct[] = categories
    .filter((c) => isWithinWindow(c.availStart, c.availEnd))
    .flatMap((c) => {
      // Kategori kampanyası (aktifse) — ürünün kendi kampanyası yoksa uygulanır
      const cc = c.campaign;
      const catCamp =
        cc && cc.enabled && c.campaignDiscType && c.campaignDiscValue != null &&
        isCampaignLive(c.campaignStart, c.campaignEnd, c.campaignDateStart, c.campaignDateEnd)
          ? {
              color: cc.color,
              label: cc.label,
              translations: (cc.translations as Record<string, string>) ?? {},
              discType: c.campaignDiscType as "percent" | "fixed",
              discValue: Number(c.campaignDiscValue),
            }
          : null;
      return c.products.filter((p) => isWithinWindow(p.availStart, p.availEnd)).map((p) => {
      const prodLive =
        p.campaign && p.campaign.enabled &&
        isCampaignLive(p.campaignStart, p.campaignEnd, p.campaignDateStart, p.campaignDateEnd);
      let campaign: { color: string; label: string; translations: Record<string, string> } | null = null;
      let campaignPrice: string | null = null;
      if (prodLive) {
        campaign = {
          color: p.campaign!.color,
          label: p.campaign!.label,
          translations: (p.campaign!.translations as Record<string, string>) ?? {},
        };
        campaignPrice = p.campaignPrice ? p.campaignPrice.toFixed(2) : null;
      } else if (catCamp) {
        campaign = { color: catCamp.color, label: catCamp.label, translations: catCamp.translations };
        campaignPrice = applyDiscount(Number(p.price), catCamp.discType, catCamp.discValue).toFixed(2);
      }
      return {
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
      campaign,
      campaignPrice,
      isSoldOut: p.isSoldOut,
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      isPopular: p.isPopular,
      };
      });
    });

  const categoryList = categories
    .filter(
      (c) =>
        isWithinWindow(c.availStart, c.availEnd) &&
        c.products.some((p) => isWithinWindow(p.availStart, p.availEnd)),
    )
    .map((c) => ({ id: c.id, name: c.name, translations: (c.translations as CatTrans) ?? {} }));

  return { products, categoryList };
}
