import { prisma } from "@/lib/prisma";
import { SEO_KEYS, SEO_DEFAULTS, type SeoSettings } from "@/lib/seo";

/** Global SEO şablonları (boş olanlar kod varsayılanına düşer). */
export async function getSeoSettings(): Promise<SeoSettings> {
  const rows = await prisma.appSetting.findMany({
    where: { key: { in: Object.values(SEO_KEYS) } },
    select: { key: true, value: true },
  });
  const map = new Map(rows.map((r) => [r.key, r.value?.trim()]));
  const pick = (k: keyof typeof SEO_KEYS) => map.get(SEO_KEYS[k]) || SEO_DEFAULTS[k];
  return {
    homeTitle: pick("homeTitle"),
    homeDescription: pick("homeDescription"),
    menuTitle: pick("menuTitle"),
    menuDescription: pick("menuDescription"),
    productTitle: pick("productTitle"),
    productDescription: pick("productDescription"),
    branchTitle: pick("branchTitle"),
    branchDescription: pick("branchDescription"),
    keywords: pick("keywords"),
  };
}
