import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMenuBusiness, loadMenuProducts } from "@/lib/queries/customer-menu";
import MenuView from "@/components/menu/MenuView";
import TrackView from "@/components/menu/TrackView";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    select: { name: true },
  });
  return {
    title: business ? `${business.name} — Menü` : "Menü",
    description: business ? `${business.name} dijital menüsü` : undefined,
  };
}

export default async function CustomerMenuPage({ params }: Params) {
  const { slug } = await params;
  const business = await getMenuBusiness(slug);
  if (!business) notFound();

  // Zincir işletme → şube seçici
  if (business.type === "CHAIN") {
    const branches = await prisma.menu.findMany({
      where: { businessId: business.id, isActive: true, slug: { not: null } },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, slug: true },
    });

    return (
      <div className="min-h-dvh bg-menu-bg font-sans text-menu-text">
        <TrackView businessId={business.id} type="SCAN" />
        <header className="border-b border-menu-border">
          <div className="mx-auto max-w-3xl px-4 py-7 text-center sm:px-6">
            {business.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.logoUrl} alt="" className="mx-auto mb-3 h-14 w-14 rounded-full border border-menu-border object-cover" />
            )}
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-menu-gold/80">
              Dijital Menü
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.18em] sm:text-3xl">
              {business.name}
            </h1>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h2 className="text-center font-display text-lg font-semibold">Şube seçin</h2>
          {branches.length === 0 ? (
            <p className="mt-6 text-center text-sm text-menu-muted">
              Henüz şube eklenmemiş.
            </p>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {branches.map((b) => (
                <Link
                  key={b.id}
                  href={`/m/${slug}/${b.slug}`}
                  className="group flex items-center justify-between rounded-2xl border border-menu-border bg-menu-surface px-5 py-4 transition-colors hover:border-menu-gold/40 hover:bg-menu-surface-2"
                >
                  <span className="font-display text-base font-semibold">{b.name}</span>
                  <span className="text-menu-gold transition-transform group-hover:translate-x-1">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tekil işletme → tek menü
  const menu = await prisma.menu.findFirst({
    where: { businessId: business.id, isActive: true },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  const { products, categoryList } = menu
    ? await loadMenuProducts(menu.id)
    : { products: [], categoryList: [] };

  return (
    <MenuView
      slug={slug}
      business={business}
      menuId={menu?.id}
      products={products}
      categoryList={categoryList}
    />
  );
}
