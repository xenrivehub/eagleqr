"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrCode({
  path,
  businessName,
  slug,
}: {
  path: string;
  businessName: string;
  slug: string;
}) {
  const [url, setUrl] = useState("");
  const [pngUrl, setPngUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const full = `${window.location.origin}${path}`;
    setUrl(full);

    const opts = {
      width: 600,
      margin: 2,
      color: { dark: "#140d08", light: "#ffffff" },
    } as const;

    QRCode.toDataURL(full, opts).then(setPngUrl).catch(() => {});
    QRCode.toString(full, { ...opts, type: "svg" }).then(setSvg).catch(() => {});
  }, [path]);

  function download(href: string, ext: string) {
    const a = document.createElement("a");
    a.href = href;
    a.download = `${slug}-menu-qr.${ext}`;
    a.click();
  }

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
      <div className="flex flex-col items-center">
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          {pngUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pngUrl} alt="Menü QR kodu" className="h-56 w-56" />
          ) : (
            <div className="h-56 w-56 animate-pulse rounded-lg bg-ink/5" />
          )}
        </div>
        <p className="mt-3 font-display text-sm font-semibold text-ink">
          {businessName}
        </p>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Menü QR Kodu</h2>
        <p className="mt-1 text-sm text-ink/60">
          Bu kodu masalara koyun; müşteriler okutunca menünüz açılır.
        </p>

        <div className="mt-4 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5">
          <p className="break-all text-sm text-ink/70">{url || "…"}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => download(pngUrl, "png")}
            disabled={!pngUrl}
            className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            PNG indir
          </button>
          <button
            type="button"
            onClick={() => download(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, "svg")}
            disabled={!svg}
            className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 disabled:opacity-50"
          >
            SVG indir
          </button>
          <button
            type="button"
            onClick={copy}
            className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            {copied ? "Kopyalandı ✓" : "Linki kopyala"}
          </button>
          <a
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            Menüyü aç ↗
          </a>
        </div>
      </div>
    </div>
  );
}
