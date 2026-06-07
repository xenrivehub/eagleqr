import { prisma } from "@/lib/prisma";
import { defaultHomeSections, type HomeSection } from "@/lib/home-sections";
import { PRICING_DEFAULT, type PricingConfig } from "@/lib/pricing-config";

export const HOME_SECTIONS_KEY = "home_sections";
export const PRICING_CONFIG_KEY = "pricing_config";

export async function getHomeSections(): Promise<HomeSection[]> {
  const row = await prisma.appSetting.findUnique({ where: { key: HOME_SECTIONS_KEY } });
  if (!row?.value) return defaultHomeSections();
  try {
    const parsed = JSON.parse(row.value) as HomeSection[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultHomeSections();
  } catch {
    return defaultHomeSections();
  }
}

export async function getPricingConfig(): Promise<PricingConfig> {
  const row = await prisma.appSetting.findUnique({ where: { key: PRICING_CONFIG_KEY } });
  if (!row?.value) return PRICING_DEFAULT;
  try {
    const parsed = JSON.parse(row.value) as PricingConfig;
    return parsed && Array.isArray(parsed.tiers) ? parsed : PRICING_DEFAULT;
  } catch {
    return PRICING_DEFAULT;
  }
}
