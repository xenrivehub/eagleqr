import { listPages, ensureLegalPages } from "@/lib/queries/pages";
import PagesList from "@/components/admin/PagesList";

export default async function AdminPagesPage() {
  await ensureLegalPages();
  const pages = await listPages();
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Sayfalar</h1>
      <p className="mt-2 text-ink/60">
        Pazarlama sayfalarını buradan oluşturun ve düzenleyin. Her sayfa
        <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5 text-xs">eaglemenu.com/slug</code>
        adresinde yayınlanır.
      </p>
      <div className="mt-8">
        <PagesList
          pages={pages.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            status: p.status,
            updatedAt: p.updatedAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
