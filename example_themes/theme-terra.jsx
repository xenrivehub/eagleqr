// ───────────────────────────────────────────────────────────────
// THEME 4 — "TERRA"  ·  natural / organic earth tones, cozy & handmade
// Fonts: Spectral (serif) + Karla (sans) · soft rounding, warm surfaces
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#EBE2D2', surface: '#F6F0E3', ink: '#3A2E25', clay: '#B0623A',
    olive: '#6E6B3E', sub: '#7d7264', faint: '#A99D8A', line: 'rgba(58,46,37,0.13)',
  };
  const SER = "'Spectral', Georgia, serif";
  const SAN = "'Karla', system-ui, sans-serif";

  const Ph = ({ label, h = '100%', r = 16, top = false }) => (
    <div style={{
      width: '100%', height: h, borderRadius: r, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(125deg, #DDD0BB 0 10px, #D4C5AC 10px 20px)`,
      display: 'flex', alignItems: top ? 'flex-start' : 'flex-end',
    }}>
      <span style={{ font: "10px/1 'Karla', sans-serif", color: 'rgba(58,46,37,0.4)', fontWeight: 600,
        letterSpacing: '.03em', padding: '8px 9px' }}>{label}</span>
    </div>
  );

  function ThemeTerra() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: SAN, padding: '0 24px' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <div style={{ fontSize: 10.5, letterSpacing: '.3em', color: C.clay, fontWeight: 700, textTransform: 'uppercase' }}>{M.eyebrow}</div>
          <h1 style={{ fontFamily: SER, margin: '14px 0 7px', fontSize: 35, fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1 }}>{M.brand}</h1>
          <div style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 16, color: C.olive }}>{M.branch}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14, background: C.surface,
            border: `1px solid ${C.line}`, borderRadius: 999, padding: '5px 13px', fontSize: 12, color: C.sub }}>
            <span style={{ width: 6, height: 6, borderRadius: 5, background: C.olive }} />{M.status}
          </div>
        </header>

        {/* HERO */}
        <section style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', marginBottom: 36 }}>
          <Ph label={M.hero.img} h={210} r={22} top />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(58,46,37,0) 30%, rgba(50,38,28,0.8) 100%)' }} />
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, color: '#F4ECDD' }}>
            <div style={{ fontSize: 10, letterSpacing: '.3em', color: '#E2B998', fontWeight: 700 }}>{M.hero.eyebrow}</div>
            <h2 style={{ fontFamily: SER, fontStyle: 'italic', margin: '8px 0 8px', fontSize: 26, lineHeight: 1.1, fontWeight: 600 }}>{M.hero.title}</h2>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'rgba(244,236,221,0.86)' }}>{M.hero.desc}</p>
          </div>
        </section>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 34 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: SER, margin: 0, fontSize: 22, fontWeight: 700 }}>{M.chefLabel}</h3>
            <span style={{ fontSize: 9.5, letterSpacing: '.16em', color: C.clay, fontWeight: 700 }}>{M.chefNote}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {M.chefPicks.map((p, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 18, padding: 12, boxShadow: '0 4px 18px rgba(58,46,37,0.07)' }}>
                <Ph label={p.img} h={108} r={12} />
                <div style={{ fontFamily: SER, fontSize: 15, fontWeight: 600, marginTop: 10, lineHeight: 1.15,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.clay, marginTop: 4 }}>{p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surface, border: `1px solid ${C.line}`,
          borderRadius: 14, padding: '13px 16px', marginBottom: 16 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontSize: 13.5, color: C.faint }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {M.filters.map((f, i) => (
            <span key={i} style={{ fontSize: 12.5, color: C.clay, background: 'rgba(176,98,58,0.09)',
              border: `1px solid rgba(176,98,58,0.3)`, borderRadius: 999, padding: '6px 14px', fontWeight: 600 }}>{f}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 24, borderBottom: `1px solid ${C.line}`, flexWrap: 'nowrap', overflow: 'hidden' }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontFamily: SER, fontSize: 15, paddingBottom: 12, whiteSpace: 'nowrap',
              fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.clay : C.sub,
              borderBottom: i === 0 ? `2px solid ${C.clay}` : '2px solid transparent', marginBottom: -1 }}>{c}</span>
          ))}
        </div>

        {/* ITEMS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {M.items.map((it, i) => (
            <div key={i} style={{ background: C.surface, borderRadius: 18, padding: 13, display: 'flex', gap: 14,
              boxShadow: '0 3px 14px rgba(58,46,37,0.05)' }}>
              <div style={{ flex: '0 0 78px' }}><Ph label="" h={78} r={13} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: SER, fontSize: 17, fontWeight: 600, lineHeight: 1.15 }}>{it.name}</span>
                  <span style={{ fontFamily: SER, fontSize: 16, fontWeight: 700, color: C.clay, whiteSpace: 'nowrap' }}>{it.price}</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 12.5, lineHeight: 1.55, color: C.sub }}>{it.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                  {it.tag && <span style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700,
                    color: C.olive, border: `1px solid rgba(110,107,62,0.4)`, borderRadius: 999, padding: '2px 9px' }}>{it.tag}</span>}
                  <span style={{ fontSize: 11, color: C.faint, marginLeft: 'auto' }}>{it.time}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '42px 0 46px', marginTop: 12 }}>
          <span style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 20, color: C.clay }}>❦</span>
          <div style={{ fontFamily: SER, fontSize: 24, fontWeight: 700, marginTop: 8 }}>{M.footer.brand}</div>
          <div style={{ fontSize: 12.5, color: C.sub, marginTop: 12, lineHeight: 1.95 }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 14, color: C.olive, margin: '20px auto 0', maxWidth: 280, lineHeight: 1.55 }}>{M.footer.note}</p>
          <div style={{ fontSize: 9, letterSpacing: '.22em', color: C.faint, marginTop: 22 }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemeTerra = ThemeTerra;
})();
