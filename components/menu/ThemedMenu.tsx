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

const PRODUCT_ICON = "M3 11h18M5 11V7a2 2 0 0 1 2-2h2M12 5v6M7 21h10a2 2 0 0 0 2-2v-8H5v8a2 2 0 0 0 2 2z";

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

  // ---- yardımcılar -------------------------------------------------------
  const imgRadius = (h: number): string =>
    t.imageShape === "arch"
      ? `${Math.round(h * 0.85)}px ${Math.round(h * 0.85)}px ${t.imageRadius || 8}px ${t.imageRadius || 8}px`
      : `${t.imageRadius}px`;

  const ImgFrame = ({ src, h, alt = "" }: { src: string | null; h: number; alt?: string }) => {
    const radius = imgRadius(h);
    if (src) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: h, objectFit: "cover", borderRadius: radius, display: "block" }} />;
    }
    return (
      <div style={{ width: "100%", height: h, borderRadius: radius, background: c.surface2, display: "flex", alignItems: "center", justifyContent: "center", color: c.faint }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={PRODUCT_ICON} /></svg>
      </div>
    );
  };

  const display = (extra: CSSProperties = {}): CSSProperties => ({
    fontFamily: t.fonts.display,
    textTransform: t.uppercase ? "uppercase" : "none",
    ...extra,
  });

  const priceStyle: CSSProperties =
    t.priceStyle === "boxed"
      ? { background: c.accent, color: c.onAccent, padding: "2px 8px", fontWeight: 700, borderRadius: t.radius === 0 ? 0 : 4 }
      : t.priceStyle === "pill"
        ? { background: c.accent, color: c.onAccent, padding: "3px 11px", borderRadius: 999, fontWeight: 700 }
        : { color: c.accent, fontWeight: 700 };

  const cardStyle: CSSProperties = { background: c.surface, border: t.cardBorder, borderRadius: t.radius, boxShadow: t.cardShadow };
  const tagPill = (tag: string) => (
    <span key={tag} style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: c.accent, border: `1px solid ${c.line}`, borderRadius: 999, padding: "2px 8px" }}>{tag}</span>
  );
  const itemTags = (p: MenuProduct) =>
    [p.isFeatured && "Şefin Seçimi", p.isPopular && "Popüler", p.isNew && "Yeni"].filter(Boolean) as string[];

  const Price = ({ p }: { p: MenuProduct }) => <span style={{ ...priceStyle, fontSize: 14, whiteSpace: "nowrap" }}>₺{p.price}</span>;

  // ---- HERO --------------------------------------------------------------
  function Hero() {
    if (!business.coverUrl && !business.heroTitle) return null;
    const overline = business.heroOverline;
    const title = business.heroTitle;
    const desc = business.heroSubtitle;

    const TextBlock = ({ onDark }: { onDark?: boolean }) => (
      <>
        {overline && <div style={{ fontSize: 10, letterSpacing: "0.34em", fontWeight: 600, color: onDark ? "rgba(255,255,255,0.82)" : c.accent }}>{overline}</div>}
        {title && <h2 style={display({ margin: "8px 0 8px", fontSize: 26, lineHeight: 1.1, fontWeight: 700, fontStyle: t.headingSerif ? "italic" : "normal", color: onDark ? "#fff" : c.ink })}>{title}</h2>}
        {desc && <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: onDark ? "rgba(255,255,255,0.85)" : c.sub, maxWidth: 460 }}>{desc}</p>}
      </>
    );

    // overlay: görsel + koyu scrim + üstte yazı
    if (t.heroStyle === "overlay" && business.coverUrl) {
      return (
        <section style={{ position: "relative", overflow: "hidden", borderRadius: imgRadius(210), marginBottom: 34 }}>
          <ImgFrame src={business.coverUrl} h={210} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.72) 100%)" }} />
          <div style={{ position: "absolute", left: 20, right: 20, bottom: 20 }}><TextBlock onDark /></div>
        </section>
      );
    }
    // card: renkli vurgu kart, görsel üstte, yazı altta (Pop)
    if (t.heroStyle === "card") {
      return (
        <section style={{ background: c.accent, borderRadius: t.radius, border: t.cardBorder, boxShadow: t.cardShadow, padding: 16, marginBottom: 34 }}>
          {business.coverUrl && <ImgFrame src={business.coverUrl} h={150} />}
          <div style={{ paddingTop: business.coverUrl ? 14 : 0, color: c.onAccent }}>
            {overline && <div style={{ fontSize: 10, letterSpacing: "0.2em", fontWeight: 700, opacity: 0.85 }}>{overline}</div>}
            {title && <h2 style={display({ margin: "8px 0 8px", fontSize: 24, lineHeight: 1.05, fontWeight: 800, color: c.onAccent })}>{title}</h2>}
            {desc && <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: c.onAccent, opacity: 0.92 }}>{desc}</p>}
          </div>
        </section>
      );
    }
    // framed: çerçeveli kutu, görsel üstte, yazı altta (Brutalist)
    if (t.heroStyle === "framed") {
      return (
        <section style={{ border: t.cardBorder, boxShadow: t.cardShadow, background: c.surface, marginBottom: 34 }}>
          {business.coverUrl && <ImgFrame src={business.coverUrl} h={140} />}
          <div style={{ padding: 16 }}><TextBlock /></div>
        </section>
      );
    }
    // below (varsayılan): görsel + altında yazı
    return (
      <section style={{ marginBottom: 34 }}>
        {business.coverUrl && <ImgFrame src={business.coverUrl} h={200} />}
        <div style={{ marginTop: business.coverUrl ? 16 : 0 }}><TextBlock /></div>
      </section>
    );
  }

  // ---- TABS --------------------------------------------------------------
  function Tabs() {
    const cats = [{ id: "all", name: "Tümü" }, ...categories];
    if (t.tabStyle === "pill") {
      return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {cats.map((cat) => {
            const on = activeCat === cat.id;
            return <button key={cat.id} type="button" onClick={() => setActiveCat(cat.id)} style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, padding: "8px 15px", borderRadius: 999, border: `1px solid ${on ? c.accent : c.line}`, background: on ? c.accent : "transparent", color: on ? c.onAccent : c.sub, fontFamily: t.fonts.body }}>{cat.name}</button>;
          })}
        </div>
      );
    }
    if (t.tabStyle === "segmented") {
      return (
        <div style={{ display: "flex", marginBottom: 24, border: t.cardBorder, overflow: "hidden", flexWrap: "wrap" }}>
          {cats.map((cat, i) => {
            const on = activeCat === cat.id;
            return <button key={cat.id} type="button" onClick={() => setActiveCat(cat.id)} style={{ cursor: "pointer", fontFamily: t.fonts.body, fontSize: 11, textTransform: "uppercase", fontWeight: 700, padding: "8px 11px", whiteSpace: "nowrap", borderLeft: i > 0 ? `2px solid ${c.ink}` : "none", background: on ? c.ink : "transparent", color: on ? "#fff" : c.ink }}>{cat.name}</button>;
          })}
        </div>
      );
    }
    // underline
    return (
      <div style={{ display: "flex", gap: 18, marginBottom: 22, borderBottom: `1px solid ${c.line}`, overflowX: "auto" }}>
        {cats.map((cat) => {
          const on = activeCat === cat.id;
          return <button key={cat.id} type="button" onClick={() => setActiveCat(cat.id)} style={{ cursor: "pointer", background: "transparent", border: "none", fontFamily: t.headingSerif ? t.fonts.display : t.fonts.body, fontSize: t.headingSerif ? 15.5 : 13.5, paddingBottom: 11, whiteSpace: "nowrap", fontWeight: on ? 700 : 400, color: on ? c.accent : c.sub, borderBottom: on ? `2px solid ${c.accent}` : "2px solid transparent", marginBottom: -1 }}>{cat.name}</button>;
        })}
      </div>
    );
  }

  // ---- ITEM (tek ürün) ---------------------------------------------------
  function Item({ p, index, last }: { p: MenuProduct; index: number; last: boolean }) {
    const href = `/m/${slug}/urun/${p.id}`;
    const nameStyle = display({ fontSize: t.itemStyle === "list-plain" ? 20 : 15.5, fontWeight: 700, lineHeight: 1.15 });

    if (t.itemStyle === "list-plain") {
      // à la carte: ad ...... fiyat
      return (
        <Link href={href} style={{ display: "block", padding: "18px 0", borderBottom: last ? "none" : `1px solid ${c.line}`, textDecoration: "none", color: c.ink }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={nameStyle}>{p.name}</span>
            <span style={{ flex: 1, borderBottom: `1px dotted ${c.line}`, margin: "0 4px", transform: "translateY(-5px)" }} />
            <span style={{ ...priceStyle, fontSize: 18, whiteSpace: "nowrap" }}>₺{p.price}</span>
          </div>
          {p.description && <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.6, color: c.sub }}>{p.description}</p>}
        </Link>
      );
    }

    if (t.itemStyle === "list-number") {
      return (
        <Link href={href} style={{ display: "flex", gap: 14, padding: "16px 2px", borderBottom: `${t.cardBorder.startsWith("2") ? "2px" : "1px"} solid ${c.line}`, textDecoration: "none", color: c.ink }}>
          <div style={{ flex: "0 0 26px", fontFamily: t.fonts.display, fontSize: 20, color: c.accent, lineHeight: 1, paddingTop: 2 }}>{String(index + 1).padStart(2, "0")}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <span style={display({ fontSize: 18, fontWeight: 800, lineHeight: 1.05 })}>{p.name}</span>
              <Price p={p} />
            </div>
            {p.description && <p style={{ margin: "7px 0 0", fontSize: 12, lineHeight: 1.55, color: c.sub }}>{p.description}</p>}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9, flexWrap: "wrap" }}>
              {itemTags(p).map(tagPill)}
              {p.prepMinutes != null && <span style={{ fontSize: 11, color: c.faint, marginLeft: "auto" }}>{p.prepMinutes} dk</span>}
            </div>
          </div>
        </Link>
      );
    }

    // card & list-thumb (thumbnail + içerik)
    const wrapperStyle: CSSProperties =
      t.itemStyle === "card"
        ? { ...cardStyle, padding: 13, display: "flex", gap: 14, textDecoration: "none", color: c.ink }
        : { display: "flex", gap: 14, padding: "18px 0", borderBottom: last ? "none" : `1px solid ${c.line}`, textDecoration: "none", color: c.ink };
    return (
      <Link href={href} style={wrapperStyle}>
        <div style={{ flex: "0 0 78px" }}><ImgFrame src={p.imageUrl} h={78} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
            <span style={nameStyle}>{p.name}</span>
            <Price p={p} />
          </div>
          {p.description && <p style={{ margin: "6px 0 0", fontSize: 12.5, lineHeight: 1.5, color: c.sub, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9, flexWrap: "wrap" }}>
            {itemTags(p).map(tagPill)}
            {p.prepMinutes != null && <span style={{ fontSize: 11, color: c.faint, marginLeft: "auto" }}>{p.prepMinutes} dk</span>}
          </div>
        </div>
      </Link>
    );
  }

  const itemsWrap: CSSProperties =
    t.itemStyle === "card" ? { display: "flex", flexDirection: "column", gap: 12 } : {};

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
          <h1 style={display({ margin: "12px 0 6px", fontSize: 30, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" })}>{business.name}</h1>
          {branchName && <div style={{ fontSize: 14, color: c.accent, fontWeight: 600 }}>{branchName}</div>}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 12, fontSize: 11.5, color: c.sub, border: `1px solid ${c.line}`, borderRadius: 999, padding: "5px 13px" }}>
            <span style={{ width: 6, height: 6, borderRadius: 5, background: "#22c55e" }} />Açık
          </div>
        </header>

        <Hero />

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
                  <h3 style={display({ margin: 0, fontSize: 18, fontWeight: 700 })}><span style={{ color: c.accent }}>✦</span> Şefin Seçimi</h3>
                  <span style={{ fontSize: 9.5, letterSpacing: "0.16em", color: c.faint }}>EL İLE DERLENDİ</span>
                </div>
                <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4 }}>
                  {featured.map((p) => (
                    <Link key={p.id} href={`/m/${slug}/urun/${p.id}`} style={{ width: 160, flex: "0 0 160px", textDecoration: "none", color: c.ink, ...(t.chefCard ? { ...cardStyle, padding: 11 } : {}) }}>
                      <ImgFrame src={p.imageUrl} h={108} />
                      <div style={display({ fontSize: 14, fontWeight: 700, marginTop: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" })}>{p.name}</div>
                      <div style={{ marginTop: 6 }}><span style={{ ...priceStyle, fontSize: 13, display: "inline-block" }}>₺{p.price}</span></div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* SEARCH */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.surface, border: `1px solid ${c.line}`, borderRadius: t.radius >= 14 ? 999 : t.radius, padding: "11px 15px", marginBottom: 16 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Yemek, malzeme veya kategori ara…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13.5, color: c.ink, fontFamily: t.fonts.body }} />
            </div>

            {/* FILTER CHIPS */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {chipDefs.map((ch) => {
                const on = chips.has(ch.key);
                const style: CSSProperties = on
                  ? { background: c.accent, color: c.onAccent, fontWeight: 700, border: `1px solid ${c.accent}` }
                  : t.chipFilled
                    ? { background: "transparent", color: c.accent, fontWeight: 600, border: `1px solid ${c.accent}` }
                    : { background: c.surface, color: c.sub, border: `1px solid ${c.line}` };
                return <button key={ch.key} type="button" onClick={() => toggleChip(ch.key)} style={{ ...style, cursor: "pointer", fontSize: 12, borderRadius: 999, padding: "6px 14px" }}>{ch.label}</button>;
              })}
            </div>

            <Tabs />

            {/* ITEMS */}
            <section style={itemsWrap}>
              {filtered.length === 0 ? (
                <p style={{ textAlign: "center", color: c.sub, fontSize: 13, padding: "32px 0" }}>Aramanıza uygun ürün bulunamadı.</p>
              ) : (
                filtered.map((p, i) => <Item key={p.id} p={p} index={i} last={i === filtered.length - 1} />)
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
          <p style={{ fontSize: 11.5, color: c.faint, margin: "18px auto 0", maxWidth: 290, lineHeight: 1.6 }}>Fiyatlara KDV dahildir. Alerjen bilgisi için lütfen servis ekibimize danışın.</p>
          <div style={{ fontSize: 9, letterSpacing: "0.24em", color: c.faint, marginTop: 18 }}>EAGLE QR İLE HAZIRLANMIŞTIR</div>
        </footer>
      </div>
    </div>
  );
}
