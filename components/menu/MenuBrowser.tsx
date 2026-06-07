"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type MenuProduct = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  calories: number | null;
  prepMinutes: number | null;
  weight: string | null;
  portion: string | null;
  imageUrl: string | null;
  hasVideo: boolean;
  hasAr: boolean;
  categoryId: string;
  categoryName: string;
  translations: Record<string, { name?: string; description?: string }>;
  allergens: { code: string; label: string }[];
  rating: { avg: number; count: number };
  campaign: { color: string; label: string; translations: Record<string, string> } | null;
  campaignPrice: string | null;
  isSoldOut: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
};

type Chip = "featured" | "new" | "popular";

const chipDefs: { key: Chip; label: string }[] = [
  { key: "featured", label: "Şefin Seçimi" },
  { key: "popular", label: "Popüler" },
  { key: "new", label: "Yeni" },
];

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-menu-gold/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-menu-gold">
      {children}
    </span>
  );
}

export default function MenuBrowser({
  slug,
  products,
  categories,
}: {
  slug: string;
  products: MenuProduct[];
  categories: { id: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [chips, setChips] = useState<Set<Chip>>(new Set());

  function toggleChip(c: Chip) {
    setChips((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return products.filter((p) => {
      if (activeCat !== "all" && p.categoryId !== activeCat) return false;
      if (chips.has("featured") && !p.isFeatured) return false;
      if (chips.has("new") && !p.isNew) return false;
      if (chips.has("popular") && !p.isPopular) return false;
      if (q) {
        const hay = `${p.name} ${p.description ?? ""} ${p.categoryName}`.toLocaleLowerCase("tr");
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, query, activeCat, chips]);

  return (
    <div>
      {/* Arama */}
      <div className="relative">
        <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-menu-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yemek, malzeme veya kategori ara…"
          className="h-12 w-full rounded-full border border-menu-border bg-menu-surface pl-11 pr-4 text-sm text-menu-text placeholder:text-menu-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-gold/50"
        />
      </div>

      {/* Filtre çipleri */}
      <div className="mt-4 flex flex-wrap gap-2">
        {chipDefs.map((c) => {
          const on = chips.has(c.key);
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => toggleChip(c.key)}
              aria-pressed={on}
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                on
                  ? "border-menu-gold bg-menu-gold/15 text-menu-gold"
                  : "border-menu-border text-menu-muted hover:text-menu-text"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Kategori sekmeleri */}
      <div className="mt-5 flex gap-5 overflow-x-auto border-b border-menu-border pb-px">
        {[{ id: "all", name: "Tümü" }, ...categories].map((cat) => {
          const on = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCat(cat.id)}
              className={`relative shrink-0 cursor-pointer pb-2.5 text-sm transition-colors ${
                on ? "font-semibold text-menu-text" : "text-menu-muted hover:text-menu-text"
              }`}
            >
              {cat.name}
              {on && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-menu-gold" />}
            </button>
          );
        })}
      </div>

      {/* Liste */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-menu-muted">
            Aramanıza uygun ürün bulunamadı.
          </p>
        ) : (
          filtered.map((p) => (
            <Link
              key={p.id}
              href={`/m/${slug}/urun/${p.id}`}
              className="group flex gap-4 rounded-2xl border border-menu-border bg-menu-surface p-3 transition-colors hover:border-menu-gold/40 hover:bg-menu-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-gold/50 sm:p-4"
            >
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-[88px] sm:w-[88px]" />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-menu-bg text-menu-gold/50 sm:h-[88px] sm:w-[88px]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 11h18M5 11V7a2 2 0 0 1 2-2h2M12 5v6M7 21h10a2 2 0 0 0 2-2v-8H5v8a2 2 0 0 0 2 2z" />
                  </svg>
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="font-display text-base font-semibold leading-snug text-menu-text">
                  {p.name}
                </h3>
                {p.description && (
                  <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-menu-muted">
                    {p.description}
                  </p>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
                  {p.isFeatured && <Badge>Şefin Seçimi</Badge>}
                  {p.isPopular && <Badge>Popüler</Badge>}
                  {p.isNew && <Badge>Yeni</Badge>}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end justify-between">
                <span className="font-display font-bold tabular-nums text-menu-gold">
                  ₺{p.price}
                </span>
                {p.prepMinutes != null && (
                  <span className="text-xs text-menu-muted">{p.prepMinutes} dk</span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
