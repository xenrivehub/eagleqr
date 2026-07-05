"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="tr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f4f2eb", color: "#1a1a1a" }}>
        <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <div style={{ maxWidth: 420 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px" }}>Bir şeyler ters gitti</h1>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b6b6b", margin: "0 0 20px" }}>
              Beklenmeyen bir hata oluştu. Ekibimiz bilgilendirildi. Lütfen sayfayı yenileyin.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ cursor: "pointer", background: "#1a1a1a", color: "#fff", border: "none", fontWeight: 600, fontSize: 14, padding: "11px 22px", borderRadius: 10 }}
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
