// ───────────────────────────────────────────────────────────────
// THEME 7 — "SOFT PASTEL"  ·  candy pastels, very rounded, friendly
// Fonts: Quicksand (display) + Nunito (body) · soft shadows, no borders
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#FAF5FB', surface: '#FFFFFF', ink: '#4B4360', sub: '#9089A0',
    lav: '#B7A6EE', mint: '#86D8BE', peach: '#F7B69B', sky: '#92C7F0',
  };
  const DISP = "'Quicksand', system-ui, sans-serif";
  const SAN = "'Nunito', system-ui, sans-serif";
  const PAS = [C.lav, C.mint, C.peach, C.sky];

  const Ph = ({ label, h = '100%', tint = '#EDE6F8', r = 18 }) => (
    <div style={{
      width: '100%', height: h, borderRadius: r, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(45deg, ${tint} 0 12px, rgba(255,255,255,0.6) 12px 24px)`,
      display: 'flex', alignItems: 'flex-end',
    }}>
      <span style={{ font: "700 10px/1 'Nunito', sans-serif", color: C.sub, padding: '8px 10px', letterSpacing: '.02em' }}>{label}</span>
    </div>
  );

  function ThemePastel() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: SAN, padding: '0 22px' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '38px 0 28px' }}>
          <span style={{ display: 'inline-block', background: C.lav, color: '#fff', fontWeight: 700, fontFamily: DISP,
            fontSize: 10, letterSpacing: '.16em', padding: '6px 14px', borderRadius: 999 }}>{M.eyebrow}</span>
          <h1 style={{ fontFamily: DISP, margin: '16px 0 7px', fontSize: 33, fontWeight: 700, letterSpacing: '-.01em' }}>{M.brand}</h1>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.sub }}>{M.branch}</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 14, background: C.mint,
            color: '#fff', fontWeight: 700, fontSize: 12.5, padding: '5px 14px', borderRadius: 999 }}>
            <span style={{ width: 7, height: 7, borderRadius: 5, background: '#fff' }} />{M.status}
          </span>
        </header>

        {/* HERO */}
        <section style={{ background: '#EFE8FB', borderRadius: 28, padding: 16, marginBottom: 32 }}>
          <Ph label={M.hero.img} h={140} tint="#DFD2F6" r={20} />
          <div style={{ padding: '16px 6px 6px' }}>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11, letterSpacing: '.16em', color: C.lav }}>{M.hero.eyebrow}</div>
            <h2 style={{ fontFamily: DISP, margin: '8px 0 10px', fontSize: 25, lineHeight: 1.12, fontWeight: 700, letterSpacing: '-.01em' }}>{M.hero.title}</h2>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, fontWeight: 500, color: C.sub }}>{M.hero.desc}</p>
          </div>
        </section>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: DISP, margin: 0, fontSize: 20, fontWeight: 700 }}>♡ {M.chefLabel}</h3>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.12em', color: C.lav }}>{M.chefNote}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {M.chefPicks.map((p, i) => (
              <div key={i} style={{ background: C.surface, borderRadius: 22, padding: 12, boxShadow: '0 8px 22px rgba(120,100,180,0.10)' }}>
                <Ph label={p.img} h={104} tint={i === 0 ? '#E6DBF7' : '#FBE0D2'} r={16} />
                <div style={{ fontFamily: DISP, fontSize: 14.5, fontWeight: 700, marginTop: 10, lineHeight: 1.1,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <span style={{ display: 'inline-block', background: PAS[i % 4], color: '#fff', fontWeight: 700,
                  fontSize: 12.5, padding: '3px 11px', borderRadius: 999, marginTop: 8 }}>{p.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.surface, borderRadius: 999,
          padding: '13px 18px', marginBottom: 16, boxShadow: '0 4px 14px rgba(120,100,180,0.08)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.lav} strokeWidth="2.4"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: C.sub }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 22 }}>
          {M.filters.map((f, i) => (
            <span key={i} style={{ fontFamily: DISP, fontSize: 12.5, fontWeight: 700, color: '#fff', background: PAS[i % 4],
              borderRadius: 999, padding: '7px 15px' }}>{f}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontFamily: DISP, fontSize: 13, fontWeight: 700, padding: '8px 15px', borderRadius: 999,
              background: i === 0 ? C.lav : C.surface, color: i === 0 ? '#fff' : C.sub,
              boxShadow: i === 0 ? 'none' : '0 2px 8px rgba(120,100,180,0.06)' }}>{c}</span>
          ))}
        </div>

        {/* ITEMS */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {M.items.map((it, i) => {
            const ac = PAS[i % 4];
            return (
              <div key={i} style={{ background: C.surface, borderRadius: 24, padding: 13, display: 'flex', gap: 14,
                boxShadow: '0 6px 18px rgba(120,100,180,0.07)' }}>
                <div style={{ flex: '0 0 80px' }}><Ph label="" h={80} tint={`${ac}33`} r={18} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontFamily: DISP, fontSize: 16, fontWeight: 700, lineHeight: 1.12 }}>{it.name}</span>
                    <span style={{ background: ac, color: '#fff', fontFamily: DISP, fontWeight: 700, fontSize: 13, padding: '3px 11px',
                      borderRadius: 999, whiteSpace: 'nowrap' }}>{it.price}</span>
                  </div>
                  <p style={{ margin: '7px 0 0', fontSize: 12.5, lineHeight: 1.5, fontWeight: 500, color: C.sub }}>{it.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                    {it.tag && <span style={{ fontFamily: DISP, fontSize: 10, fontWeight: 700, color: ac,
                      background: `${ac}22`, padding: '3px 10px', borderRadius: 999 }}>{it.tag}</span>}
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.sub, marginLeft: 'auto' }}>{it.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '40px 0 44px', marginTop: 12 }}>
          <h2 style={{ fontFamily: DISP, fontSize: 24, fontWeight: 700, margin: 0 }}>{M.footer.brand}</h2>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginTop: 12, lineHeight: 1.95 }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontSize: 12, fontWeight: 500, color: C.sub, margin: '20px auto 0', maxWidth: 290, lineHeight: 1.55 }}>{M.footer.note}</p>
          <div style={{ fontFamily: DISP, fontSize: 9.5, fontWeight: 700, letterSpacing: '.18em', color: C.lav, marginTop: 20 }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemePastel = ThemePastel;
})();
