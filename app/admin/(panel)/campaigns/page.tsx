import { prisma } from "@/lib/prisma";
import CampaignManager, { type CampaignRow, type LangOpt } from "@/components/admin/CampaignManager";

export default async function AdminCampaignsPage() {
  const [campaigns, langs] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.language.findMany({ where: { enabled: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const rows: CampaignRow[] = campaigns.map((c) => ({
    id: c.id,
    label: c.label,
    color: c.color,
    translations: (c.translations as Record<string, string>) ?? {},
    enabled: c.enabled,
  }));
  const languages: LangOpt[] = langs.map((l) => ({ code: l.code, label: l.label }));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Kampanya Etiketleri</h1>
      <p className="mt-2 text-ink/60">
        İndirimde, Happy Hour, Günün Menüsü gibi etiketleri yönetin. Açık olanları
        işletmeler ürünlerine atayabilir; saat aralığı ve indirim fiyatını işletme belirler.
      </p>
      <div className="mt-8">
        <CampaignManager campaigns={rows} languages={languages} />
      </div>
    </div>
  );
}
