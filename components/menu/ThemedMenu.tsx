"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { ThemeSpec } from "@/lib/themes";
import type { MenuProduct } from "@/components/menu/MenuBrowser";
import TrackView from "@/components/menu/TrackView";

export type ThemedBusiness = {
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

type Chip = "featured" | "new" | "popular";
const chipDefs: { key: Chip; label: string }[] = [
  { key: "featured", label: "Şefin Seçimi" },
  { key: "popular", label: "Popüler" },
  { key: "new", label: "Yeni" },
];

function ImgFrame({ src, t, h }: { src: string | null; t: ThemeSpec; h: number }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        style={{ width: "100%", height: h, objectFit: "cover", borderRadius: t.radius, display: "block" }}
      />
    );
  }
  return (
    <div
      style={{
        width: "100%", height: h, borderRadius: t.radius,
        background: t.colors.surface2, display: "flex", alignItems: "center", justifyContent: "center",
        color: t.colors.faint,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 11h18M5 11V7a2 2 0 0 1 2-2h2M12 5v6M7 21h10a2 2 0 0 0 2-2v-8H5v8a2 2 0 0 0 2 2z" />
      </svg>
    </div>
  );
}

export default function ThemedMenu({
  theme: t,
  business,
  slug,
  menuId,
  branchName,
  products,
  categories,
}: {
  theme: ThemeSpec;
  business: ThemedBusiness;
  slug: string;
  menuId?: string;
  branchName?: string;
  products: MenuProduct[];
  categories: { id: string; name: string }[];
}) {
  const c = t.colors;
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [chips, setChips] = useState<Set<Chip>>(new Set());

  const featured = products.filter((p) => p.isFeatured).slice(0, 6);

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

  function toggleChip(k: Chip) {
    setChips((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  }

  const cardStyle: CSSProperties = {
    background: c.surface, border: t.cardBorder, borderRadius: t.radius, boxShadow: t.cardShadow,
  };
  const display = (extra: CSSProperties = {}): CSSProperties => ({ fontFamily: t.fonts.display, ...extra });
  const pricePill: CSSProperties = t.priceFilled
    ? { background: c.accent, color: c.onAccent, borderRadius: 999, padding: "3px 10px", fontWeight: 700 }
    : { color: c.accent, fontWeight: 700 };

  const tags = (p: MenuProduct) =>
    [p.isFeatured && "Şefin Seçimi", p.isPopular && "Popüler", p.isNew && "Yeni"].filter(Boolean) as string[];

  return (
    <div style={{ minHeight: "100dvh", background: c.bg, color: c.ink, fontFamily: t.fonts.body }}>
      <TrackView businessId={business.id} type="SCAN" menuId={menuId} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 48px" }}>
        {/* HEADER */}
        <header style={{ textAlign: "center", padding: "36px 0 28px" }}>
          {business.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.logoUrl} alt="" style={{ width: 56, height: 56, borderRadius: 999, objectFit: "cover", margin: "0 auto 14px", display: "block", border: `1px solid ${c.line}` }} />
          )}
          <div style={{ fontSize: 10, letterSpacing: "0.4em", color: c.accent, fontWeight: 600 }}>DİJİTAL MENÜ</div>
          <h1 style={display({ margin: "12px 0 6px", fontSize: 30, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" })}>
            {business.name}
          </h1>
          {branchName && <div style={{ fontSize: 14, color: c.accent, fontWeight: 600 }}>{branchName}</div>}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 12, fontSize: 11.5, color: c.sub, border: `1px solid ${c.line}`, borderRadius: 999, padding: "5px 13px" }}>
            <span style={{ width: 6, height: 6, borderRadius: 5, background: "#22c55e" }} />Açık
          </div>
        </header>

        {/* HERO */}
        {(business.coverUrl || business.heroTitle) && (
          <section style={{ marginBottom: 34 }}>
            {business.coverUrl && <ImgFrame src={business.coverUrl} t={t} h={200} />}
            <div style={{ marginTop: business.coverUrl ? 16 : 0 }}>
              {business.heroOverline && (
                <div style={{ fontSize: 10, letterSpacing: "0.34em", color: c.accent, fontWeight: 600 }}>{business.heroOverline}</div>
              )}
              {business.heroTitle && (
                <h2 style={display({ margin: "8px 0 8px", fontSize: 26, lineHeight: 1.1, fontWeight: 700, fontStyle: t.headingSerif ? "italic" : "normal" })}>
                  {business.heroTitle}
                </h2>
              )}
              {business.heroSubtitle && (
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: c.sub, maxWidth: 440 }}>{business.heroSubtitle}</p>
              )}
            </div>
          </section>
        )}

        {products.length === 0 ? (
          <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}>
            <p style={display({ fontSize: 18, fontWeight: 700, margin: 0 })}>Menü hazırlanıyor</p>
            <p style={{ fontSize: 13, color: c.sub, marginTop: 6 }}>Bu menü henüz yayınlanmadı.</p>
          </div>
        ) : (
          <>
            {/* CHEF PICKS */}
            {featured.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={display({ margin: 0, fontSize: 18, fontWeight: 700 })}>
                    <span style={{ color: c.accent }}>✦</span> Şefin Seçimi
                  </h3>
                  <span style={{ fontSize: 9.5, letterSpacing: "0.16em", color: c.faint }}>EL İLE DERLENDİ</span>
                </div>
                <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4 }}>
                  {featured.map((p) => (
                    <Link key={p.id} href={`/m/${slug}/urun/${p.id}`} style={{ ...cardStyle, width: 160, flex: "0 0 160px", padding: 11, textDecoration: "none", color: c.ink }}>
                      <ImgFrame src={p.imageUrl} t={t} h={102} />
                      <div style={display({ fontSize: 14, fontWeight: 700, marginTop: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" })}>{p.name}</div>
                      <div style={{ marginTop: 6 }}><span style={{ ...pricePill, fontSize: 13, display: "inline-block" }}>₺{p.price}</span></div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* SEARCH */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.surface, border: `1px solid ${c.line}`, borderRadius: t.radius >= 16 ? 999 : t.radius, padding: "11px 15px", marginBottom: 16 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Yemek, malzeme veya kategori ara…"
                style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13.5, color: c.ink, fontFamily: t.fonts.body }}
              />
            </div>

            {/* FILTER CHIPS */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {chipDefs.map((ch) => {
                const on = chips.has(ch.key);
                const base: CSSProperties = { fontSize: 12, borderRadius: 999, padding: "6px 14px", cursor: "pointer", border: `1px solid ${on || t.chipFilled ? c.accent : c.line}` };
                const style: CSSProperties = on
                  ? { ...base, background: c.accent, color: c.onAccent, fontWeight: 700 }
                  : t.chipFilled
                    ? { ...base, background: "transparent", color: c.accent, fontWeight: 600 }
                    : { ...base, background: c.surface, color: c.sub };
                return (
                  <button key={ch.key} type="button" onClick={() => toggleChip(ch.key)} style={style}>{ch.label}</button>
                );
              })}
            </div>

            {/* CATEGORY TABS */}
            <div style={{ display: "flex", gap: 18, marginBottom: 22, borderBottom: `1px solid ${c.line}`, overflowX: "auto" }}>
              {[{ id: "all", name: "Tümü" }, ...categories].map((cat) => {
                const on = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCat(cat.id)}
                    style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 13.5, paddingBottom: 11, whiteSpace: "nowrap", fontWeight: on ? 700 : 400, color: on ? c.accent : c.sub, borderBottom: on ? `2px solid ${c.accent}` : "2px solid transparent", marginBottom: -1, fontFamily: t.fonts.body }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* ITEMS */}
            <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.length === 0 ? (
                <p style={{ textAlign: "center", color: c.sub, fontSize: 13, padding: "32px 0" }}>Aramanıza uygun ürün bulunamadı.</p>
              ) : (
                filtered.map((p) => (
                  <Link key={p.id} href={`/m/${slug}/urun/${p.id}`} style={{ ...cardStyle, padding: 13, display: "flex", gap: 14, textDecoration: "none", color: c.ink }}>
                    <div style={{ flex: "0 0 78px" }}><ImgFrame src={p.imageUrl} t={t} h={78} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                        <span style={display({ fontSize: 15.5, fontWeight: 700, lineHeight: 1.15 })}>{p.name}</span>
                        <span style={{ ...pricePill, fontSize: 14, whiteSpace: "nowrap" }}>₺{p.price}</span>
                      </div>
                      {p.description && <p style={{ margin: "6px 0 0", fontSize: 12.5, lineHeight: 1.5, color: c.sub, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9, flexWrap: "wrap" }}>
                        {tags(p).map((tag) => (
                          <span key={tag} style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: c.accent, border: `1px solid ${c.line}`, borderRadius: 999, padding: "2px 8px" }}>{tag}</span>
                        ))}
                        {p.prepMinutes != null && <span style={{ fontSize: 11, color: c.faint, marginLeft: "auto" }}>{p.prepMinutes} dk</span>}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer style={{ textAlign: "center", padding: "44px 0 12px", marginTop: 14, borderTop: `1px solid ${c.line}` }}>
          <div style={display({ fontSize: 18, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 28 })}>{business.name}</div>
          {(business.address || business.openingHours || business.phone) && (
            <div style={{ fontSize: 12.5, color: c.sub, marginTop: 12, lineHeight: 1.9 }}>
              {business.address && <div>{business.address}</div>}
              {business.openingHours && <div>{business.openingHours}</div>}
              {business.phone && <div>{business.phone}</div>}
            </div>
          )}
          <p style={{ fontSize: 11.5, color: c.faint, margin: "18px auto 0", maxWidth: 290, lineHeight: 1.6 }}>
            Fiyatlara KDV dahildir. Alerjen bilgisi için lütfen servis ekibimize danışın.
          </p>
          <div style={{ fontSize: 9, letterSpacing: "0.24em", color: c.faint, marginTop: 18 }}>EAGLE QR İLE HAZIRLANMIŞTIR</div>
        </footer>
      </div>
    </div>
  );
}
