import { prisma } from "@/lib/prisma";
import SeoManager, { type SeoBusiness } from "@/components/admin/SeoManager";

export default async function AdminSeoPage() {
  const businesses = await prisma.business.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, seoTitle: true, seoDescription: true, seoKeywords: true },
  });

  const rows: SeoBusiness[] = businesses.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    seoTitle: b.seoTitle ?? "",
    seoDescription: b.seoDescription ?? "",
    seoKeywords: b.seoKeywords ?? "",
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">SEO Ayarları</h1>
      <p className="mt-2 text-ink/60">
        Her işletmenin müşteri menüsü için arama motoru başlık, açıklama ve
        anahtar kelimelerini ayarlayın. Boş bırakılanlar otomatik (SEO uyumlu)
        üretilir.
      </p>
      <div className="mt-8">
        <SeoManager businesses={rows} />
      </div>
    </div>
  );
}
