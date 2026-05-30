import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTheme } from "@/lib/themes";
import ShareButton from "@/components/menu/ShareButton";
import TrackView from "@/components/menu/TrackView";

type Params = { params: Promise<{ slug: string; productId: string }> };

async function getProduct(slug: string, productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, business: { slug } },
    include: {
      business: { select: { name: true, type: true, themeKey: true } },
      category: {
        select: { id: true, name: true, menu: { select: { id: true, slug: true } } },
      },
      allergens: { include: { allergen: true } },
    },
  });
  if (!product) return null;

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    orderBy: { createdAt: "asc" },
    take: 4,
    select: { id: true, name: true, price: true, imageUrl: true },
  });

  return { product, related };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, productId } = await params;
  const data = await getProduct(slug, productId);
  if (!data) return { title: "Ürün" };
  return {
    title: `${data.product.name} — ${data.product.business.name}`,
    description: data.product.description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug, productId } = await params;
  const data = await getProduct(slug, productId);
  if (!data) notFound();

  const { product, related } = data;
  const branchSlug = product.category.menu.slug;
  const backHref =
    product.business.type === "CHAIN" && branchSlug
      ? `/m/${slug}/${branchSlug}`
      : `/m/${slug}`;

  const badges = [
    product.isFeatured && "Şefin Seçimi",
    product.isPopular && "Popüler",
    product.isNew && "Yeni",
  ].filter(Boolean) as string[];

  // Tema: menü CSS değişkenlerini ve fontları işletmenin temasına göre override et
  const theme = getTheme(product.business.themeKey);
  const tc = theme.colors;
  const themeVars = {
    "--color-menu-bg": tc.bg,
    "--color-menu-surface": tc.surface,
    "--color-menu-surface-2": tc.surface2,
    "--color-menu-text": tc.ink,
    "--color-menu-muted": tc.sub,
    "--color-menu-gold": tc.accent,
    "--color-menu-border": tc.line,
    "--font-display": theme.fonts.display,
    "--font-sans": theme.fonts.body,
    fontFamily: theme.fonts.body,
  } as CSSProperties;

  return (
    <div className="min-h-dvh bg-menu-bg font-sans text-menu-text" style={themeVars}>
      <link rel="stylesheet" href={theme.fonts.import} />
      <TrackView businessId={product.businessId} type="VIEW" productId={product.id} menuId={product.category.menu.id} />
      <header className="sticky top-0 z-30 border-b border-menu-border bg-menu-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-menu-muted transition-colors hover:text-menu-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-gold/50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m15 18-6-6 6-6" />
            </svg>
            Menü
          </Link>
          <span className="truncate font-display text-sm font-semibold uppercase tracking-[0.18em] text-menu-muted">
            {product.business.name}
          </span>
          <ShareButton title={product.name} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-menu-border">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="h-64 w-full object-cover sm:h-80" />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-menu-surface text-menu-gold/40 sm:h-80">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <path d="M3 11h18M5 11V7a2 2 0 0 1 2-2h2M12 5v6M7 21h10a2 2 0 0 0 2-2v-8H5v8a2 2 0 0 0 2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-menu-bg via-menu-bg/20 to-transparent" />
          {badges.length > 0 && (
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {badges.map((b) => (
                <span key={b} className="rounded-full bg-menu-bg/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-menu-gold backdrop-blur">
                  {b}
                </span>
              ))}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-menu-gold">
              {product.category.name}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
              {product.name}
            </h1>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-menu-muted">
            {product.prepMinutes != null && (
              <span className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {product.prepMinutes} dk
              </span>
            )}
            {product.calories != null && <span>{product.calories} kcal</span>}
          </div>
          <span className="font-display text-2xl font-bold text-menu-gold">
            ₺{product.price.toFixed(2)}
          </span>
        </div>

        {product.description && (
          <section className="mt-7">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-menu-gold">
              ✦ Hakkında
            </h2>
            <p className="mt-2.5 leading-relaxed text-menu-text/90">
              {product.description}
            </p>
          </section>
        )}

        {product.allergens.length > 0 && (
          <section className="mt-7 rounded-2xl border border-menu-border bg-menu-surface p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-menu-gold">
              ⚠ Alerjen Bilgisi
            </h2>
            <p className="mt-2 text-sm text-menu-text/90">
              Bu ürün şu alerjenleri içerir:{" "}
              <span className="font-semibold">
                {product.allergens.map((a) => a.allergen.label).join(", ")}
              </span>
              .
            </p>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-9">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Benzer seçimler</h2>
              <Link href={backHref} className="text-xs uppercase tracking-widest text-menu-muted hover:text-menu-text">
                Tümü →
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/m/${slug}/urun/${r.id}`}
                  className="group w-36 shrink-0 overflow-hidden rounded-2xl border border-menu-border bg-menu-surface transition-colors hover:border-menu-gold/40"
                >
                  {r.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.imageUrl} alt="" loading="lazy" className="h-24 w-full object-cover" />
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center bg-menu-bg text-menu-gold/40">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                        <path d="M3 11h18M5 11V7a2 2 0 0 1 2-2h2M12 5v6M7 21h10a2 2 0 0 0 2-2v-8H5v8a2 2 0 0 0 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <div className="p-2.5">
                    <p className="truncate font-display text-sm font-semibold">{r.name}</p>
                    <p className="mt-0.5 font-display text-sm font-bold text-menu-gold">
                      ₺{r.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
