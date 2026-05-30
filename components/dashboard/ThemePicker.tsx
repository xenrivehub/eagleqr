"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { THEMES, type ThemeSpec } from "@/lib/themes";
import { setTheme } from "@/lib/actions/business";

function Preview({ t }: { t: ThemeSpec }) {
  const c = t.colors;
  return (
    <div style={{ background: c.bg, borderRadius: 12, padding: 14, fontFamily: t.fonts.body }}>
      {/* mini header */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 7, letterSpacing: "0.3em", color: c.accent, fontWeight: 600 }}>DİJİTAL MENÜ</div>
        <div style={{ fontFamily: t.fonts.display, fontSize: 18, fontWeight: 700, color: c.ink, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 4 }}>
          Kahve Dünyası
        </div>
      </div>
      {/* mini item card */}
      <div style={{ background: c.surface, border: t.cardBorder, borderRadius: t.radius, boxShadow: t.cardShadow, padding: 10, display: "flex", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: Math.min(t.radius, 10), background: c.surface2, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
            <span style={{ fontFamily: t.fonts.display, fontSize: 12, fontWeight: 700, color: c.ink }}>Flat White</span>
            <span style={t.priceFilled
              ? { background: c.accent, color: c.onAccent, borderRadius: 999, padding: "1px 7px", fontSize: 10, fontWeight: 700 }
              : { color: c.accent, fontSize: 11, fontWeight: 700 }}>₺85</span>
          </div>
          <div style={{ height: 5, background: c.line, borderRadius: 3, marginTop: 7, width: "85%" }} />
          <div style={{ height: 5, background: c.line, borderRadius: 3, marginTop: 4, width: "55%" }} />
        </div>
      </div>
      {/* mini chips */}
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {["Popüler", "Yeni"].map((ch, i) => (
          <span key={ch} style={i === 0 && t.chipFilled
            ? { background: c.accent, color: c.onAccent, borderRadius: 999, padding: "2px 9px", fontSize: 9, fontWeight: 700 }
            : { border: `1px solid ${c.line}`, color: c.sub, borderRadius: 999, padding: "2px 9px", fontSize: 9 }}>{ch}</span>
        ))}
      </div>
    </div>
  );
}

export default function ThemePicker({ current }: { current: string }) {
  const router = useRouter();
  const [active, setActive] = useState(current);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  async function choose(key: string) {
    if (key === active) return;
    setPendingKey(key);
    const res = await setTheme(key);
    setPendingKey(null);
    if (res.success) {
      setActive(key);
      router.refresh();
    }
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {THEMES.map((t) => {
        const isActive = active === t.key;
        const busy = pendingKey === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => choose(t.key)}
            aria-pressed={isActive}
            className={`group cursor-pointer rounded-2xl border-2 p-3 text-left transition-all ${
              isActive ? "border-brand shadow-md" : "border-ink/10 hover:border-ink/25"
            }`}
          >
            <Preview t={t} />
            <div className="mt-3 flex items-start justify-between gap-2 px-1">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-ink">{t.name}</span>
                  {isActive && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-ink">Aktif</span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-ink/55">{t.description}</p>
              </div>
              {busy && <span className="shrink-0 text-xs text-ink/50">…</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
