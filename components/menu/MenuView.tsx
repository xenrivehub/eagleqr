import Link from "next/link";
import MenuBrowser, { type MenuProduct } from "@/components/menu/MenuBrowser";
import TrackView from "@/components/menu/TrackView";

export type MenuBusiness = {
  id: string;
  name: string;
  logoUrl: string | null;
  coverUrl: string | null;
  heroOverline: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  phone: string | null;
  address: string | null;
  openingHours: string | null;
};

function ProductIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 11h18M5 11V7a2 2 0 0 1 2-2h2M12 5v6M7 21h10a2 2 0 0 0 2-2v-8H5v8a2 2 0 0 0 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MenuView({
  slug,
  business,
  menuId,
  branchName,
  products,
  categoryList,
}: {
  slug: string;
  business: MenuBusiness;
  menuId?: string;
  branchName?: string;
  products: MenuProduct[];
  categoryList: { id: string; name: string }[];
}) {
  const featured = products.filter((p) => p.isFeatured).slice(0, 6);

  return (
    <div className="min-h-dvh bg-menu-bg font-sans text-menu-text">
      <TrackView businessId={business.id} type="SCAN" menuId={menuId} />

      <header className="border-b border-menu-border">
        <div className="mx-auto max-w-3xl px-4 py-7 text-center sm:px-6">
          {business.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logoUrl}
              alt=""
              className="mx-auto mb-3 h-14 w-14 rounded-full border border-menu-border object-cover"
            />
          )}
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-menu-gold/80">
            Dijital Menü
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.18em] sm:text-3xl">
            {business.name}
          </h1>
          {branchName && (
            <p className="mt-1 text-sm font-medium tracking-wide text-menu-gold">
              {branchName}
            </p>
          )}
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-menu-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Açık
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6">
        {(business.coverUrl || business.heroTitle) && (
          <section className="relative mb-8 overflow-hidden rounded-3xl border border-menu-border">
            {business.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.coverUrl} alt="" className="h-48 w-full object-cover sm:h-64" />
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
              Bu menü henüz yayınlanmadı.
            </p>
          </div>
        ) : (
          <>
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
                      href={`/m/${slug}/urun/${p.id}`}
                      className="group w-40 shrink-0 overflow-hidden rounded-2xl border border-menu-border bg-menu-surface transition-colors hover:border-menu-gold/40"
                    >
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt="" loading="lazy" className="h-28 w-full object-cover" />
                      ) : (
                        <div className="flex h-28 w-full items-center justify-center bg-menu-bg text-menu-gold/40">
                          <ProductIcon />
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
          {(business.address || business.phone || business.openingHours) && (
            <div className="mt-2 space-y-0.5 text-xs text-menu-muted">
              {business.address && <p>{business.address}</p>}
              {business.openingHours && <p>{business.openingHours}</p>}
              {business.phone && <p>{business.phone}</p>}
            </div>
          )}
          <p className="mt-3 text-xs leading-relaxed text-menu-muted">
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
