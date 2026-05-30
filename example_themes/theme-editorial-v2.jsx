// ───────────────────────────────────────────────────────────────
// THEME 10 — "EDITORIAL"  ·  magazine / Swiss, monochrome + one red
// Fonts: Instrument Serif (display) + Libre Franklin (body) · grid, rules
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#F4F2EB', paper: '#FBFAF5', ink: '#16130F', red: '#DE2418',
    sub: '#6A655D', faint: '#9A9489', line: 'rgba(22,19,15,0.16)',
  };
  const SER = "'Instrument Serif', Georgia, serif";
  const SAN = "'Libre Franklin', system-ui, sans-serif";

  const Ph = ({ label, h = '100%', top = false }) => (
    <div style={{
      width: '100%', height: h, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(135deg, #E5E2D8 0 11px, #DCD8CC 11px 22px)`,
      display: 'flex', alignItems: top ? 'flex-start' : 'flex-end',
      boxShadow: 'inset 0 0 0 1px rgba(22,19,15,0.1)',
    }}>
      <span style={{ font: "600 9.5px/1 'Libre Franklin', sans-serif", color: 'rgba(22,19,15,0.4)',
        letterSpacing: '.08em', padding: '8px 9px', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );

  const Kicker = ({ children, c = C.red }) => (
    <span style={{ fontFamily: SAN, fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: c }}>{children}</span>
  );

  function ThemeEditorial() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: SAN, padding: '0 22px' }}>

        {/* HEADER */}
        <header style={{ paddingTop: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: `2px solid ${C.ink}`, paddingBottom: 9 }}>
            <Kicker c={C.ink}>{M.eyebrow}</Kicker>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: SAN, fontSize: 10,
              fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: C.sub }}>
              <span style={{ width: 7, height: 7, borderRadius: 5, background: C.red }} />{M.status}
            </span>
          </div>
          <h1 style={{ fontFamily: SER, margin: '16px 0 7px', fontSize: 44, fontWeight: 400, lineHeight: 1.0, letterSpacing: '-.01em' }}>{M.brand}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 24 }}>
            <span style={{ width: 28, height: 2, background: C.red }} />
            <span style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 19, color: C.sub }}>{M.branch}</span>
          </div>
        </header>

        {/* HERO */}
        <section style={{ borderTop: `1px solid ${C.line}`, paddingTop: 22, marginBottom: 36 }}>
          <Ph label={M.hero.img} h={188} top />
          <div style={{ marginTop: 16 }}>
            <Kicker>{M.hero.eyebrow}</Kicker>
            <h2 style={{ fontFamily: SER, margin: '8px 0 10px', fontSize: 33, lineHeight: 1.0, fontWeight: 400, letterSpacing: '-.01em' }}>{M.hero.title}</h2>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: C.sub, maxWidth: 330 }}>{M.hero.desc}</p>
          </div>
        </section>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 34 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14,
            borderBottom: `2px solid ${C.ink}`, paddingBottom: 8 }}>
            <h3 style={{ fontFamily: SER, margin: 0, fontSize: 22, fontWeight: 400, whiteSpace: 'nowrap' }}>{M.chefLabel}</h3>
            <Kicker c={C.sub}>{M.chefNote}</Kicker>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {M.chefPicks.map((p, i) => (
              <div key={i}>
                <Ph label={p.img} h={112} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: SER, fontSize: 18, color: C.red, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: SER, fontSize: 17, fontWeight: 400, lineHeight: 1.1, flex: 1, minWidth: 0,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                </div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginTop: 3 }}>{p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1.5px solid ${C.ink}`,
          background: C.paper, padding: '12px 15px', marginBottom: 16 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontSize: 13, color: C.faint }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {M.filters.map((f, i) => (
            <span key={i} style={{ fontFamily: SAN, fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase',
              color: i === 0 ? C.paper : C.ink, background: i === 0 ? C.red : 'transparent',
              border: `1.5px solid ${i === 0 ? C.red : C.line}`, padding: '6px 13px' }}>{f}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 22, borderBottom: `2px solid ${C.ink}`, overflow: 'hidden' }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontFamily: SAN, fontSize: 11.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase',
              paddingBottom: 11, whiteSpace: 'nowrap', color: i === 0 ? C.red : C.sub,
              borderBottom: i === 0 ? `2px solid ${C.red}` : '2px solid transparent', marginBottom: -2 }}>{c}</span>
          ))}
        </div>

        {/* ITEMS */}
        <section>
          {M.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '18px 0', borderBottom: `1px solid ${C.line}` }}>
              <div style={{ flex: '0 0 26px', fontFamily: SER, fontSize: 22, color: C.red, lineHeight: 1, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: SER, fontSize: 21, fontWeight: 400, lineHeight: 1.05 }}>{it.name}</span>
                  <span style={{ fontFamily: SAN, fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap' }}>{it.price}</span>
                </div>
                <p style={{ margin: '7px 0 0', fontSize: 12, lineHeight: 1.55, color: C.sub }}>{it.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                  {it.tag && <Kicker>{it.tag}</Kicker>}
                  <span style={{ fontFamily: SAN, fontSize: 10, fontWeight: 600, letterSpacing: '.06em', color: C.faint, marginLeft: 'auto', textTransform: 'uppercase' }}>{it.time}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '38px 0 46px', marginTop: 6, textAlign: 'center' }}>
          <div style={{ width: 36, height: 2, background: C.red, margin: '0 auto 16px' }} />
          <div style={{ fontFamily: SER, fontSize: 30, fontWeight: 400, letterSpacing: '-.01em' }}>{M.footer.brand}</div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 12, lineHeight: 1.95, fontWeight: 500 }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontSize: 11.5, color: C.faint, margin: '20px auto 0', maxWidth: 290, lineHeight: 1.55 }}>{M.footer.note}</p>
          <div style={{ fontFamily: SAN, fontSize: 9, fontWeight: 700, letterSpacing: '.18em', color: C.faint, marginTop: 22, textTransform: 'uppercase' }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemeEditorial = ThemeEditorial;
})();
