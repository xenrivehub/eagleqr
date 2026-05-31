"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

const DARK_COLORS = ["#140d08", "#000000", "#1a3a2a", "#7c2d12", "#1e3a8a", "#831843"];
const FRAMES = [
  { key: "none", label: "Yok" },
  { key: "frame", label: "Çerçeve" },
  { key: "ticket", label: "Bilet" },
] as const;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function QrCode({
  path,
  businessName,
  slug,
  logoUrl,
}: {
  path: string;
  businessName: string;
  slug: string;
  logoUrl: string | null;
}) {
  const [url, setUrl] = useState("");
  const [pngUrl, setPngUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [logoNote, setLogoNote] = useState(false);

  // özelleştirme
  const [dark, setDark] = useState(DARK_COLORS[0]);
  const [light, setLight] = useState("#ffffff");
  const [frame, setFrame] = useState<(typeof FRAMES)[number]["key"]>("frame");
  const [cta, setCta] = useState("MENÜ İÇİN OKUT");
  const [showLogo, setShowLogo] = useState(!!logoUrl);

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
  }, [path]);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    async function build(includeLogo: boolean): Promise<string> {
      const qrSize = 600;
      const pad = frame === "none" ? 28 : 56;
      const labelH = cta.trim() ? 78 : 0;
      const W = qrSize + pad * 2;
      const H = qrSize + pad * 2 + labelH;
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d")!;

      ctx.fillStyle = light;
      roundRect(ctx, 0, 0, W, H, frame === "none" ? 0 : 30);
      ctx.fill();

      if (frame === "frame" || frame === "ticket") {
        ctx.lineWidth = 9;
        ctx.strokeStyle = dark;
        roundRect(ctx, 9, 9, W - 18, H - 18, 22);
        ctx.stroke();
      }
      if (frame === "ticket" && labelH) {
        // alt etiket bandı
        ctx.fillStyle = dark;
        roundRect(ctx, 9, H - labelH - 9, W - 18, labelH, 18);
        ctx.fill();
      }

      const qc = document.createElement("canvas");
      await QRCode.toCanvas(qc, url, {
        width: qrSize,
        margin: 1,
        color: { dark, light },
        errorCorrectionLevel: includeLogo ? "H" : "M",
      });
      ctx.drawImage(qc, pad, pad);

      if (includeLogo && logoUrl) {
        const img = await loadImg(logoUrl);
        const ls = qrSize * 0.2;
        const lx = pad + qrSize / 2 - ls / 2;
        const ly = pad + qrSize / 2 - ls / 2;
        ctx.fillStyle = light;
        roundRect(ctx, lx - 9, ly - 9, ls + 18, ls + 18, 16);
        ctx.fill();
        ctx.save();
        roundRect(ctx, lx, ly, ls, ls, 12);
        ctx.clip();
        ctx.drawImage(img, lx, ly, ls, ls);
        ctx.restore();
      }

      if (labelH) {
        ctx.fillStyle = frame === "ticket" ? light : dark;
        ctx.font = "bold 32px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cta.trim().toUpperCase(), W / 2, H - pad - labelH / 2 + (frame === "ticket" ? 0 : 8));
      }

      return c.toDataURL("image/png");
    }

    (async () => {
      setLogoNote(false);
      try {
        const data = await build(showLogo);
        if (!cancelled) setPngUrl(data);
      } catch {
        // logo CORS taint vb. → logosuz dene
        try {
          const data = await build(false);
          if (!cancelled) {
            setPngUrl(data);
            if (showLogo) setLogoNote(true);
          }
        } catch {
          /* yoksay */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url, dark, light, frame, cta, showLogo, logoUrl]);

  function downloadPng() {
    if (!pngUrl) return;
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `${slug}-menu-qr.png`;
    a.click();
  }

  async function downloadSvg() {
    const svg = await QRCode.toString(url, { type: "svg", margin: 1, color: { dark, light } });
    const a = document.createElement("a");
    a.href = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    a.download = `${slug}-menu-qr.svg`;
    a.click();
  }

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const swatch = "h-8 w-8 cursor-pointer rounded-full border-2 transition-transform hover:scale-110";

  return (
    <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
      {/* Önizleme */}
      <div className="flex flex-col items-center">
        <div className="rounded-2xl border border-ink/10 bg-cream/40 p-4">
          {pngUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pngUrl} alt="Menü QR kodu" className="h-64 w-64 object-contain" />
          ) : (
            <div className="h-64 w-64 animate-pulse rounded-lg bg-ink/5" />
          )}
        </div>
        <p className="mt-3 font-display text-sm font-semibold text-ink">{businessName}</p>
        {logoNote && <p className="mt-1 max-w-56 text-center text-xs text-amber-600">Logo görsel erişimi (CORS) nedeniyle eklenemedi.</p>}
      </div>

      {/* Ayarlar */}
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Menü QR Kodu</h2>
        <p className="mt-1 text-sm text-ink/60">Tasarımı özelleştirin, masalara koyun.</p>

        <div className="mt-4 space-y-4">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink">QR rengi</span>
            <div className="flex flex-wrap gap-2">
              {DARK_COLORS.map((col) => (
                <button key={col} type="button" onClick={() => setDark(col)} aria-label={col} className={`${swatch} ${dark === col ? "border-ink" : "border-transparent"}`} style={{ background: col }} />
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink">Arka plan</span>
            <div className="flex gap-2">
              {[["#ffffff", "Beyaz"], ["#faf7f2", "Krem"]].map(([col, lbl]) => (
                <button key={col} type="button" onClick={() => setLight(col)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold ${light === col ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink/60 hover:bg-ink/5"}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink">Çerçeve</span>
            <div className="flex gap-2">
              {FRAMES.map((f) => (
                <button key={f.key} type="button" onClick={() => setFrame(f.key)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold ${frame === f.key ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink/60 hover:bg-ink/5"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="qr-cta" className="mb-1.5 block text-sm font-medium text-ink">Alt yazı</label>
            <input id="qr-cta" value={cta} onChange={(e) => setCta(e.target.value)} maxLength={28} placeholder="MENÜ İÇİN OKUT" className="w-full max-w-xs rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark" />
          </div>

          {logoUrl && (
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
              <input type="checkbox" checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} className="h-4 w-4" />
              Ortaya logo ekle
            </label>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5">
          <p className="break-all text-sm text-ink/70">{url || "…"}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button type="button" onClick={downloadPng} disabled={!pngUrl} className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50">
            PNG indir
          </button>
          <button type="button" onClick={downloadSvg} disabled={!url} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 disabled:opacity-50">
            SVG indir
          </button>
          <button type="button" onClick={copy} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5">
            {copied ? "Kopyalandı ✓" : "Linki kopyala"}
          </button>
          <a href={path} target="_blank" rel="noopener noreferrer" className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5">
            Menüyü aç ↗
          </a>
        </div>
      </div>
    </div>
  );
}
