import { prisma } from "@/lib/prisma";
import { buildEntitlements, type MediaEntitlements, type Plan } from "@/lib/plans";

/**
 * İşletmenin medya (video / AR) yetkilerini hesaplar:
 * plan limiti + ekstra kota − kullanılan adet.
 * `excludeProductId`: ürün düzenlenirken kendi mevcut medyasını sayımdan çıkarmak için.
 */
export async function getMediaEntitlements(
  businessId: string,
  excludeProductId?: string,
): Promise<MediaEntitlements> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { plan: true, videoQuota: true, arQuota: true },
  });
  const plan = (business?.plan ?? "STANDART") as Plan;

  const [planLimit, videoUsed, arUsed] = await Promise.all([
    prisma.planLimit.findUnique({ where: { plan } }),
    prisma.product.count({
      where: {
        businessId,
        videoUrl: { not: null },
        ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
      },
    }),
    prisma.product.count({
      where: {
        businessId,
        modelGlbUrl: { not: null },
        ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
      },
    }),
  ]);

  return buildEntitlements({
    plan,
    planVideoLimit: planLimit?.videoLimit ?? 0,
    planArLimit: planLimit?.arLimit ?? 0,
    videoQuota: business?.videoQuota ?? 0,
    arQuota: business?.arQuota ?? 0,
    videoUsed,
    arUsed,
  });
}
