"use client";

import { createElement, useEffect, useState } from "react";

// model-viewer web component (GLB) — web'de 360°, mobilde "AR'da gör"
const MV_SRC =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";

export default function ProductMedia({
  videoUrl,
  modelGlbUrl,
  poster,
}: {
  videoUrl: string | null;
  modelGlbUrl: string | null;
  poster: string | null;
}) {
  const [mvReady, setMvReady] = useState(false);

  useEffect(() => {
    if (!modelGlbUrl) return;
    if (customElements.get("model-viewer")) {
      setMvReady(true);
      return;
    }
    let s = document.querySelector<HTMLScriptElement>("script[data-model-viewer]");
    if (!s) {
      s = document.createElement("script");
      s.type = "module";
      s.src = MV_SRC;
      s.dataset.modelViewer = "1";
      document.head.appendChild(s);
    }
    customElements.whenDefined("model-viewer").then(() => setMvReady(true));
  }, [modelGlbUrl]);

  if (!videoUrl && !modelGlbUrl) return null;

  return (
    <section className="mt-5 space-y-4">
      {videoUrl && (
        <div className="overflow-hidden rounded-3xl border border-menu-border bg-black">
          <video
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            poster={poster ?? undefined}
            className="aspect-video w-full"
          />
        </div>
      )}

      {modelGlbUrl && (
        <div className="overflow-hidden rounded-3xl border border-menu-border bg-menu-surface">
          <div className="flex items-center justify-between px-4 pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-menu-gold">
              ✦ 3D / AR
            </span>
            <span className="text-xs text-menu-muted">Döndür · yakınlaştır · “AR’da gör”</span>
          </div>
          {mvReady ? (
            createElement("model-viewer", {
              src: modelGlbUrl,
              ar: true,
              "ar-modes": "webxr scene-viewer quick-look",
              "camera-controls": true,
              "touch-action": "pan-y",
              "shadow-intensity": "1",
              autoplay: true,
              poster: poster ?? undefined,
              style: { width: "100%", height: "380px", background: "transparent" },
            })
          ) : (
            <div className="flex h-[380px] items-center justify-center text-sm text-menu-muted">
              3D model yükleniyor…
            </div>
          )}
        </div>
      )}
    </section>
  );
}
