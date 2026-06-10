"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/track";

// model-viewer (GLB) — buton "Masamda Görüntüle" ile AR başlatır.
// Sayfada 360° kutu gösterilmez; model-viewer görünmez tutulur, yalnızca AR için.
const MV_SRC =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";

export default function ProductAr({
  src,
  poster,
  label,
  businessId,
  productId,
  menuId,
}: {
  src: string;
  poster: string | null;
  label: string;
  businessId: string;
  productId: string;
  menuId?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (customElements.get("model-viewer")) {
      setReady(true);
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
    customElements.whenDefined("model-viewer").then(() => setReady(true));
  }, []);

  function launch() {
    trackEvent({ businessId, type: "AR_OPEN", productId, menuId });
    const mv = ref.current as unknown as { activateAR?: () => Promise<void> } | null;
    if (mv?.activateAR) mv.activateAR().catch(() => {});
  }

  return (
    <>
      {ready &&
        createElement("model-viewer", {
          ref,
          src,
          ar: true,
          "ar-modes": "webxr scene-viewer quick-look",
          // Modeli GLB'deki gerçek-dünya boyutuna sabitler; kullanıcı pinch ile
          // ölçek değiştiremez. (Doğru görünmesi için GLB metre biriminde olmalı.)
          "ar-scale": "fixed",
          loading: "eager",
          reveal: "auto",
          poster: poster ?? undefined,
          // Görünmez ama DOM'da — AR tetiklenebilsin diye
          style: {
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          },
        })}

      <button
        type="button"
        onClick={launch}
        style={{
          background: "var(--color-menu-gold)",
          color: "var(--color-menu-on-accent)",
          boxShadow: "0 6px 18px -4px var(--color-menu-gold)",
        }}
        className="inline-flex animate-pulse items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-transform hover:scale-105 hover:animate-none active:scale-95"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10" />
        </svg>
        {label}
      </button>
    </>
  );
}
