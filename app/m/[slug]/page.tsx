import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MenuBrowser, { type MenuProduct } from "@/components/menu/MenuBrowser";
import TrackView from "@/components/menu/TrackView";

type Params = { params: Promise<{ slug: string }> };

async function getBusinessMenu(slug: string) {
  const business = await prisma.business.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      coverUrl: true,
      heroOverline: true,
      heroTitle: true,
      heroSubtitle: true,
    },
  });
  if (!business) return null;

  const menu = await prisma.menu.findFirst({
    where: { businessId: business.id, isActive: true },
    orderBy: { createdAt: "asc" },
  });

  const categories = menu
    ? await prisma.category.findMany({
        where: { menuId: menu.id },
        orderBy: { sortOrder: "asc" },
        include: {
          products: {
            orderBy: { createdAt: "asc" },
            include: { allergens: { include: { allergen: true } } },
          },
        },
      })
    : [];

  return { business, categories };
}

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
  const data = await getBusinessMenu(slug);
  if (!data) notFound();

  const { business, categories } = data;

  const products: MenuProduct[] = categories.flatMap((c) =>
    c.products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price.toFixed(2),
      calories: p.calories,
      prepMinutes: p.prepMinutes,
      imageUrl: p.imageUrl,
      categoryId: c.id,
      categoryName: c.name,
      allergens: p.allergens.map((a) => ({
        code: a.allergen.code,
        label: a.allergen.label,
      })),
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      isPopular: p.isPopular,
    })),
  );

  const featured = products.filter((p) => p.isFeatured).slice(0, 6);
  const categoryList = categories
    .filter((c) => c.products.length > 0)
    .map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="min-h-dvh bg-menu-bg font-sans text-menu-text">
      <TrackView businessId={business.id} type="SCAN" />
      {/* Header */}
      <header className="border-b border-menu-border">
        <div className="mx-auto max-w-3xl px-4 py-7 text-center sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-menu-gold/80">
            Dijital Menü
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.18em] sm:text-3xl">
            {business.name}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-menu-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Açık
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6">
        {/* İşletme hero / kapak */}
        {(business.coverUrl || business.heroTitle) && (
          <section className="relative mb-8 overflow-hidden rounded-3xl border border-menu-border">
            {business.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={business.coverUrl}
                alt=""
                className="h-48 w-full object-cover sm:h-64"
              />
            ) : (
              <div className="h-48 w-full bg-gradient-to-br from-menu-surface-2 to-menu-bg sm:h-64" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-menu-bg via-menu-bg/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              {business.heroOverline && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-menu-gold">
                  {business.heroOverline}
                </p>
              )}
              {business.heroTitle && (
                <h2 className="mt-1.5 max-w-lg font-display text-2xl font-bold italic leading-snug text-menu-text sm:text-3xl">
                  {business.heroTitle}
                </h2>
              )}
              {business.heroSubtitle && (
                <p className="mt-2 max-w-md text-sm leading-relaxed text-menu-text/80">
                  {business.heroSubtitle}
                </p>
              )}
            </div>
          </section>
        )}

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-menu-border p-12 text-center">
            <p className="font-display text-lg font-semibold">Menü hazırlanıyor</p>
            <p className="mt-1 text-sm text-menu-muted">
              Bu işletme menüsünü henüz yayınlamadı.
            </p>
          </div>
        ) : (
          <>
            {/* Şefin Seçimi */}
            {featured.length > 0 && (
              <section className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">
                    <span className="text-menu-gold">✦</span> Şefin Seçimi
                  </h2>
                  <span className="text-[10px] uppercase tracking-widest text-menu-muted">
                    El ile derlendi
                  </span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {featured.map((p) => (
                    <Link
                      key={p.id}
                      href={`/m/${slug}/${p.id}`}
                      className="group w-40 shrink-0 overflow-hidden rounded-2xl border border-menu-border bg-menu-surface transition-colors hover:border-menu-gold/40"
                    >
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt="" loading="lazy" className="h-28 w-full object-cover" />
                      ) : (
                        <div className="flex h-28 w-full items-center justify-center bg-menu-bg text-menu-gold/40">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                            <path d="M3 11h18M5 11V7a2 2 0 0 1 2-2h2M12 5v6M7 21h10a2 2 0 0 0 2-2v-8H5v8a2 2 0 0 0 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                      <div className="p-3">
                        <p className="truncate font-display text-sm font-semibold">{p.name}</p>
                        <p className="mt-0.5 font-display text-sm font-bold text-menu-gold">₺{p.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <MenuBrowser slug={slug} products={products} categories={categoryList} />
          </>
        )}

        <footer className="mt-14 border-t border-menu-border pt-7 text-center">
          <p className="font-display text-lg font-bold uppercase tracking-[0.18em]">
            {business.name}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-menu-muted">
            Fiyatlara KDV dahildir. Alerjen bilgisi için lütfen servis ekibimize
            danışın.
          </p>
          <p className="mt-3 text-[10px] uppercase tracking-widest text-menu-muted/60">
            Eagle QR ile hazırlanmıştır
          </p>
        </footer>
      </div>
    </div>
  );
}
