// ───────────────────────────────────────────────────────────────
// THEME 9 — "BOTANICAL"  ·  fresh sage spa, airy & light
// Fonts: Newsreader (serif) + Mulish (sans) · calm, hairlines, greenery
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#EDF1E7', surface: '#F8FAF4', ink: '#2B342A', sage: '#7C9070',
    green: '#3D5639', sub: '#6C7567', faint: '#A2AC97', line: 'rgba(61,86,57,0.16)',
  };
  const SER = "'Newsreader', Georgia, serif";
  const SAN = "'Mulish', system-ui, sans-serif";

  const Ph = ({ label, h = '100%', r = 12, top = false }) => (
    <div style={{
      width: '100%', height: h, borderRadius: r, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(135deg, #DDE4D2 0 12px, #D3DCC6 12px 24px)`,
      display: 'flex', alignItems: top ? 'flex-start' : 'flex-end',
    }}>
      <span style={{ font: "700 10px/1 'Mulish', sans-serif", color: 'rgba(61,86,57,0.42)',
        letterSpacing: '.04em', padding: '8px 10px' }}>{label}</span>
    </div>
  );

  function ThemeBotanical() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: SAN, padding: '0 24px' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '40px 0 30px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.34em', color: C.sage, fontWeight: 700, textTransform: 'uppercase' }}>{M.eyebrow}</div>
          <h1 style={{ fontFamily: SER, margin: '14px 0 7px', fontSize: 34, fontWeight: 500, letterSpacing: '-.01em', lineHeight: 1 }}>{M.brand}</h1>
          <div style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 16, color: C.green }}>{M.branch}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14, fontSize: 12, color: C.sub,
            border: `1px solid ${C.line}`, borderRadius: 999, padding: '5px 13px' }}>
            <span style={{ width: 6, height: 6, borderRadius: 5, background: C.sage }} />{M.status}
          </div>
        </header>

        {/* HERO */}
        <section style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 36 }}>
          <Ph label={M.hero.img} h={206} r={16} top />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(43,52,42,0) 32%, rgba(40,50,38,0.78) 100%)' }} />
          <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, color: '#F1F4EA' }}>
            <div style={{ fontSize: 10, letterSpacing: '.3em', color: '#C2D4B0', fontWeight: 700 }}>{M.hero.eyebrow}</div>
            <h2 style={{ fontFamily: SER, fontStyle: 'italic', margin: '8px 0 8px', fontSize: 27, lineHeight: 1.08, fontWeight: 500 }}>{M.hero.title}</h2>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'rgba(241,244,234,0.86)' }}>{M.hero.desc}</p>
          </div>
        </section>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 34 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: SER, margin: 0, fontSize: 22, fontWeight: 600, whiteSpace: 'nowrap' }}>{M.chefLabel}</h3>
            <span style={{ fontSize: 9.5, letterSpacing: '.16em', color: C.sage, fontWeight: 700 }}>{M.chefNote}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {M.chefPicks.map((p, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 14, padding: 12, border: `1px solid ${C.line}` }}>
                <Ph label={p.img} h={108} r={10} />
                <div style={{ fontFamily: SER, fontSize: 15.5, fontWeight: 600, marginTop: 10, lineHeight: 1.15,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginTop: 4 }}>{p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surface, border: `1px solid ${C.line}`,
          borderRadius: 12, padding: '13px 16px', marginBottom: 16 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.sage} strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontSize: 13.5, color: C.faint }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 22 }}>
          {M.filters.map((f, i) => (
            <span key={i} style={{ fontSize: 12.5, color: C.green, background: 'rgba(124,144,112,0.14)',
              border: `1px solid ${C.line}`, borderRadius: 999, padding: '6px 14px', fontWeight: 600 }}>{f}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 24, borderBottom: `1px solid ${C.line}`, overflow: 'hidden' }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontFamily: SER, fontSize: 15.5, paddingBottom: 12, whiteSpace: 'nowrap',
              fontWeight: i === 0 ? 600 : 500, color: i === 0 ? C.green : C.sub,
              borderBottom: i === 0 ? `2px solid ${C.green}` : '2px solid transparent', marginBottom: -1 }}>{c}</span>
          ))}
        </div>

        {/* ITEMS */}
        <section>
          {M.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '18px 0',
              borderBottom: i < M.items.length - 1 ? `1px solid ${C.line}` : 'none' }}>
              <div style={{ flex: '0 0 70px' }}><Ph label="" h={70} r={10} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: SER, fontSize: 17.5, fontWeight: 600, lineHeight: 1.15 }}>{it.name}</span>
                  <span style={{ fontFamily: SER, fontSize: 16, fontWeight: 700, color: C.green, whiteSpace: 'nowrap' }}>{it.price}</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 12.5, lineHeight: 1.55, color: C.sub }}>{it.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 9 }}>
                  {it.tag && <span style={{ fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700,
                    color: C.sage }}>✦ {it.tag}</span>}
                  <span style={{ fontSize: 11, color: C.faint, marginLeft: 'auto' }}>{it.time}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '42px 0 46px', marginTop: 8, borderTop: `1px solid ${C.line}` }}>
          <span style={{ fontFamily: SER, fontSize: 20, color: C.sage, fontStyle: 'italic' }}>❧</span>
          <div style={{ fontFamily: SER, fontSize: 25, fontWeight: 600, marginTop: 6 }}>{M.footer.brand}</div>
          <div style={{ fontSize: 12.5, color: C.sub, marginTop: 12, lineHeight: 1.95 }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 14.5, color: C.green, margin: '20px auto 0', maxWidth: 280, lineHeight: 1.55 }}>{M.footer.note}</p>
          <div style={{ fontSize: 9, letterSpacing: '.22em', color: C.faint, marginTop: 22 }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemeBotanical = ThemeBotanical;
})();
