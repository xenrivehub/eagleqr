import { prisma } from "@/lib/prisma";

export type CampaignOption = {
  id: string;
  label: string;
  color: string;
  translations: Record<string, string>;
};

/** Açık (enabled) kampanya etiketleri, sıraya göre. */
export async function getEnabledCampaigns(): Promise<CampaignOption[]> {
  const rows = await prisma.campaign.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((c) => ({
    id: c.id,
    label: c.label,
    color: c.color,
    translations: (c.translations as Record<string, string>) ?? {},
  }));
}
