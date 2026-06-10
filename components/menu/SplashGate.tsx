"use client";

import { useEffect, useState } from "react";

// QR açılış (splash) ekranı — menü öncesi tam ekran karşılama.
// Oturum başına bir kez gösterilir (sessionStorage); "Menüyü Görüntüle" ile kapanır.
export default function SplashGate({
  slug,
  imageUrl,
  videoUrl,
}: {
  slug: string;
  imageUrl: string | null;
  videoUrl: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(`splash:${slug}`)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [slug]);

  if (!open) return null;

  const close = () => {
    try {
      sessionStorage.setItem(`splash:${slug}`, "1");
    } catch {
      /* yoksay */
    }
    setOpen(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#000", overflow: "hidden" }}>
      {videoUrl ? (
        <video
          src={videoUrl}
          poster={imageUrl ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : null}

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.78) 100%)" }} />

      <button
        type="button"
        onClick={close}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "9%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          background: "#fff",
          color: "#111",
          border: "none",
          borderRadius: 999,
          padding: "15px 34px",
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: "0.02em",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          whiteSpace: "nowrap",
        }}
      >
        Menüyü Görüntüle →
      </button>
    </div>
  );
}
