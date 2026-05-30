// ───────────────────────────────────────────────────────────────
// THEME 8 — "RETRO SUN"  ·  70s groovy, arches, harvest warm tones
// Fonts: Yeseva One (display) + Work Sans (body) · arch shapes, sunset
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#F2E3C3', surface: '#FBF2DB', ink: '#3A2A16', gold: '#D99A2B',
    rust: '#BC4A1C', olive: '#6E6C2E', sub: '#7C6A4E', faint: '#A8966E',
  };
  const DISP = "'Yeseva One', Georgia, serif";
  const SAN = "'Work Sans', system-ui, sans-serif";

  const Ph = ({ label, h = '100%', r = 14, tint = '#E7D2A6' }) => (
    <div style={{
      width: '100%', height: h, borderRadius: r, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(135deg, ${tint} 0 12px, rgba(255,255,255,0.5) 12px 24px)`,
      display: 'flex', alignItems: 'flex-end',
    }}>
      <span style={{ font: "600 10px/1 'Work Sans', sans-serif", color: 'rgba(58,42,22,0.45)',
        letterSpacing: '.04em', padding: '8px 10px', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );

  function ThemeRetro() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: SAN, padding: '0 22px' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '36px 0 26px' }}>
          <span style={{ display: 'inline-block', background: C.rust, color: '#F2E3C3', fontWeight: 700, fontSize: 10,
            letterSpacing: '.22em', padding: '6px 14px', borderRadius: 999 }}>{M.eyebrow}</span>
          <h1 style={{ fontFamily: DISP, margin: '16px 0 6px', fontSize: 36, fontWeight: 400, letterSpacing: '.01em', lineHeight: 1 }}>{M.brand}</h1>
          <div style={{ fontSize: 14, fontWeight: 500, color: C.olive }}>{M.branch}</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14, border: `1.5px solid ${C.gold}`,
            color: C.rust, fontWeight: 600, fontSize: 12, padding: '5px 14px', borderRadius: 999 }}>
            <span style={{ width: 7, height: 7, borderRadius: 5, background: C.olive }} />{M.status}
          </span>
        </header>

        {/* HERO — arch top */}
        <section style={{ marginBottom: 34 }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '160px 160px 18px 18px' }}>
            <Ph label={M.hero.img} h={210} r={0} tint="#E0B86E" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(58,42,22,0) 35%, rgba(58,42,22,0.82) 100%)' }} />
            <div style={{ position: 'absolute', left: 24, right: 24, bottom: 22, color: '#F4E6C8', textAlign: 'center' }}>
              <div style={{ fontSize: 10, letterSpacing: '.3em', color: '#F0C778', fontWeight: 700 }}>{M.hero.eyebrow}</div>
              <h2 style={{ fontFamily: DISP, fontWeight: 400, margin: '8px 0 0', fontSize: 26, lineHeight: 1.08 }}>{M.hero.title}</h2>
            </div>
          </div>
          <p style={{ margin: '16px auto 0', fontSize: 13.5, lineHeight: 1.55, color: C.olive, textAlign: 'center', maxWidth: 310 }}>{M.hero.desc}</p>
        </section>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: DISP, margin: 0, fontSize: 22, fontWeight: 400 }}>{M.chefLabel}</h3>
            <span style={{ fontSize: 9.5, letterSpacing: '.16em', color: C.rust, fontWeight: 700 }}>{M.chefNote}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {M.chefPicks.map((p, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 18, padding: 12, border: `1.5px solid ${C.gold}` }}>
                <div style={{ overflow: 'hidden', borderRadius: '80px 80px 10px 10px' }}>
                  <Ph label={p.img} h={108} r={0} tint={i === 0 ? '#D9C19A' : '#E3B98A'} />
                </div>
                <div style={{ fontFamily: DISP, fontSize: 15, fontWeight: 400, marginTop: 10, lineHeight: 1.15,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.rust, marginTop: 4 }}>{p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surface, border: `1.5px solid ${C.gold}`,
          borderRadius: 999, padding: '12px 18px', marginBottom: 16 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.rust} strokeWidth="2.2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontSize: 13.5, color: C.faint }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 22 }}>
          {[C.rust, C.gold, C.olive].map((bg, i) => (
            <span key={i} style={{ fontSize: 12.5, fontWeight: 600, color: '#F2E3C3', background: bg,
              borderRadius: 999, padding: '7px 15px' }}>{M.filters[i]}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 18, marginBottom: 24, borderBottom: `1.5px solid ${C.gold}`, overflow: 'hidden' }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontFamily: DISP, fontSize: 15, paddingBottom: 12, whiteSpace: 'nowrap', fontWeight: 400,
              color: i === 0 ? C.rust : C.olive,
              borderBottom: i === 0 ? `2.5px solid ${C.rust}` : '2.5px solid transparent', marginBottom: -1.5 }}>{c}</span>
          ))}
        </div>

        {/* ITEMS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {M.items.map((it, i) => (
            <div key={i} style={{ background: C.surface, borderRadius: 18, padding: 13, display: 'flex', gap: 14, border: `1.5px solid rgba(217,154,43,0.45)` }}>
              <div style={{ flex: '0 0 78px', overflow: 'hidden', borderRadius: '60px 60px 11px 11px', alignSelf: 'flex-start' }}>
                <Ph label="" h={86} r={0} tint="#E3CDA0" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: DISP, fontSize: 17, fontWeight: 400, lineHeight: 1.15 }}>{it.name}</span>
                  <span style={{ fontFamily: DISP, fontSize: 16, fontWeight: 400, color: C.rust, whiteSpace: 'nowrap' }}>{it.price}</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: 12.5, lineHeight: 1.5, color: C.olive }}>{it.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                  {it.tag && <span style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700,
                    color: '#F2E3C3', background: C.gold, borderRadius: 999, padding: '2px 10px' }}>{it.tag}</span>}
                  <span style={{ fontSize: 11, color: C.faint, marginLeft: 'auto' }}>{it.time}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '42px 0 46px', marginTop: 12 }}>
          <span style={{ fontSize: 18, color: C.gold }}>☀</span>
          <div style={{ fontFamily: DISP, fontSize: 25, fontWeight: 400, marginTop: 6 }}>{M.footer.brand}</div>
          <div style={{ fontSize: 12.5, color: C.olive, marginTop: 12, lineHeight: 1.95 }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontSize: 12, color: C.olive, margin: '20px auto 0', maxWidth: 290, lineHeight: 1.55 }}>{M.footer.note}</p>
          <div style={{ fontSize: 9, letterSpacing: '.22em', color: C.faint, marginTop: 22 }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemeRetro = ThemeRetro;
})();
