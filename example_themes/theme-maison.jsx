// ───────────────────────────────────────────────────────────────
// THEME 2 — "MAISON"  ·  luxury editorial, cream / forest green / brass
// Fonts: Cormorant Garamond (display) + Jost (labels) · fine-dining list
// ───────────────────────────────────────────────────────────────
(function () {
  const C = {
    bg: '#F1EADC', paper: '#F7F2E8', ink: '#232a20', green: '#2C4733',
    brass: '#9A7634', sub: '#6f6a5c', faint: '#A99F88', line: 'rgba(44,71,51,0.22)',
  };
  const SER = "'Cormorant Garamond', Georgia, serif";
  const SAN = "'Jost', system-ui, sans-serif";

  const Ph = ({ label, h = '100%', top = false }) => (
    <div style={{
      width: '100%', height: h, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(135deg, #E7DECB 0 12px, #E0D6BF 12px 24px)`,
      display: 'flex', alignItems: top ? 'flex-start' : 'flex-end',
      boxShadow: 'inset 0 0 0 1px rgba(44,71,51,0.14)',
    }}>
      <span style={{ font: "10px/1 'Jost', sans-serif", color: 'rgba(44,71,51,0.4)',
        letterSpacing: '.12em', textTransform: 'uppercase', padding: '8px 10px' }}>{label}</span>
    </div>
  );

  const Label = ({ children, c = C.brass }) => (
    <div style={{ fontFamily: SAN, fontSize: 10.5, letterSpacing: '.34em', textTransform: 'uppercase', color: c, fontWeight: 500 }}>{children}</div>
  );

  function ThemeMaison() {
    const M = window.MENU;
    return (
      <div style={{ width: '100%', background: C.bg, color: C.ink, fontFamily: SAN, padding: '0 28px' }}>

        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '42px 0 30px' }}>
          <Label>{M.eyebrow}</Label>
          <h1 style={{ fontFamily: SER, margin: '16px 0 6px', fontSize: 44, fontWeight: 600,
            letterSpacing: '.01em', lineHeight: 1 }}>{M.brand}</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '6px 0' }}>
            <span style={{ width: 26, height: 1, background: C.brass }} />
            <span style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 17, color: C.green }}>{M.branch}</span>
            <span style={{ width: 26, height: 1, background: C.brass }} />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 8,
            fontFamily: SAN, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: C.sub }}>
            <span style={{ width: 5, height: 5, borderRadius: 5, background: C.green }} />{M.status}
          </div>
        </header>

        {/* HERO */}
        <section style={{ position: 'relative', marginBottom: 40 }}>
          <Ph label={M.hero.img} h={240} top />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(35,42,32,0) 35%, rgba(28,34,26,0.74) 100%)' }} />
          <div style={{ position: 'absolute', left: 22, right: 22, bottom: 22, color: '#F4EEDF' }}>
            <div style={{ fontFamily: SAN, fontSize: 10, letterSpacing: '.34em', color: '#E2CE9E' }}>{M.hero.eyebrow}</div>
            <h2 style={{ fontFamily: SER, fontStyle: 'italic', margin: '8px 0 0', fontSize: 30, lineHeight: 1.04, fontWeight: 500 }}>{M.hero.title}</h2>
          </div>
        </section>
        <p style={{ fontFamily: SER, fontSize: 18, lineHeight: 1.5, color: C.green, textAlign: 'center',
          margin: '-22px auto 40px', maxWidth: 320 }}>{M.hero.desc}</p>

        {/* CHEF PICKS */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <Label>{M.chefNote}</Label>
            <h3 style={{ fontFamily: SER, margin: '6px 0 0', fontSize: 26, fontWeight: 600 }}>{M.chefLabel}</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {M.chefPicks.map((p, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <Ph label={p.img} h={150} />
                <div style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 13, color: C.brass, marginTop: 10 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ fontFamily: SER, fontSize: 18, fontWeight: 600, lineHeight: 1.15, marginTop: 2 }}>{p.name}</div>
                <div style={{ fontFamily: SAN, fontSize: 12.5, color: C.green, marginTop: 4, letterSpacing: '.04em' }}>{p.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.line}`, padding: '0 2px 12px', marginBottom: 22 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.brass} strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
          <span style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 16, color: C.faint }}>{M.searchPlaceholder}</span>
        </div>

        {/* FILTER CHIPS */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 26 }}>
          {M.filters.map((f, i) => (
            <span key={i} style={{ fontFamily: SAN, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase',
              color: C.green, border: `1px solid ${C.line}`, borderRadius: 0, padding: '7px 14px' }}>{f}</span>
          ))}
        </div>

        {/* CATEGORY TABS */}
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 30,
          paddingBottom: 16, borderBottom: `1px solid ${C.line}` }}>
          {M.categories.map((c, i) => (
            <span key={i} style={{ fontFamily: SER, fontSize: 17, fontStyle: i === 0 ? 'normal' : 'normal',
              fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.green : C.sub,
              borderBottom: i === 0 ? `2px solid ${C.brass}` : 'none', paddingBottom: 2 }}>{c}</span>
          ))}
        </div>

        {/* ITEMS — à la carte leader-dot list */}
        <section>
          {M.items.map((it, i) => (
            <div key={i} style={{ padding: '20px 0', borderBottom: i < M.items.length - 1 ? `1px solid ${C.line}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: SER, fontSize: 21, fontWeight: 600, letterSpacing: '.005em' }}>{it.name}</span>
                <span style={{ flex: 1, borderBottom: `1px dotted ${C.line}`, margin: '0 4px', transform: 'translateY(-5px)' }} />
                <span style={{ fontFamily: SER, fontSize: 20, fontWeight: 600, color: C.green, whiteSpace: 'nowrap' }}>{it.price}</span>
              </div>
              <p style={{ fontFamily: SAN, fontWeight: 300, margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.62, color: C.sub }}>{it.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 11 }}>
                {it.tag && <span style={{ fontFamily: SAN, fontSize: 9.5, letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 500, color: C.brass }}>— {it.tag}</span>}
                <span style={{ fontFamily: SAN, fontSize: 10.5, letterSpacing: '.08em', color: C.faint, marginLeft: 'auto' }}>{it.time}</span>
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '44px 0 46px' }}>
          <span style={{ display: 'inline-block', fontFamily: SER, fontStyle: 'italic', fontSize: 18, color: C.brass }}>✦</span>
          <div style={{ fontFamily: SER, fontSize: 28, fontWeight: 600, letterSpacing: '.02em', marginTop: 10 }}>{M.footer.brand}</div>
          <div style={{ fontFamily: SAN, fontWeight: 300, fontSize: 12.5, color: C.sub, marginTop: 14, lineHeight: 2, letterSpacing: '.04em' }}>
            {M.footer.addr}<br/>{M.footer.hours}<br/>{M.footer.phone}
          </div>
          <p style={{ fontFamily: SER, fontStyle: 'italic', fontSize: 14.5, color: C.green, margin: '22px auto 0', maxWidth: 280, lineHeight: 1.55 }}>{M.footer.note}</p>
          <div style={{ fontFamily: SAN, fontSize: 9, letterSpacing: '.26em', color: C.faint, marginTop: 24 }}>{M.footer.credit}</div>
        </footer>
      </div>
    );
  }

  window.ThemeMaison = ThemeMaison;
})();
