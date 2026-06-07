import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTheme } from "@/lib/themes";
import { allergenLabel } from "@/lib/allergen-i18n";
import { formatPrice } from "@/lib/currency";
import { getCurrencySpec } from "@/lib/queries/currencies";
import { getUiStrings } from "@/lib/queries/ui-strings";
import { getSeoSettings } from "@/lib/queries/seo";
import { fillSeo } from "@/lib/seo";
import { isCampaignLive, applyDiscount } from "@/lib/campaign";
import ShareButton from "@/components/menu/ShareButton";
import TrackView from "@/components/menu/TrackView";
import ProductAr from "@/components/menu/ProductAr";
import AllergenWarning from "@/components/menu/AllergenWarning";
import StarRating from "@/components/menu/StarRating";

type Params = { params: Promise<{ slug: string; productId: string }> };

async function getProduct(slug: string, productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, business: { slug } },
    include: {
      business: { select: { name: true, type: true, themeKey: true, currency: true, ratingsEnabled: true } },
      category: {
        select: {
          id: true, name: true, translations: true,
          campaignStart: true, campaignEnd: true, campaignDateStart: true, campaignDateEnd: true,
          campaignDiscType: true, campaignDiscValue: true,
          campaign: { select: { label: true, color: true, translations: true, enabled: true } },
          menu: { select: { id: true, slug: true } },
        },
      },
      allergens: { include: { allergen: true } },
      campaign: { select: { label: true, color: true, translations: true, enabled: true } },
      pairings: {
        orderBy: { sortOrder: "asc" },
        select: {
          paired: { select: { id: true, name: true, price: true, imageUrl: true, translations: true } },
        },
      },
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
  const p = data.product;
  const seo = await getSeoSettings();
  const vars = { business: p.business.name, product: p.name };
  const title = fillSeo(seo.productTitle, vars);
  // Açıklamada ürünün kendi açıklaması önceliklidir (daha iyi SEO), yoksa şablon
  const description = p.description?.trim() || fillSeo(seo.productDescription, vars);
  const keywords = seo.keywords.split(",").map((k) => fillSeo(k, vars).trim()).filter(Boolean);
  const img = p.imageUrl ?? undefined;
  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/m/${slug}/urun/${productId}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: img ? [{ url: img }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: img ? [img] : undefined },
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug, productId } = await params;
  const data = await getProduct(slug, productId);
  if (!data) notFound();

  const { product, related } = data;

  // Müşterinin seçtiği dil (cookie ile gelir; menü sayfasındaki seçici yazıyor)
  const store = await cookies();
  const langPref = store.get("eq_lang")?.value ?? "tr";
  const langRow =
    langPref !== "tr"
      ? await prisma.language.findUnique({ where: { code: langPref } })
      : null;
  const lang = langRow?.enabled ? langPref : "tr";
  const isRtl = langRow?.rtl ?? false;
  const ptr = (product.translations as Record<string, { name?: string; description?: string }>) ?? {};
  const ctr = (product.category.translations as Record<string, { name?: string }>) ?? {};
  const dName = (lang !== "tr" && ptr[lang]?.name) || product.name;
  const dDesc = (lang !== "tr" && ptr[lang]?.description) || product.description;
  const dCat = (lang !== "tr" && ctr[lang]?.name) || product.category.name;

  const currency = await getCurrencySpec(product.business.currency);
  const ui = (await getUiStrings([lang]))[lang];

  // Kampanya: ürün kendi kampanyası öncelikli, yoksa kategori kampanyası
  const trLabel = (c: { label: string; translations: unknown }) =>
    (lang !== "tr" && (c.translations as Record<string, string>)?.[lang]) || c.label;
  let campaign: { color: string; label: string } | null = null;
  let campaignPrice: number | null = null;
  const prodLive =
    product.campaign?.enabled &&
    isCampaignLive(product.campaignStart, product.campaignEnd, product.campaignDateStart, product.campaignDateEnd);
  if (prodLive) {
    campaign = { color: product.campaign!.color, label: trLabel(product.campaign!) };
    campaignPrice = product.campaignPrice ? Number(product.campaignPrice) : null;
  } else {
    const cat = product.category;
    const cc = cat.campaign;
    if (
      cc?.enabled && cat.campaignDiscType && cat.campaignDiscValue != null &&
      isCampaignLive(cat.campaignStart, cat.campaignEnd, cat.campaignDateStart, cat.campaignDateEnd)
    ) {
      campaign = { color: cc.color, label: trLabel(cc) };
      campaignPrice = applyDiscount(Number(product.price), cat.campaignDiscType as "percent" | "fixed", Number(cat.campaignDiscValue));
    }
  }

  const variations = ((product.variations as { name: string; icon?: string; price: number }[]) ?? []).filter(
    (v) => v && v.name,
  );

  const pairedItems = product.pairings.map((pp) => {
    const ptr = (pp.paired.translations as Record<string, { name?: string }>) ?? {};
    return {
      id: pp.paired.id,
      name: (lang !== "tr" && ptr[lang]?.name) || pp.paired.name,
      price: pp.paired.price,
      imageUrl: pp.paired.imageUrl,
    };
  });

  // Yıldız puanı özeti (işletme açtıysa)
  let rating: { avg: number; count: number; mine: number } | null = null;
  if (product.business.ratingsEnabled) {
    const anonId = store.get("eq_anon")?.value ?? null;
    const [agg, mineRow] = await Promise.all([
      prisma.productRating.aggregate({
        where: { productId: product.id },
        _avg: { stars: true },
        _count: { _all: true },
      }),
      anonId
        ? prisma.productRating.findUnique({
            where: { productId_anonId: { productId: product.id, anonId } },
            select: { stars: true },
          })
        : Promise.resolve(null),
    ]);
    rating = {
      avg: Math.round((agg._avg.stars ?? 0) * 10) / 10,
      count: agg._count._all,
      mine: mineRow?.stars ?? 0,
    };
  }

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
    "--color-menu-on-accent": tc.onAccent,
    "--color-menu-border": tc.line,
    "--font-display": theme.fonts.display,
    "--font-sans": theme.fonts.body,
    fontFamily: theme.fonts.body,
  } as CSSProperties;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-dvh bg-menu-bg font-sans text-menu-text" style={themeVars}>
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
            {ui.backToMenu}
          </Link>
          <span className="truncate font-display text-sm font-semibold uppercase tracking-[0.18em] text-menu-muted">
            {product.business.name}
          </span>
          <ShareButton title={product.name} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-menu-border">
          {product.videoUrl ? (
            // Ürün videosu varsa: görselin yerinde sessiz, otomatik, sürekli döner
            <video
              src={product.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              poster={product.imageUrl ?? undefined}
              className="h-64 w-full object-cover sm:h-80"
            />
          ) : product.imageUrl ? (
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
          {(badges.length > 0 || campaign || product.isSoldOut) && (
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {product.isSoldOut && (
                <span className="rounded-full bg-menu-text px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-menu-bg">
                  {ui.soldOut}
                </span>
              )}
              {campaign && (
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: campaign.color }}>
                  {campaign.label}
                </span>
              )}
              {badges.map((b) => (
                <span key={b} className="rounded-full bg-menu-bg/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-menu-gold backdrop-blur">
                  {b}
                </span>
              ))}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-menu-gold">
              {dCat}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
              {dName}
            </h1>
          </div>
        </div>

        <AllergenWarning
          intro={ui.allergenWarnIntro}
          allergens={product.allergens.map((a) => ({
            code: a.allergen.code,
            label: a.allergen.label,
          }))}
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-menu-muted">
            {product.prepMinutes != null && (
              <span className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                {product.prepMinutes} {ui.minutesShort}
              </span>
            )}
            {product.calories != null && <span>{product.calories} kcal</span>}
            {product.weight && (
              <span className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3a2 2 0 0 0-2 2H6l-3 14h18L18 5h-4a2 2 0 0 0-2-2z" />
                </svg>
                {product.weight}
              </span>
            )}
            {product.portion && (
              <span className="flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v9l5 3" />
                </svg>
                {product.portion}
              </span>
            )}
            {product.modelGlbUrl && (
              <ProductAr src={product.modelGlbUrl} poster={product.imageUrl} label={ui.viewInAR} />
            )}
          </div>
          {campaignPrice ? (
            <span className="flex items-baseline gap-2">
              <span className="font-display text-base text-menu-muted line-through">
                {formatPrice(product.price.toFixed(2), currency)}
              </span>
              <span className="font-display text-2xl font-bold text-menu-gold">
                {formatPrice(campaignPrice.toFixed(2), currency)}
              </span>
            </span>
          ) : (
            <span className="font-display text-2xl font-bold text-menu-gold">
              {formatPrice(product.price.toFixed(2), currency)}
            </span>
          )}
        </div>

        {variations.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-menu-gold">
              {ui.options}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {variations.map((v, i) => (
                <div
                  key={i}
                  className="flex min-w-[88px] flex-col items-center gap-1 rounded-2xl border border-menu-border bg-menu-surface px-4 py-3 text-center"
                >
                  {v.icon && <span aria-hidden className="text-2xl leading-none">{v.icon}</span>}
                  <span className="font-display text-base font-semibold text-menu-text">{v.name}</span>
                  {Number(v.price) > 0 && (
                    <span className="text-sm font-bold text-menu-gold">
                      +{formatPrice(Number(v.price).toFixed(2), currency)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {rating && (
          <StarRating
            productId={product.id}
            avg={rating.avg}
            count={rating.count}
            mine={rating.mine}
            labels={{ rateThis: ui.rateThis, votes: ui.votes, thanks: ui.rateThanks }}
          />
        )}

        {dDesc && (
          <section className="mt-7">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-menu-gold">
              ✦ {ui.about}
            </h2>
            <p className="mt-2.5 leading-relaxed text-menu-text/90">
              {dDesc}
            </p>
          </section>
        )}

        {product.allergens.length > 0 && (
          <section className="mt-7 rounded-2xl border border-menu-border bg-menu-surface p-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-menu-gold">
              ⚠ {ui.allergenInfo}
            </h2>
            <p className="mt-2 text-sm text-menu-text/90">
              {ui.productAllergenIntro}{" "}
              <span className="font-semibold">
                {product.allergens.map((a) => allergenLabel(a.allergen.code, lang, a.allergen.label)).join(", ")}
              </span>
              .
            </p>
          </section>
        )}

        {pairedItems.length > 0 && (
          <section className="mt-9">
            <h2 className="mb-3 font-display text-lg font-semibold">✦ {ui.pairsWith}</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {pairedItems.map((r) => (
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
                      {formatPrice(r.price.toFixed(2), currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-9">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{ui.similar}</h2>
              <Link href={backHref} className="text-xs uppercase tracking-widest text-menu-muted hover:text-menu-text">
                {ui.seeAll} →
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
                      {formatPrice(r.price.toFixed(2), currency)}
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
