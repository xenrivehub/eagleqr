// Mounts the 5 themed QR-menu mockups side by side on the design canvas.
const W = 400;
// Heights are measured + tuned after first render (see updateHeights pass).
const BOARDS = [
  { id: 'mineral',   label: '1 · Mineral — minimalist',     Comp: window.ThemeMineral,   bg: '#F6F4EF', h: 2334 },
  { id: 'maison',    label: '2 · Maison — lüks editöryel',  Comp: window.ThemeMaison,    bg: '#F1EADC', h: 2566 },
  { id: 'pop',       label: '3 · Citrus Pop — canlı',       Comp: window.ThemePop,       bg: '#FFF6E9', h: 2696 },
  { id: 'terra',     label: '4 · Terra — organik',          Comp: window.ThemeTerra,     bg: '#EBE2D2', h: 2495 },
  { id: 'brutalist', label: '5 · Neue Brutalist — cesur',   Comp: window.ThemeBrutalist, bg: '#E9E6DC', h: 2381 },
];

const BOARDS2 = [
  { id: 'noir',      label: '6 · Noir — modern koyu',        Comp: window.ThemeNoir,      bg: '#14161B', h: 2407 },
  { id: 'pastel',    label: '7 · Soft Pastel — yumuşak',     Comp: window.ThemePastel,    bg: '#FAF5FB', h: 2543 },
  { id: 'retro',     label: '8 · Retro Sun — 70\'ler',       Comp: window.ThemeRetro,     bg: '#F2E3C3', h: 2507 },
  { id: 'botanical', label: '9 · Botanical — adaçayı/spa',   Comp: window.ThemeBotanical, bg: '#EDF1E7', h: 2244 },
  { id: 'editorial', label: '10 · Editorial — dergi',        Comp: window.ThemeEditorial, bg: '#F4F2EB', h: 2287 },
];

function Board(b) {
  return (
    <DCArtboard key={b.id} id={b.id} label={b.label} width={W} height={b.h} style={{ background: b.bg }}>
      <div data-theme-root={b.id} style={{ width: W }}>
        <b.Comp />
      </div>
    </DCArtboard>
  );
}

function App() {
  return (
    <DesignCanvas>
      <DCSection id="qr-menu" title="KAHVE DÜNYASI · QR Menü" subtitle="Aynı ürünler — 5 farklı tema · renk, font ve düzen değişir">
        {BOARDS.map(Board)}
      </DCSection>
      <DCSection id="qr-menu-2" title="Ek 5 Tema" subtitle="İlk beşlikten tamamen farklı yeni yönler">
        {BOARDS2.map(Board)}
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
