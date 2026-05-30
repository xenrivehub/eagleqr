// ───────────────────────────────────────────────────────────────
// THEME 1 — "MINERAL"  ·  minimalist, light paper, single clay accent
// Font: Schibsted Grotesk · airy whitespace · hairline dividers
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#F6F4EF', surface: '#FFFFFF', ink: '#1C1B17', sub: '#8C887E',
    faint: '#B6B2A8', line: 'rgba(28,27,23,0.10)', accent: '#B65C3B',
    chip: 'rgba(28,27,23,0.06)',
  };
  const F = "'Schibsted Grotesk', system-ui, sans-serif";

  const Ph = ({ label, h = '100%', r = 4 }) => (
    <div style={{
      width: '100%', height: h, borderRadius: r, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(135deg, #EDEAE2 0 11px, #E6E2D9 11px 22px)`,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
    }}>
      <span style={{ font: "10px/1 'Space Mono', monospace", color: 'rgba(28,27,23,0.32)',
        letterSpacing: '.04em', padding: '7px 8px' }}>{label}</span>
    </div>
  );

  const Divider = () => <div style={{ height: 1, background: C.line, margin: '0' }} />;

  function ThemeMineral() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: F,
        WebkitFontSmoothing: 'antialiased', padding: '0 26px 0' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '.32em', color: C.faint, fontWeight: 600 }}>{M.eyebrow}</div>
          <h1 style={{ margin: '14px 0 8px', fontSize: 30, fontWeight: 700, letterSpacing: '-.02em' }}>{M.brand}</h1>
          <div style={{ fontSize: 13.5, color: C.sub }}>{M.branch}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14,
            fontSize: 11.5, color: C.sub }}>
            <span style={{ width: 6, height: 6, borderRadius: 5, background: '#3FAE7A' }} />{M.status}
          </div>
        </header>

        {/* HERO */}
        <section style={{ marginBottom: 38 }}>
          <Ph label="mekan / iç-mekan" h={156} r={6} />
          <div style={{ paddingTop: 18 }}>
            <div style={{ fontSize: 10.5, letterSpacing: '.28em', color: C.accent, fontWeight: 600 }}>{M.hero.eyebrow}</div>
            <h2 style={{ margin: '10px 0 10px', fontSize: 24, lineHeight: 1.15, fontWeight: 600, letterSpacing: '-.02em' }}>{M.hero.title}</h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: C.sub, maxWidth: 320 }}>{M.hero.desc}</p>
          </div>
        </section>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: '-.01em' }}>{M.chefLabel}</h3>
            <span style={{ fontSize: 10, letterSpacing: '.18em', color: C.faint, fontWeight: 600 }}>{M.chefNote}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {M.chefPicks.map((p, i) => (
              <div key={i}>
                <Ph label={p.img} h={120} r={6} />
                <div style={{ marginTop: 11, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ marginTop: 3, fontSize: 13.5, color: C.accent, fontWeight: 600 }}>{p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${C.line}`,
          borderRadius: 999, padding: '12px 16px', marginBottom: 16, background: C.surface }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.faint} strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontSize: 13, color: C.faint }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {M.filters.map((f, i) => (
            <span key={i} style={{ fontSize: 12, color: C.sub, border: `1px solid ${C.line}`,
              borderRadius: 999, padding: '6px 13px' }}>{f}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 6, borderBottom: `1px solid ${C.line}`, paddingBottom: 0, overflow: 'hidden' }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontSize: 13.5, paddingBottom: 12, whiteSpace: 'nowrap',
              fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.ink : C.sub,
              borderBottom: i === 0 ? `2px solid ${C.ink}` : '2px solid transparent', marginBottom: -1 }}>{c}</span>
          ))}
        </div>

        {/* ITEMS */}
        <section>
          {M.items.map((it, i) => (
            <div key={i}>
              <div style={{ display: 'flex', gap: 14, padding: '20px 0' }}>
                <div style={{ flex: '0 0 64px' }}><Ph label="" h={64} r={6} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.01em' }}>{it.name}</span>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: C.accent, whiteSpace: 'nowrap' }}>{it.price}</span>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: 12.5, lineHeight: 1.55, color: C.sub }}>{it.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    {it.tag
                      ? <span style={{ fontSize: 9.5, letterSpacing: '.14em', fontWeight: 700, color: C.accent, textTransform: 'uppercase' }}>{it.tag}</span>
                      : <span />}
                    <span style={{ fontSize: 11, color: C.faint }}>{it.time}</span>
                  </div>
                </div>
              </div>
              {i < M.items.length - 1 && <Divider />}
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '40px 0 44px', marginTop: 8, borderTop: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '.02em', marginTop: 30 }}>{M.footer.brand}</div>
          <div style={{ fontSize: 12.5, color: C.sub, marginTop: 12, lineHeight: 1.9 }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontSize: 11.5, color: C.faint, margin: '22px auto 0', maxWidth: 280, lineHeight: 1.6 }}>{M.footer.note}</p>
          <div style={{ fontSize: 9, letterSpacing: '.22em', color: C.faint, marginTop: 22 }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemeMineral = ThemeMineral;
})();
