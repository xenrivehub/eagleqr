"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePricingConfig } from "@/lib/actions/home";
import { PRICING_DEFAULT, type PricingConfig, type PricingTier } from "@/lib/pricing-config";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

function arrMove<T>(a: T[], from: number, to: number): T[] {
  if (to < 0 || to >= a.length) return a;
  const c = [...a]; const [x] = c.splice(from, 1); c.splice(to, 0, x); return c;
}
const emptyTier = (): PricingTier => ({ name: "Yeni plan", tagline: "", monthly: 0, yearlyMonthly: 0, yearlyTotal: 0, features: [], featured: false });

export default function PricingEditor({ initial }: { initial: PricingConfig }) {
  const router = useRouter();
  const [c, setC] = useState<PricingConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (k: keyof PricingConfig) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setC((p) => ({ ...p, [k]: e.target.value }));
  const patchTier = (i: number, p: Partial<PricingTier>) => setC((prev) => ({ ...prev, tiers: prev.tiers.map((t, idx) => (idx === i ? { ...t, ...p } : t)) }));
  const num = (v: string) => Math.max(0, Math.trunc(Number(v) || 0));

  async function save() {
    setError(null); setSaved(false); setSaving(true);
    const res = await savePricingConfig(c);
    setSaving(false);
    if (res.success) { setSaved(true); router.refresh(); } else setError(res.error);
  }

  return (
    <div className="space-y-5">
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}

      <div className="space-y-3 rounded-2xl border border-ink/10 bg-white p-5">
        <div><label className="mb-1 block text-xs font-medium text-ink/60">Başlık</label><input value={c.heading} onChange={setField("heading")} className={inputBase} /></div>
        <div><label className="mb-1 block text-xs font-medium text-ink/60">Alt metin</label><textarea value={c.subtitle} onChange={setField("subtitle")} rows={2} className={inputBase} /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="mb-1 block text-xs font-medium text-ink/60">Yıllık rozet metni</label><input value={c.yearlyBadge} onChange={setField("yearlyBadge")} className={inputBase} /></div>
        </div>
        <div><label className="mb-1 block text-xs font-medium text-ink/60">Alt konumlandırma notu (boşsa gizlenir)</label><textarea value={c.note} onChange={setField("note")} rows={3} className={inputBase} /></div>
      </div>

      {c.tiers.map((t, i) => (
        <div key={i} className={`rounded-2xl border bg-white p-4 ${t.featured ? "border-brand" : "border-ink/10"}`}>
          <header className="mb-3 flex flex-wrap items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => setC((p) => ({ ...p, tiers: arrMove(p.tiers, i, i - 1) }))} className="cursor-pointer px-1 text-ink/40 hover:text-ink">▲</button>
              <button type="button" onClick={() => setC((p) => ({ ...p, tiers: arrMove(p.tiers, i, i + 1) }))} className="cursor-pointer px-1 text-ink/40 hover:text-ink">▼</button>
            </div>
            <input value={t.name} onChange={(e) => patchTier(i, { name: e.target.value })} placeholder="Plan adı" className={`${inputBase} w-40 font-semibold`} />
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-ink/60">
              <input type="checkbox" checked={t.featured} onChange={(e) => patchTier(i, { featured: e.target.checked })} className="h-4 w-4 cursor-pointer accent-brand-dark" />
              En Popüler
            </label>
            <button type="button" onClick={() => setC((p) => ({ ...p, tiers: p.tiers.filter((_, idx) => idx !== i) }))} className="ml-auto cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink/50 hover:bg-red-50 hover:text-red-600">Sil</button>
          </header>
          <div className="space-y-3">
            <div><label className="mb-1 block text-xs font-medium text-ink/60">Slogan</label><input value={t.tagline} onChange={(e) => patchTier(i, { tagline: e.target.value })} className={inputBase} /></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div><label className="mb-1 block text-xs font-medium text-ink/60">Aylık (₺)</label><input inputMode="numeric" value={t.monthly} onChange={(e) => patchTier(i, { monthly: num(e.target.value) })} className={`${inputBase} tabular-nums`} /></div>
              <div><label className="mb-1 block text-xs font-medium text-ink/60">Yıllıkta /ay (₺)</label><input inputMode="numeric" value={t.yearlyMonthly} onChange={(e) => patchTier(i, { yearlyMonthly: num(e.target.value) })} className={`${inputBase} tabular-nums`} /></div>
              <div><label className="mb-1 block text-xs font-medium text-ink/60">Yıl toplamı (₺)</label><input inputMode="numeric" value={t.yearlyTotal} onChange={(e) => patchTier(i, { yearlyTotal: num(e.target.value) })} className={`${inputBase} tabular-nums`} /></div>
            </div>
            <div><label className="mb-1 block text-xs font-medium text-ink/60">Vurgu rozeti (ops. — hediye/lansman notu)</label><input value={t.highlight ?? ""} onChange={(e) => patchTier(i, { highlight: e.target.value || undefined })} className={inputBase} /></div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">Özellikler</label>
              <div className="space-y-1.5">
                {t.features.map((f, fi) => (
                  <div key={fi} className="flex items-center gap-2">
                    <input value={f} onChange={(e) => patchTier(i, { features: t.features.map((x, idx) => (idx === fi ? e.target.value : x)) })} className={inputBase} />
                    <button type="button" onClick={() => patchTier(i, { features: t.features.filter((_, idx) => idx !== fi) })} className="shrink-0 cursor-pointer rounded-lg px-2 py-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => patchTier(i, { features: [...t.features, ""] })} className="cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink hover:bg-ink/5">+ Özellik ekle</button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setC((p) => ({ ...p, tiers: [...p.tiers, emptyTier()] }))} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">+ Plan ekle</button>
        <a href="/" target="_blank" rel="noopener noreferrer" className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">Önizle</a>
        <button type="button" onClick={() => { if (confirm("Fiyatlar varsayılana sıfırlanacak. Emin misiniz?")) setC(PRICING_DEFAULT); }} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/60 hover:bg-ink/5">Varsayılana sıfırla</button>
        <button type="button" onClick={save} disabled={saving} className="ml-auto cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">{saving ? "Kaydediliyor…" : "Kaydet"}</button>
        {saved && <span className="text-sm text-green-700">Kaydedildi ✓</span>}
      </div>
    </div>
  );
}
