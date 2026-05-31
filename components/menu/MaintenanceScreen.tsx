import type { ThemeSpec } from "@/lib/themes";

export default function MaintenanceScreen({
  theme,
  name,
  logoUrl,
  title,
  message,
}: {
  theme: ThemeSpec;
  name: string;
  logoUrl: string | null;
  title: string;
  message: string;
}) {
  const c = theme.colors;
  return (
    <div style={{ minHeight: "100dvh", background: c.bg, color: c.ink, fontFamily: theme.fonts.body, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" style={{ width: 72, height: 72, borderRadius: 999, objectFit: "cover", margin: "0 auto 20px", display: "block", border: `1px solid ${c.line}` }} />
        )}
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔧</div>
        <h1 style={{ fontFamily: theme.fonts.display, fontSize: 26, fontWeight: 700, margin: "0 0 10px" }}>{title}</h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: c.sub, margin: 0 }}>{message}</p>
        <div style={{ marginTop: 28, fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: c.accent }}>{name}</div>
      </div>
    </div>
  );
}
