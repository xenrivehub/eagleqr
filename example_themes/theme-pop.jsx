// ───────────────────────────────────────────────────────────────
// THEME 3 — "CITRUS POP"  ·  vibrant & fun, chunky rounded cards
// Fonts: Bricolage Grotesque (display) + DM Sans · offset shadows, stickers
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#FFF6E9', ink: '#1B1626', sub: '#5C5468',
    tang: '#FF5A1F', cobalt: '#2E5BFF', pink: '#FF4D8D', lime: '#9BD30F', cream: '#FFFFFF',
  };
  const DISP = "'Bricolage Grotesque', system-ui, sans-serif";
  const SAN = "'DM Sans', system-ui, sans-serif";
  const ACCENTS = [C.tang, C.cobalt, C.pink, C.lime];

  const Ph = ({ label, h = '100%', tint = '#F4D9B8', r = 16 }) => (
    <div style={{
      width: '100%', height: h, borderRadius: r, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(45deg, ${tint} 0 13px, rgba(255,255,255,0.55) 13px 26px)`,
      border: `2px solid ${C.ink}`, display: 'flex', alignItems: 'flex-end',
    }}>
      <span style={{ font: "10px/1 'DM Sans', sans-serif", fontWeight: 700, color: C.ink, opacity: .5,
        letterSpacing: '.02em', padding: '8px 9px' }}>{label}</span>
    </div>
  );

  function ThemePop() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: SAN, padding: '0 20px' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '34px 0 26px' }}>
          <span style={{ display: 'inline-block', background: C.cobalt, color: '#fff', fontWeight: 700,
            fontSize: 10, letterSpacing: '.16em', padding: '6px 12px', borderRadius: 999, transform: 'rotate(-2deg)' }}>{M.eyebrow}</span>
          <h1 style={{ fontFamily: DISP, margin: '16px 0 6px', fontSize: 38, fontWeight: 800, letterSpacing: '-.02em', lineHeight: .98 }}>
            {M.brand}
          </h1>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.sub }}>{M.branch}</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14, background: C.lime,
            color: C.ink, fontWeight: 700, fontSize: 12, padding: '5px 13px', borderRadius: 999, border: `2px solid ${C.ink}` }}>
            <span style={{ width: 7, height: 7, borderRadius: 5, background: C.ink }} />{M.status}
          </span>
        </header>

        {/* HERO */}
        <section style={{ background: C.tang, borderRadius: 28, border: `2.5px solid ${C.ink}`,
          boxShadow: `7px 7px 0 ${C.ink}`, padding: 18, marginBottom: 34, color: '#fff' }}>
          <Ph label={M.hero.img} h={130} tint="#FFB088" r={16} />
          <div style={{ padding: '16px 4px 2px' }}>
            <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: '.18em', opacity: .85 }}>{M.hero.eyebrow}</div>
            <h2 style={{ fontFamily: DISP, margin: '8px 0 10px', fontSize: 27, lineHeight: 1.04, fontWeight: 800, letterSpacing: '-.02em' }}>{M.hero.title}</h2>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, fontWeight: 500, color: 'rgba(255,255,255,0.92)' }}>{M.hero.desc}</p>
          </div>
        </section>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: DISP, margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: '-.01em' }}>✦ {M.chefLabel}</h3>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.12em', color: C.cobalt }}>{M.chefNote}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {M.chefPicks.map((p, i) => (
              <div key={i} style={{ background: C.cream, borderRadius: 20, border: `2px solid ${C.ink}`,
                boxShadow: `4px 4px 0 ${C.ink}`, padding: 12 }}>
                <Ph label={p.img} h={104} tint={i === 0 ? '#D7C0E8' : '#F4C8B0'} r={13} />
                <div style={{ fontFamily: DISP, fontSize: 14.5, fontWeight: 700, marginTop: 10, lineHeight: 1.1,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <span style={{ display: 'inline-block', background: ACCENTS[i % 4], color: '#fff', fontWeight: 700,
                  fontSize: 12.5, padding: '3px 10px', borderRadius: 999, marginTop: 7 }}>{p.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.cream, border: `2px solid ${C.ink}`,
          borderRadius: 999, padding: '12px 18px', marginBottom: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2.4"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontSize: 13.5, fontWeight: 500, color: C.sub }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 22 }}>
          {M.filters.map((f, i) => (
            <span key={i} style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', background: ACCENTS[i % 4],
              borderRadius: 999, padding: '7px 15px', border: `2px solid ${C.ink}` }}>{f}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 9, marginBottom: 24, flexWrap: 'wrap' }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: 999,
              border: `2px solid ${C.ink}`,
              background: i === 0 ? C.ink : 'transparent', color: i === 0 ? '#fff' : C.ink }}>{c}</span>
          ))}
        </div>

        {/* ITEMS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {M.items.map((it, i) => {
            const ac = ACCENTS[i % 4];
            return (
              <div key={i} style={{ background: C.cream, borderRadius: 22, border: `2.5px solid ${C.ink}`,
                boxShadow: `5px 5px 0 ${C.ink}`, padding: 14, display: 'flex', gap: 14 }}>
                <div style={{ flex: '0 0 84px' }}><Ph label="" h={84} tint={`${ac}33`} r={14} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: DISP, fontSize: 16.5, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.01em' }}>{it.name}</span>
                    <span style={{ background: ac, color: '#fff', fontWeight: 700, fontSize: 13, padding: '3px 10px',
                      borderRadius: 999, whiteSpace: 'nowrap', transform: 'rotate(2deg)' }}>{it.price}</span>
                  </div>
                  <p style={{ margin: '7px 0 0', fontSize: 12.5, lineHeight: 1.5, fontWeight: 500, color: C.sub }}>{it.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
                    {it.tag && <span style={{ fontSize: 10, fontWeight: 700, color: C.ink, background: '#F2EAD8',
                      border: `1.5px solid ${C.ink}`, padding: '2px 9px', borderRadius: 999 }}>{it.tag}</span>}
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.sub, marginLeft: 'auto' }}>⏱ {it.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '40px 0 44px', marginTop: 14 }}>
          <h2 style={{ fontFamily: DISP, fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-.01em' }}>{M.footer.brand}</h2>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginTop: 12, lineHeight: 1.9 }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontSize: 12, fontWeight: 500, color: C.sub, margin: '20px auto 0', maxWidth: 290, lineHeight: 1.55 }}>{M.footer.note}</p>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.18em', color: C.tang, marginTop: 20 }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemePop = ThemePop;
})();
