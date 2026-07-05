"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import type { ThemeSpec } from "@/lib/themes";
import type { MenuProduct } from "@/components/menu/MenuBrowser";
import TrackView from "@/components/menu/TrackView";
import ScrollFadeRow from "@/components/menu/ScrollFadeRow";
import { useAllergenFilter } from "@/lib/use-allergen-filter";
import { useMenuLang } from "@/lib/use-menu-lang";
import { allergenLabel } from "@/lib/allergen-i18n";
import { formatPrice, type CurrencySpec } from "@/lib/currency";
import { fillTemplate, type UiStrings } from "@/lib/ui-strings";

export type MenuLang = { code: string; label: string; nativeLabel: string; rtl: boolean };
type CatItem = {
  id: string;
  name: string;
  translations?: Record<string, { name?: string; description?: string }>;
  description?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
};

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
  mapUrl: string | null;
  socialLinks: Record<string, string>;
};

type Chip = "featured" | "new" | "popular";
const chipDefs: { key: Chip; label: string }[] = [
  { key: "featured", label: "Şefin Seçimi" },
  { key: "popular", label: "Popüler" },
  { key: "new", label: "Yeni" },
];

const PRODUCT_ICON = "M3 11h18M5 11V7a2 2 0 0 1 2-2h2M12 5v6M7 21h10a2 2 0 0 0 2-2v-8H5v8a2 2 0 0 0 2 2z";

const SOCIAL_ORDER = ["instagram", "tiktok", "facebook", "x", "youtube", "website"];
const SOCIAL_ICONS: Record<string, ReactNode> = {
  instagram: (<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></>),
  facebook: (<path d="M15 3h-2a4 4 0 0 0-4 4v3H6v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" fill="currentColor" stroke="none" />),
  youtube: (<><rect x="2" y="6" width="20" height="12" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>),
  x: (<path d="M4 4l16 16M20 4 4 20" />),
  tiktok: (<path d="M9 19a3 3 0 1 0 3-3V4c1 2.2 3 3 5 3" />),
  website: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" /></>),
};

export default function ThemedMenu({
  theme: t,
  business,
  slug,
  menuId,
  branchName,
  products,
  categories,
  languages = [],
  currency,
  ui = {},
  ratingsEnabled = true,
}: {
  theme: ThemeSpec;
  business: ThemedBusiness;
  slug: string;
  menuId?: string;
  branchName?: string;
  products: MenuProduct[];
  categories: CatItem[];
  languages?: MenuLang[];
  currency: CurrencySpec;
  ui?: Record<string, UiStrings>;
  ratingsEnabled?: boolean;
}) {
  const c = t.colors;
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(categories[0]?.id ?? "");
  const [chips, setChips] = useState<Set<Chip>>(new Set());
  const { lang, setLang, ready: langReady } = useMenuLang();

  // Kullanılabilir diller: TR (temel) + bu menüde çevirisi olan açık diller
  const availableLangs = useMemo<MenuLang[]>(() => {
    const base: MenuLang = { code: "tr", label: "Türkçe", nativeLabel: "Türkçe", rtl: false };
    const has = (code: string) =>
      products.some((p) => p.translations?.[code]?.name) ||
      categories.some((cat) => cat.translations?.[code]?.name);
    return [base, ...languages.filter((l) => has(l.code))];
  }, [languages, products, categories]);

  // Seçili dil kullanılabilir değilse TR'ye düş
  const activeLang = langReady && availableLangs.some((l) => l.code === lang) ? lang : "tr";
  const isRtl = availableLangs.find((l) => l.code === activeLang)?.rtl ?? false;

  // çeviri yardımcıları (yoksa TR'ye düşer)
  const nm = (p: MenuProduct) => (activeLang !== "tr" && p.translations?.[activeLang]?.name) || p.name;
  const ds = (p: MenuProduct) => (activeLang !== "tr" && p.translations?.[activeLang]?.description) || p.description;
  const cn = (cat: CatItem) => (activeLang !== "tr" && cat.translations?.[activeLang]?.name) || cat.name;
  const al = (code: string, trLabel: string) => allergenLabel(code, activeLang, trLabel);
  const T = (key: string) => ui[activeLang]?.[key] ?? ui["tr"]?.[key] ?? key;

  const catName = (cat: CatItem) => cn(cat);
  const { selected: allerSel, toggle: toggleAller, clear: clearAller, ready: allerReady } = useAllergenFilter();
  const [allerOpen, setAllerOpen] = useState(false);

  // Bu menüde geçen alerjenler (boş olanları gösterme)
  const menuAllergens = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) for (const a of p.allergens) map.set(a.code, a.label);
    return [...map].map(([code, label]) => ({ code, label })).sort((x, y) => x.label.localeCompare(y.label, "tr"));
  }, [products]);

  // Ürünün, müşterinin kaçındığı alerjenlerden hangilerini içerdiği
  const conflicts = (p: MenuProduct): string[] =>
    allerReady && allerSel.length
      ? p.allergens.filter((a) => allerSel.includes(a.code)).map((a) => al(a.code, a.label))
      : [];
  const activeAllerCount = allerReady ? allerSel.length : 0;

  const featured = products.filter((p) => p.isFeatured).slice(0, 6);
  const deals = products.filter((p) => p.campaign);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return products.filter((p) => {
      // Arama tüm menüde çalışır; arama yokken seçili kategori gösterilir
      if (!q && p.categoryId !== activeCat) return false;
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
    [p.isFeatured && T("chefPick"), p.isPopular && T("popular"), p.isNew && T("isNew")].filter(Boolean) as string[];

  // kampanya etiketi (aktif dile göre)
  const campLabel = (p: MenuProduct) =>
    p.campaign ? (activeLang !== "tr" && p.campaign.translations?.[activeLang]) || p.campaign.label : "";
  const campaignBadge = (p: MenuProduct) =>
    p.campaign ? (
      <span style={{ display: "inline-block", background: p.campaign.color, color: "#fff", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.04em", borderRadius: 999, padding: "2px 9px" }}>
        {campLabel(p)}
      </span>
    ) : null;
  const soldOutBadge = (p: MenuProduct) =>
    p.isSoldOut ? (
      <span style={{ display: "inline-block", background: c.ink, color: c.bg, fontSize: 9.5, fontWeight: 800, letterSpacing: "0.04em", borderRadius: 999, padding: "2px 9px" }}>
        {T("soldOut")}
      </span>
    ) : null;
  // "Bugün Popüler" — günlük görüntülenmeye göre otomatik (gece yarısı sıfırlanır)
  const trendBadge = (p: MenuProduct) =>
    p.trendToday ? (
      <span style={{ display: "inline-block", background: c.accent, color: c.onAccent, fontSize: 9.5, fontWeight: 800, letterSpacing: "0.04em", borderRadius: 999, padding: "2px 9px" }}>
        🔥 {T("trendingToday")}
      </span>
    ) : null;
  // kampanya + tükendi + trend rozet satırı (varsa)
  const topBadges = (p: MenuProduct, mt = 0) =>
    p.campaign || p.isSoldOut || p.trendToday ? (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6, marginTop: mt }}>
        {trendBadge(p)}
        {campaignBadge(p)}
        {soldOutBadge(p)}
      </div>
    ) : null;

  // fiyat (kampanya indirimi varsa eski fiyat üstü çizili)
  const PriceTag = ({ p, size = 14 }: { p: MenuProduct; size?: number }) => {
    const sale = p.campaign && p.campaignPrice;
    const main = (
      <span style={{ ...priceStyle, fontSize: size, whiteSpace: "nowrap" }}>
        {formatPrice(sale ? p.campaignPrice! : p.price, currency)}
      </span>
    );
    if (!sale) return main;
    return (
      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: size - 3, color: c.faint, textDecoration: "line-through", whiteSpace: "nowrap" }}>
          {formatPrice(p.price, currency)}
        </span>
        {main}
      </span>
    );
  };
  const Price = ({ p }: { p: MenuProduct }) => <PriceTag p={p} size={14} />;

  // video / AR işareti — ürün adının yanına küçük rozet
  const mediaMark = (p: MenuProduct) =>
    p.hasVideo || p.hasAr ? (
      <span style={{ display: "inline-flex", gap: 4, marginLeft: 6, verticalAlign: "middle" }}>
        {p.hasVideo && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", color: c.accent, border: `1px solid ${c.line}`, borderRadius: 4, padding: "1px 4px" }}>▶ VIDEO</span>}
        {p.hasAr && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", color: c.accent, border: `1px solid ${c.line}`, borderRadius: 4, padding: "1px 4px" }}>AR</span>}
      </span>
    ) : null;

  // yıldız ortalaması rozeti (oy varsa ve işletme açtıysa)
  const ratingMark = (p: MenuProduct) =>
    ratingsEnabled && p.rating.count > 0 ? (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: c.accent }}>
        ★ {p.rating.avg.toFixed(1)}
        <span style={{ color: c.faint, fontWeight: 500 }}>({p.rating.count})</span>
      </span>
    ) : null;

  // alerjen uyarı rozeti — müşterinin seçtiği alerjeni içeren ürünlerde
  const warnBadge = (labels: string[]) =>
    labels.length ? (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "#e0524a", background: "rgba(224,82,74,0.13)", border: "1px solid rgba(224,82,74,0.34)", borderRadius: 999, padding: "2px 9px", marginTop: 8 }}>
        ⚠ {fillTemplate(T("containsTemplate"), labels.join(", "))}
      </span>
    ) : null;

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
    const cats: CatItem[] = categories;
    if (t.tabStyle === "pill") {
      return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
          {cats.map((cat) => {
            const on = activeCat === cat.id;
            return <button key={cat.id} type="button" onClick={() => setActiveCat(cat.id)} style={{ cursor: "pointer", fontSize: 13, fontWeight: 700, padding: "8px 15px", borderRadius: 999, border: `1px solid ${on ? c.accent : c.line}`, background: on ? c.accent : "transparent", color: on ? c.onAccent : c.sub, fontFamily: t.fonts.body }}>{catName(cat)}</button>;
          })}
        </div>
      );
    }
    if (t.tabStyle === "segmented") {
      return (
        <div style={{ display: "flex", marginBottom: 24, border: t.cardBorder, overflow: "hidden", flexWrap: "wrap" }}>
          {cats.map((cat, i) => {
            const on = activeCat === cat.id;
            return <button key={cat.id} type="button" onClick={() => setActiveCat(cat.id)} style={{ cursor: "pointer", fontFamily: t.fonts.body, fontSize: 11, textTransform: "uppercase", fontWeight: 700, padding: "8px 11px", whiteSpace: "nowrap", borderLeft: i > 0 ? `2px solid ${c.ink}` : "none", background: on ? c.ink : "transparent", color: on ? "#fff" : c.ink }}>{catName(cat)}</button>;
          })}
        </div>
      );
    }
    // underline
    return (
      <ScrollFadeRow style={{ display: "flex", gap: 18, marginBottom: 22, borderBottom: `1px solid ${c.line}` }}>
        {cats.map((cat) => {
          const on = activeCat === cat.id;
          return <button key={cat.id} type="button" onClick={() => setActiveCat(cat.id)} style={{ cursor: "pointer", background: "transparent", border: "none", fontFamily: t.headingSerif ? t.fonts.display : t.fonts.body, fontSize: t.headingSerif ? 15.5 : 13.5, paddingBottom: 11, whiteSpace: "nowrap", fontWeight: on ? 700 : 400, color: on ? c.accent : c.sub, borderBottom: on ? `2px solid ${c.accent}` : "2px solid transparent", marginBottom: -1 }}>{catName(cat)}</button>;
        })}
      </ScrollFadeRow>
    );
  }

  // ---- KATEGORİ BAŞLIK KARTI (seçili kategorinin medyası/açıklaması varsa) ----
  function CategoryCard() {
    const cat = categories.find((x) => x.id === activeCat);
    if (!cat) return null;
    const hasMedia = !!(cat.videoUrl || cat.imageUrl);
    const desc = (activeLang !== "tr" && cat.translations?.[activeLang]?.description) || cat.description;
    if (!hasMedia && !desc) return null;
    const title = catName(cat);

    // sadece açıklama (medya yok) — düz kart
    if (!hasMedia) {
      return (
        <section style={{ ...cardStyle, padding: 16, marginBottom: 22 }}>
          <h3 style={display({ margin: 0, fontSize: 18, fontWeight: 700 })}>{title}</h3>
          {desc && <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.55, color: c.sub }}>{desc}</p>}
        </section>
      );
    }

    const h = 168;
    return (
      <section style={{ position: "relative", overflow: "hidden", borderRadius: imgRadius(h), marginBottom: 22, border: t.cardBorder, boxShadow: t.cardShadow }}>
        {cat.videoUrl ? (
          <video src={cat.videoUrl} poster={cat.imageUrl ?? undefined} autoPlay muted loop playsInline style={{ width: "100%", height: h, objectFit: "cover", display: "block" }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cat.imageUrl!} alt="" loading="lazy" style={{ width: "100%", height: h, objectFit: "cover", display: "block" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.74) 100%)" }} />
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 16 }}>
          <h3 style={display({ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.1 })}>{title}</h3>
          {desc && <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.9)" }}>{desc}</p>}
        </div>
      </section>
    );
  }

  // ---- ITEM (tek ürün) ---------------------------------------------------
  function Item({ p, index, last }: { p: MenuProduct; index: number; last: boolean }) {
    const href = `/m/${slug}/urun/${p.id}`;
    const nameStyle = display({ fontSize: t.itemStyle === "list-plain" ? 20 : 15.5, fontWeight: 700, lineHeight: 1.15 });
    const conf = conflicts(p);
    const dim: CSSProperties = conf.length || p.isSoldOut ? { opacity: 0.5 } : {};

    if (t.itemStyle === "list-plain") {
      // à la carte: ad ...... fiyat
      return (
        <Link href={href} style={{ display: "block", padding: "18px 0", borderBottom: last ? "none" : `1px solid ${c.line}`, textDecoration: "none", color: c.ink, ...dim }}>
          {topBadges(p)}
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={nameStyle}>{nm(p)}{mediaMark(p)}</span>
            <span style={{ flex: 1, borderBottom: `1px dotted ${c.line}`, margin: "0 4px", transform: "translateY(-5px)" }} />
            <PriceTag p={p} size={18} />
          </div>
          {p.description && <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.6, color: c.sub }}>{ds(p)}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>{ratingMark(p)}{warnBadge(conf)}</div>
        </Link>
      );
    }

    if (t.itemStyle === "list-number") {
      return (
        <Link href={href} style={{ display: "flex", gap: 14, padding: "16px 2px", borderBottom: `${t.cardBorder.startsWith("2") ? "2px" : "1px"} solid ${c.line}`, textDecoration: "none", color: c.ink, ...dim }}>
          <div style={{ flex: "0 0 26px", fontFamily: t.fonts.display, fontSize: 20, color: c.accent, lineHeight: 1, paddingTop: 2 }}>{String(index + 1).padStart(2, "0")}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {topBadges(p)}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <span style={display({ fontSize: 18, fontWeight: 800, lineHeight: 1.05 })}>{nm(p)}{mediaMark(p)}</span>
              <Price p={p} />
            </div>
            {p.description && <p style={{ margin: "7px 0 0", fontSize: 12, lineHeight: 1.55, color: c.sub }}>{ds(p)}</p>}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9, flexWrap: "wrap" }}>
              {itemTags(p).map(tagPill)}
              {ratingMark(p)}
              {warnBadge(conf)}
              {p.weight && <span style={{ fontSize: 11, color: c.faint }}>{p.weight}</span>}
            {p.portion && <span style={{ fontSize: 11, color: c.faint }}>{p.portion}</span>}
            {p.prepMinutes != null && <span style={{ fontSize: 11, color: c.faint, marginLeft: "auto" }}>{p.prepMinutes} dk</span>}
            </div>
          </div>
        </Link>
      );
    }

    // card & list-thumb (thumbnail + içerik)
    const wrapperStyle: CSSProperties =
      t.itemStyle === "card"
        ? { ...cardStyle, padding: 13, display: "flex", gap: 14, textDecoration: "none", color: c.ink, ...dim }
        : { display: "flex", gap: 14, padding: "18px 0", borderBottom: last ? "none" : `1px solid ${c.line}`, textDecoration: "none", color: c.ink, ...dim };
    return (
      <Link href={href} style={wrapperStyle}>
        <div style={{ flex: "0 0 78px" }}><ImgFrame src={p.imageUrl} h={78} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {topBadges(p)}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
            <span style={nameStyle}>{nm(p)}{mediaMark(p)}</span>
            <Price p={p} />
          </div>
          {p.description && <p style={{ margin: "6px 0 0", fontSize: 12.5, lineHeight: 1.5, color: c.sub, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{ds(p)}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9, flexWrap: "wrap" }}>
            {itemTags(p).map(tagPill)}
            {ratingMark(p)}
            {warnBadge(conf)}
            {p.weight && <span style={{ fontSize: 11, color: c.faint }}>{p.weight}</span>}
            {p.portion && <span style={{ fontSize: 11, color: c.faint }}>{p.portion}</span>}
            {p.prepMinutes != null && <span style={{ fontSize: 11, color: c.faint, marginLeft: "auto" }}>{p.prepMinutes} dk</span>}
          </div>
        </div>
      </Link>
    );
  }

  const itemsWrap: CSSProperties =
    t.itemStyle === "card" ? { display: "flex", flexDirection: "column", gap: 12 } : {};

  return (
    <div dir={isRtl ? "rtl" : "ltr"} style={{ minHeight: "100dvh", background: c.bg, color: c.ink, fontFamily: t.fonts.body }}>
      <TrackView businessId={business.id} type="SCAN" menuId={menuId} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 48px" }}>
        {/* DİL SEÇİCİ */}
        {availableLangs.length > 1 && (
          <div dir="ltr" style={{ display: "flex", justifyContent: "flex-end", gap: 6, paddingTop: 14, flexWrap: "wrap" }}>
            {availableLangs.map((l) => {
              const on = activeLang === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  style={{ cursor: "pointer", fontSize: 11.5, fontWeight: on ? 700 : 500, fontFamily: t.fonts.body, textTransform: "uppercase", letterSpacing: "0.05em", color: on ? c.onAccent : c.sub, background: on ? c.accent : "transparent", border: `1px solid ${on ? c.accent : c.line}`, borderRadius: 999, padding: "4px 10px" }}
                  title={l.label}
                >
                  {l.code}
                </button>
              );
            })}
          </div>
        )}

        {/* HEADER */}
        <header style={{ textAlign: "center", padding: "36px 0 28px" }}>
          {business.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.logoUrl} alt="" style={{ width: 56, height: 56, borderRadius: 999, objectFit: "cover", margin: "0 auto 14px", display: "block", border: `1px solid ${c.line}` }} />
          )}
          <div style={{ fontSize: 10, letterSpacing: "0.4em", color: c.accent, fontWeight: 600 }}>{T("digitalMenu")}</div>
          <h1 style={display({ margin: "12px 0 6px", fontSize: 30, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" })}>{business.name}</h1>
          {branchName && <div style={{ fontSize: 14, color: c.accent, fontWeight: 600 }}>{branchName}</div>}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 12, fontSize: 11.5, color: c.sub, border: `1px solid ${c.line}`, borderRadius: 999, padding: "5px 13px" }}>
            <span style={{ width: 6, height: 6, borderRadius: 5, background: "#22c55e" }} />{T("open")}
          </div>
        </header>

        <Hero />

        {products.length === 0 ? (
          <div style={{ ...cardStyle, padding: 40, textAlign: "center" }}>
            <p style={display({ fontSize: 18, fontWeight: 700, margin: 0 })}>{T("menuPreparing")}</p>
            <p style={{ fontSize: 13, color: c.sub, marginTop: 6 }}>Bu menü henüz yayınlanmadı.</p>
          </div>
        ) : (
          <>
            {/* FIRSATLAR (kampanya) */}
            {deals.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <h3 style={display({ margin: "0 0 16px", fontSize: 18, fontWeight: 700 })}>🔥 {T("deals")}</h3>
                <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4 }}>
                  {deals.map((p) => (
                    <Link key={p.id} href={`/m/${slug}/urun/${p.id}`} style={{ width: 170, flex: "0 0 170px", textDecoration: "none", color: c.ink, position: "relative", ...(t.chefCard ? { ...cardStyle, padding: 11 } : {}) }}>
                      <div style={{ position: "relative" }}>
                        <ImgFrame src={p.imageUrl} h={108} />
                        <div style={{ position: "absolute", top: 8, left: 8 }}>{campaignBadge(p)}</div>
                      </div>
                      <div style={display({ fontSize: 14, fontWeight: 700, marginTop: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" })}>{nm(p)}</div>
                      <div style={{ marginTop: 6 }}><PriceTag p={p} size={13} /></div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CHEF PICKS */}
            {featured.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={display({ margin: 0, fontSize: 18, fontWeight: 700 })}><span style={{ color: c.accent }}>✦</span> {T("chefPick")}</h3>
                  <span style={{ fontSize: 9.5, letterSpacing: "0.16em", color: c.faint }}>{T("curatedByHand")}</span>
                </div>
                <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4 }}>
                  {featured.map((p) => {
                    const conf = conflicts(p);
                    return (
                    <Link key={p.id} href={`/m/${slug}/urun/${p.id}`} style={{ width: 160, flex: "0 0 160px", textDecoration: "none", color: c.ink, ...(conf.length || p.isSoldOut ? { opacity: 0.5 } : {}), ...(t.chefCard ? { ...cardStyle, padding: 11 } : {}) }}>
                      <ImgFrame src={p.imageUrl} h={108} />
                      {topBadges(p, 8)}
                      <div style={display({ fontSize: 14, fontWeight: 700, marginTop: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" })}>{nm(p)}</div>
                      {conf.length > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: "#e0524a", marginTop: 4 }}>⚠ {conf.join(", ")}</div>}
                      <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}><PriceTag p={p} size={13} />{ratingMark(p)}</div>
                    </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SEARCH */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: c.surface, border: `1px solid ${c.line}`, borderRadius: t.radius >= 14 ? 999 : t.radius, padding: "11px 15px", marginBottom: 16 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c.accent} strokeWidth="2" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={T("searchPlaceholder")} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13.5, color: c.ink, fontFamily: t.fonts.body }} />
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
                return <button key={ch.key} type="button" onClick={() => toggleChip(ch.key)} style={{ ...style, cursor: "pointer", fontSize: 12, borderRadius: 999, padding: "6px 14px" }}>{T(ch.key === "featured" ? "chefPick" : ch.key === "popular" ? "popular" : "isNew")}</button>;
              })}
            </div>

            {/* ALERJEN FİLTRESİ */}
            {menuAllergens.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <button
                  type="button"
                  onClick={() => setAllerOpen((v) => !v)}
                  style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, fontFamily: t.fonts.body, color: activeAllerCount ? c.onAccent : c.sub, background: activeAllerCount ? c.accent : c.surface, border: `1px solid ${activeAllerCount ? c.accent : c.line}`, borderRadius: 999, padding: "8px 15px" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 4h18M6 9h12M10 14h4M11 19h2" /></svg>
                  {T("allergenFilter")}{activeAllerCount ? ` · ${activeAllerCount}` : ""}
                  <span style={{ transform: allerOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
                </button>

                {allerOpen && (
                  <div style={{ marginTop: 12, background: c.surface, border: `1px solid ${c.line}`, borderRadius: t.radius === 0 ? 0 : 14, padding: 14 }}>
                    <p style={{ margin: "0 0 10px", fontSize: 12, color: c.sub, lineHeight: 1.5 }}>
                      {T("allergenPanelHint")}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {menuAllergens.map((a) => {
                        const on = allerSel.includes(a.code);
                        return (
                          <button
                            key={a.code}
                            type="button"
                            onClick={() => toggleAller(a.code)}
                            style={{ cursor: "pointer", fontSize: 12, fontWeight: on ? 700 : 500, fontFamily: t.fonts.body, color: on ? "#fff" : c.ink, background: on ? "#e0524a" : "transparent", border: `1px solid ${on ? "#e0524a" : c.line}`, borderRadius: 999, padding: "6px 13px" }}
                          >
                            {on ? "⚠ " : ""}{al(a.code, a.label)}
                          </button>
                        );
                      })}
                    </div>
                    {activeAllerCount > 0 && (
                      <button type="button" onClick={clearAller} style={{ cursor: "pointer", marginTop: 12, fontSize: 11.5, fontWeight: 600, color: c.sub, background: "transparent", border: "none", textDecoration: "underline" }}>
                        {T("clearFilter")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <Tabs />

            <CategoryCard />

            {/* ITEMS */}
            <section style={itemsWrap}>
              {filtered.length === 0 ? (
                <p style={{ textAlign: "center", color: c.sub, fontSize: 13, padding: "32px 0" }}>{T("noResults")}</p>
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

          {(() => {
            const mapHref =
              business.mapUrl ||
              (business.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}` : null);
            const socials = SOCIAL_ORDER.filter((k) => business.socialLinks?.[k]);
            if (!mapHref && socials.length === 0) return null;
            return (
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 16 }}>
                {mapHref && (
                  <a href={mapHref} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: c.ink, textDecoration: "none", border: `1px solid ${c.line}`, borderRadius: 999, padding: "7px 14px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {T("directions")}
                  </a>
                )}
                {socials.map((k) => (
                  <a key={k} href={business.socialLinks[k]} target="_blank" rel="noopener noreferrer" aria-label={k} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 999, border: `1px solid ${c.line}`, color: c.sub }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{SOCIAL_ICONS[k]}</svg>
                  </a>
                ))}
              </div>
            );
          })()}

          <p style={{ fontSize: 11.5, color: c.faint, margin: "18px auto 0", maxWidth: 290, lineHeight: 1.6 }}>{T("footerNote")}</p>
          <div style={{ fontSize: 9, letterSpacing: "0.24em", color: c.faint, marginTop: 18 }}>{T("poweredBy")}</div>
        </footer>
      </div>
    </div>
  );
}
