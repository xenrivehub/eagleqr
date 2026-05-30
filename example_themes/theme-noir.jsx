// ───────────────────────────────────────────────────────────────
// THEME 6 — "NOIR"  ·  modern minimal dark, cool mint accent
// Font: Space Grotesk · charcoal + mint · sleek, techy, negative space
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#14161B', surface: '#1D212A', ink: '#ECEEF2', sub: '#969DAA',
    faint: '#5C636F', mint: '#54E0AE', line: 'rgba(255,255,255,0.09)',
  };
  const F = "'Space Grotesk', system-ui, sans-serif";

  const Ph = ({ label, h = '100%', r = 10 }) => (
    <div style={{
      width: '100%', height: h, borderRadius: r, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(135deg, #232833 0 12px, #1B1F28 12px 24px)`,
      display: 'flex', alignItems: 'flex-end', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
    }}>
      <span style={{ font: "10px/1 'Space Grotesk', monospace", color: 'rgba(255,255,255,0.32)',
        letterSpacing: '.04em', padding: '8px 9px' }}>{label}</span>
    </div>
  );

  function ThemeNoir() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: F, padding: '0 24px' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.4em', color: C.mint, fontWeight: 500 }}>{M.eyebrow}</div>
          <h1 style={{ margin: '15px 0 8px', fontSize: 31, fontWeight: 600, letterSpacing: '-.02em' }}>{M.brand}</h1>
          <div style={{ fontSize: 13.5, color: C.sub }}>{M.branch}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14, fontSize: 11.5, color: C.sub,
            border: `1px solid ${C.line}`, borderRadius: 999, padding: '5px 13px' }}>
            <span style={{ width: 6, height: 6, borderRadius: 5, background: C.mint, boxShadow: `0 0 8px ${C.mint}` }} />{M.status}
          </div>
        </header>

        {/* HERO */}
        <section style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', marginBottom: 36 }}>
          <Ph label={M.hero.img} h={200} r={14} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,22,27,0.1) 20%, rgba(20,22,27,0.92) 100%)' }} />
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: '.34em', color: C.mint }}>{M.hero.eyebrow}</div>
            <h2 style={{ margin: '9px 0 9px', fontSize: 25, lineHeight: 1.08, fontWeight: 600, letterSpacing: '-.02em' }}>{M.hero.title}</h2>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: C.sub }}>{M.hero.desc}</p>
          </div>
        </section>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 34 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{M.chefLabel}</h3>
            <span style={{ fontSize: 9.5, letterSpacing: '.18em', color: C.faint }}>{M.chefNote}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {M.chefPicks.map((p, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 14, padding: 11, border: `1px solid ${C.line}` }}>
                <Ph label={p.img} h={102} r={9} />
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10, lineHeight: 1.15,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.mint, marginTop: 4 }}>{p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surface, border: `1px solid ${C.line}`,
          borderRadius: 999, padding: '12px 16px', marginBottom: 16 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.mint} strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontSize: 13, color: C.faint }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {M.filters.map((f, i) => (
            <span key={i} style={{ fontSize: 12, color: C.sub, border: `1px solid ${C.line}`, background: C.surface,
              borderRadius: 999, padding: '6px 13px' }}>{f}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 24, borderBottom: `1px solid ${C.line}`, overflow: 'hidden' }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontSize: 13.5, paddingBottom: 12, whiteSpace: 'nowrap',
              fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.mint : C.sub,
              borderBottom: i === 0 ? `2px solid ${C.mint}` : '2px solid transparent', marginBottom: -1 }}>{c}</span>
          ))}
        </div>

        {/* ITEMS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {M.items.map((it, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: 14, display: 'flex', gap: 14 }}>
              <div style={{ flex: '0 0 76px' }}><Ph label="" h={76} r={10} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.01em' }}>{it.name}</span>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: C.mint, whiteSpace: 'nowrap' }}>{it.price}</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 12.5, lineHeight: 1.5, color: C.sub }}>{it.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                  {it.tag && <span style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600,
                    color: C.mint, border: `1px solid rgba(84,224,174,0.4)`, borderRadius: 999, padding: '2px 9px' }}>{it.tag}</span>}
                  <span style={{ fontSize: 11, color: C.faint, marginLeft: 'auto' }}>{it.time}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '42px 0 46px', marginTop: 12, borderTop: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '.01em', marginTop: 30 }}>{M.footer.brand}</div>
          <div style={{ fontSize: 12.5, color: C.sub, marginTop: 12, lineHeight: 1.95 }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontSize: 11.5, color: C.faint, margin: '20px auto 0', maxWidth: 280, lineHeight: 1.6 }}>{M.footer.note}</p>
          <div style={{ fontSize: 9, letterSpacing: '.24em', color: C.faint, marginTop: 22 }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemeNoir = ThemeNoir;
})();
