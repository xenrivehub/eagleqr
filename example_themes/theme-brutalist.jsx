// ───────────────────────────────────────────────────────────────
// THEME 5 — "NEUE BRUTALIST"  ·  bold type, hard edges, high contrast
// Fonts: Archivo (heavy display) + Space Mono (meta) · borders, no radius
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#E9E6DC', paper: '#F4F2EA', ink: '#121212', elec: '#2B27EE', acid: '#DCF200',
    sub: '#55524a',
  };
  const DISP = "'Archivo', system-ui, sans-serif";
  const MONO = "'Space Mono', monospace";

  const Ph = ({ label, h = '100%' }) => (
    <div style={{
      width: '100%', height: h, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(90deg, #DAD6C8 0 6px, #E4E0D3 6px 12px)`,
      border: `2px solid ${C.ink}`, display: 'flex', alignItems: 'flex-end',
    }}>
      <span style={{ font: "10px/1 'Space Mono', monospace", color: C.ink, opacity: .5,
        padding: '6px 7px', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );

  function ThemeBrutalist() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: DISP, padding: '0 18px' }}>

        {/* HEADER */}
        <header style={{ paddingTop: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontFamily: MONO, fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase',
            borderBottom: `2px solid ${C.ink}`, paddingBottom: 10 }}>
            <span>{M.eyebrow}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, background: C.elec }} />{M.status}
            </span>
          </div>
          <h1 style={{ fontFamily: DISP, margin: '20px 0 0', fontSize: 46, fontWeight: 900, lineHeight: .9,
            letterSpacing: '-.03em', textTransform: 'uppercase' }}>{M.brand}</h1>
          <div style={{ fontFamily: MONO, fontSize: 13, marginTop: 12, marginBottom: 26,
            background: C.acid, display: 'inline-block', padding: '3px 8px', border: `2px solid ${C.ink}` }}>{M.branch}</div>
        </header>

        {/* HERO */}
        <section style={{ border: `2.5px solid ${C.ink}`, boxShadow: `6px 6px 0 ${C.ink}`, background: C.paper, marginBottom: 36 }}>
          <Ph label={M.hero.img} h={128} />
          <div style={{ padding: 16 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.1em', color: C.elec, textTransform: 'uppercase' }}>[ {M.hero.eyebrow} ]</div>
            <h2 style={{ fontFamily: DISP, margin: '10px 0 10px', fontSize: 27, lineHeight: .98, fontWeight: 800,
              letterSpacing: '-.02em', textTransform: 'uppercase' }}>{M.hero.title}</h2>
            <p style={{ fontFamily: MONO, margin: 0, fontSize: 11.5, lineHeight: 1.55, color: C.sub }}>{M.hero.desc}</p>
          </div>
        </section>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 34 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontFamily: DISP, margin: 0, fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-.01em' }}>★ {M.chefLabel}</h3>
            <span style={{ fontFamily: MONO, fontSize: 9.5, color: C.sub, textTransform: 'uppercase' }}>{M.chefNote}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `2px solid ${C.ink}` }}>
            {M.chefPicks.map((p, i) => (
              <div key={i} style={{ padding: 12, borderLeft: i === 1 ? `2px solid ${C.ink}` : 'none' }}>
                <Ph label={p.img} h={96} />
                <div style={{ fontFamily: MONO, fontSize: 10, marginTop: 8, color: C.sub }}>0{i + 1}</div>
                <div style={{ fontFamily: DISP, fontSize: 14, fontWeight: 800, lineHeight: 1.05, textTransform: 'uppercase',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, marginTop: 5,
                  background: C.elec, color: '#fff', display: 'inline-block', padding: '1px 6px' }}>{p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: `2px solid ${C.ink}`,
          background: C.paper, padding: '12px 14px', marginBottom: 16 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontFamily: MONO, fontSize: 12, color: C.sub }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {M.filters.map((f, i) => (
            <span key={i} style={{ fontFamily: MONO, fontSize: 11, textTransform: 'uppercase', color: C.ink,
              border: `2px solid ${C.ink}`, padding: '5px 11px', background: i === 0 ? C.acid : 'transparent' }}>{f}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, border: `2px solid ${C.ink}`, flexWrap: 'nowrap', overflow: 'hidden' }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontFamily: MONO, fontSize: 10.5, textTransform: 'uppercase', padding: '8px 9px',
              whiteSpace: 'nowrap', borderLeft: i > 0 ? `2px solid ${C.ink}` : 'none',
              background: i === 0 ? C.ink : 'transparent', color: i === 0 ? '#fff' : C.ink, fontWeight: 700 }}>{c}</span>
          ))}
        </div>

        {/* ITEMS */}
        <section style={{ borderTop: `2px solid ${C.ink}` }}>
          {M.items.map((it, i) => (
            <div key={i} style={{ borderBottom: `2px solid ${C.ink}`, padding: '16px 2px', display: 'flex', gap: 12 }}>
              <div style={{ flex: '0 0 22px', fontFamily: MONO, fontSize: 11, color: C.sub, paddingTop: 3 }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: DISP, fontSize: 18, fontWeight: 800, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{it.name}</span>
                  <span style={{ fontFamily: DISP, fontSize: 18, fontWeight: 900, whiteSpace: 'nowrap',
                    background: C.elec, color: '#fff', padding: '2px 7px' }}>{it.price}</span>
                </div>
                <p style={{ fontFamily: MONO, margin: '9px 0 0', fontSize: 11, lineHeight: 1.5, color: C.sub }}>{it.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
                  {it.tag && <span style={{ fontFamily: MONO, fontSize: 9.5, textTransform: 'uppercase',
                    border: `1.5px solid ${C.ink}`, padding: '2px 7px', background: C.acid }}>{it.tag}</span>}
                  <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.sub, marginLeft: 'auto' }}>{it.time}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '34px 0 44px', marginTop: 6 }}>
          <h2 style={{ fontFamily: DISP, fontSize: 30, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '-.02em', lineHeight: .95 }}>{M.footer.brand}</h2>
          <div style={{ fontFamily: MONO, fontSize: 12, marginTop: 14, lineHeight: 1.9, textTransform: 'uppercase' }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontFamily: MONO, fontSize: 11, color: C.sub, margin: '20px 0 0', lineHeight: 1.55,
            borderTop: `2px solid ${C.ink}`, paddingTop: 16 }}>{M.footer.note}</p>
          <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '.1em', color: C.sub, marginTop: 18, textTransform: 'uppercase' }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemeBrutalist = ThemeBrutalist;
})();
