import { prisma } from "@/lib/prisma";
import { getNavForAdmin } from "@/lib/queries/navbar";
import NavbarManager from "@/components/admin/NavbarManager";

export default async function AdminNavbarPage() {
  const [items, pages] = await Promise.all([
    getNavForAdmin(),
    prisma.page.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, slug: true, status: true } }),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Navbar</h1>
      <p className="mt-2 text-ink/60">
        Site üst menüsünü buradan düzenleyin. Üst öğeler doğrudan link olabilir ya
        da altına link eklediğinizde açılır menü (dropdown) olur. Boş bırakırsanız
        varsayılan menü gösterilir.
      </p>
      <div className="mt-8">
        <NavbarManager
          initial={items}
          pages={pages.map((p) => ({ id: p.id, title: p.title, slug: p.slug, published: p.status === "PUBLISHED" }))}
        />
      </div>
    </div>
  );
}
