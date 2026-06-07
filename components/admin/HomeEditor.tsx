"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveHomeSections } from "@/lib/actions/home";
import {
  defaultHomeSections, HOME_SECTION_META, HOME_SECTION_ORDER,
  type HomeSection, type HomeSectionType, type HomeItem,
} from "@/lib/home-sections";
import NavIcon, { NAV_ICON_NAMES } from "@/components/site/NavIcon";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

const uid = () => "s_" + Math.random().toString(36).slice(2, 9);
function arrMove<T>(a: T[], from: number, to: number): T[] {
  if (to < 0 || to >= a.length) return a;
  const c = [...a]; const [x] = c.splice(from, 1); c.splice(to, 0, x); return c;
}

function emptySection(type: HomeSectionType): HomeSection {
  const base: HomeSection = { id: uid(), type, enabled: true };
  switch (type) {
    case "hero": return { ...base, badge: "", titleLead: "Başlık", titleAccent: "", subtitle: "", primaryLabel: "Ücretsiz Dene", primaryHref: "/register", secondaryLabel: "Nasıl Çalışır?", secondaryHref: "#nasil-calisir", bullets: [], chip1: "", chip2: "" };
    case "stats": return { ...base, items: [{ value: "10", suffix: "", label: "Etiket" }] };
    case "steps": return { ...base, overline: "Nasıl Çalışır", heading: "Başlık", subtitle: "", items: [{ no: "01", title: "Adım", desc: "" }] };
    case "features": return { ...base, overline: "Özellikler", heading: "Başlık", items: [{ icon: "Sparkles", title: "Özellik", desc: "" }] };
    case "pricing": return { ...base };
    case "faq": return { ...base, overline: "SSS", heading: "Sıkça Sorulan Sorular", items: [{ q: "Soru?", a: "Cevap." }] };
    case "cta": return { ...base, ctaLead: "Başlık", ctaAccent: "", ctaTail: "", subtitle: "", primaryLabel: "Ücretsiz Başla", primaryHref: "/register", secondaryLabel: "İşletme Girişi", secondaryHref: "/login" };
  }
}

function Field({ label, value, onChange, textarea }: { label: string; value?: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink/60">{label}</label>
      {textarea
        ? <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} className={inputBase} />
        : <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputBase} />}
    </div>
  );
}

function IconSelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/15 text-brand-dark">
        {value ? <NavIcon name={value} size={18} /> : <span className="text-xs text-ink/30">—</span>}
      </span>
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={`${inputBase} w-32`}>
        <option value="">İkon</option>
        {NAV_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </span>
  );
}

type ItemField = { key: keyof HomeItem; label: string; icon?: boolean; textarea?: boolean };

function ItemsEditor({ items, onChange, fields }: { items: HomeItem[]; onChange: (items: HomeItem[]) => void; fields: ItemField[] }) {
  const upd = (i: number, key: keyof HomeItem, v: string) => onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-2 rounded-xl border border-ink/10 p-2.5">
          <div className="flex flex-col gap-0.5 pt-1">
            <button type="button" onClick={() => onChange(arrMove(items, i, i - 1))} className="cursor-pointer px-1 text-xs text-ink/40 hover:text-ink">▲</button>
            <button type="button" onClick={() => onChange(arrMove(items, i, i + 1))} className="cursor-pointer px-1 text-xs text-ink/40 hover:text-ink">▼</button>
          </div>
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            {fields.map((f) => f.icon ? (
              <IconSelect key={String(f.key)} value={it[f.key] as string} onChange={(v) => upd(i, f.key, v)} />
            ) : f.textarea ? (
              <textarea key={String(f.key)} value={(it[f.key] as string) ?? ""} onChange={(e) => upd(i, f.key, e.target.value)} placeholder={f.label} rows={2} className={`${inputBase} sm:col-span-2`} />
            ) : (
              <input key={String(f.key)} value={(it[f.key] as string) ?? ""} onChange={(e) => upd(i, f.key, e.target.value)} placeholder={f.label} className={inputBase} />
            ))}
          </div>
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="shrink-0 cursor-pointer rounded-lg px-2 py-2 text-ink/40 hover:bg-red-50 hover:text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, {}])} className="cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink hover:bg-ink/5">+ Öğe ekle</button>
    </div>
  );
}

function BulletsEditor({ bullets, onChange }: { bullets: string[]; onChange: (b: string[]) => void }) {
  return (
    <div className="space-y-1.5">
      {bullets.map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <input value={b} onChange={(e) => onChange(bullets.map((x, idx) => (idx === i ? e.target.value : x)))} className={inputBase} />
          <button type="button" onClick={() => onChange(bullets.filter((_, idx) => idx !== i))} className="shrink-0 cursor-pointer rounded-lg px-2 py-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...bullets, ""])} className="cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink hover:bg-ink/5">+ Madde ekle</button>
    </div>
  );
}

function SectionFields({ s, patch }: { s: HomeSection; patch: (p: Partial<HomeSection>) => void }) {
  switch (s.type) {
    case "hero":
      return (<>
        <Field label="Rozet (üst etiket)" value={s.badge} onChange={(v) => patch({ badge: v })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Başlık (ilk kısım)" value={s.titleLead} onChange={(v) => patch({ titleLead: v })} />
          <Field label="Başlık vurgusu (renkli)" value={s.titleAccent} onChange={(v) => patch({ titleAccent: v })} />
        </div>
        <Field label="Alt metin" value={s.subtitle} onChange={(v) => patch({ subtitle: v })} textarea />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Ana buton metni" value={s.primaryLabel} onChange={(v) => patch({ primaryLabel: v })} />
          <Field label="Ana buton linki" value={s.primaryHref} onChange={(v) => patch({ primaryHref: v })} />
          <Field label="İkinci buton metni" value={s.secondaryLabel} onChange={(v) => patch({ secondaryLabel: v })} />
          <Field label="İkinci buton linki" value={s.secondaryHref} onChange={(v) => patch({ secondaryHref: v })} />
        </div>
        <div><label className="mb-1 block text-xs font-medium text-ink/60">Maddeler (✓)</label><BulletsEditor bullets={s.bullets ?? []} onChange={(b) => patch({ bullets: b })} /></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Rozet 1 (görsel üstü)" value={s.chip1} onChange={(v) => patch({ chip1: v })} />
          <Field label="Rozet 2 (görsel üstü)" value={s.chip2} onChange={(v) => patch({ chip2: v })} />
        </div>
      </>);
    case "stats":
      return <ItemsEditor items={s.items ?? []} onChange={(items) => patch({ items })} fields={[{ key: "prefix", label: "Ön ek (%, <)" }, { key: "value", label: "Değer (10, 1.5)" }, { key: "suffix", label: "Son ek (dk, dil)" }, { key: "label", label: "Etiket" }]} />;
    case "steps":
      return (<>
        <Field label="Üst etiket" value={s.overline} onChange={(v) => patch({ overline: v })} />
        <Field label="Başlık" value={s.heading} onChange={(v) => patch({ heading: v })} />
        <Field label="Alt metin" value={s.subtitle} onChange={(v) => patch({ subtitle: v })} textarea />
        <ItemsEditor items={s.items ?? []} onChange={(items) => patch({ items })} fields={[{ key: "no", label: "No (01)" }, { key: "title", label: "Başlık" }, { key: "desc", label: "Açıklama", textarea: true }]} />
      </>);
    case "features":
      return (<>
        <Field label="Üst etiket" value={s.overline} onChange={(v) => patch({ overline: v })} />
        <Field label="Başlık" value={s.heading} onChange={(v) => patch({ heading: v })} />
        <ItemsEditor items={s.items ?? []} onChange={(items) => patch({ items })} fields={[{ key: "icon", label: "İkon", icon: true }, { key: "title", label: "Başlık" }, { key: "desc", label: "Açıklama", textarea: true }]} />
      </>);
    case "pricing":
      return <p className="text-sm text-ink/55">Bu bölüm fiyat kartlarını gösterir. İçeriği (plan adları, fiyatlar, özellikler) <strong>Fiyatlandırma</strong> sayfasından düzenlenir. Buradan yalnızca sırasını/görünürlüğünü ayarlarsın.</p>;
    case "faq":
      return (<>
        <Field label="Üst etiket" value={s.overline} onChange={(v) => patch({ overline: v })} />
        <Field label="Başlık" value={s.heading} onChange={(v) => patch({ heading: v })} />
        <ItemsEditor items={s.items ?? []} onChange={(items) => patch({ items })} fields={[{ key: "q", label: "Soru" }, { key: "a", label: "Cevap", textarea: true }]} />
      </>);
    case "cta":
      return (<>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Başlık (ilk)" value={s.ctaLead} onChange={(v) => patch({ ctaLead: v })} />
          <Field label="Vurgu (renkli)" value={s.ctaAccent} onChange={(v) => patch({ ctaAccent: v })} />
          <Field label="Başlık (son)" value={s.ctaTail} onChange={(v) => patch({ ctaTail: v })} />
        </div>
        <Field label="Alt metin" value={s.subtitle} onChange={(v) => patch({ subtitle: v })} textarea />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Ana buton metni" value={s.primaryLabel} onChange={(v) => patch({ primaryLabel: v })} />
          <Field label="Ana buton linki" value={s.primaryHref} onChange={(v) => patch({ primaryHref: v })} />
          <Field label="İkinci buton metni" value={s.secondaryLabel} onChange={(v) => patch({ secondaryLabel: v })} />
          <Field label="İkinci buton linki" value={s.secondaryHref} onChange={(v) => patch({ secondaryHref: v })} />
        </div>
      </>);
  }
}

export default function HomeEditor({ initial }: { initial: HomeSection[] }) {
  const router = useRouter();
  const [sections, setSections] = useState<HomeSection[]>(initial);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = (i: number, p: Partial<HomeSection>) => setSections((a) => a.map((s, idx) => (idx === i ? { ...s, ...p } : s)));

  async function save() {
    setError(null); setSaved(false); setSaving(true);
    const res = await saveHomeSections(sections);
    setSaving(false);
    if (res.success) { setSaved(true); router.refresh(); } else setError(res.error);
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setAdding((v) => !v)} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">+ Bölüm ekle</button>
        <a href="/" target="_blank" rel="noopener noreferrer" className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">Önizle</a>
        <button type="button" onClick={() => { if (confirm("Tüm bölümler varsayılana sıfırlanacak. Emin misiniz?")) setSections(defaultHomeSections()); }} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/60 hover:bg-ink/5">Varsayılana sıfırla</button>
        <button type="button" onClick={save} disabled={saving} className="ml-auto cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">{saving ? "Kaydediliyor…" : "Kaydet"}</button>
        {saved && <span className="text-sm text-green-700">Kaydedildi ✓</span>}
      </div>

      {adding && (
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <p className="mb-2 text-sm font-medium text-ink">Eklemek istediğin bölüm:</p>
          <div className="flex flex-wrap gap-2">
            {HOME_SECTION_ORDER.map((t) => (
              <button key={t} type="button" title={HOME_SECTION_META[t].desc} onClick={() => { setSections((a) => [...a, emptySection(t)]); setAdding(false); }} className="cursor-pointer rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-soft">+ {HOME_SECTION_META[t].label}</button>
            ))}
          </div>
        </div>
      )}

      {sections.map((s, i) => (
        <div key={s.id} className={`rounded-2xl border bg-white p-4 ${s.enabled === false ? "border-ink/10 opacity-60" : "border-ink/10"}`}>
          <header className="mb-3 flex flex-wrap items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => setSections((a) => arrMove(a, i, i - 1))} className="cursor-pointer px-1 text-ink/40 hover:text-ink">▲</button>
              <button type="button" onClick={() => setSections((a) => arrMove(a, i, i + 1))} className="cursor-pointer px-1 text-ink/40 hover:text-ink">▼</button>
            </div>
            <span className="font-display text-base font-semibold text-ink">{HOME_SECTION_META[s.type].label}</span>
            <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-ink/60">
              <input type="checkbox" checked={s.enabled !== false} onChange={(e) => patch(i, { enabled: e.target.checked })} className="h-4 w-4 cursor-pointer accent-brand-dark" />
              Görünür
            </label>
            <button type="button" onClick={() => setSections((a) => a.filter((_, idx) => idx !== i))} className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink/50 hover:bg-red-50 hover:text-red-600">Sil</button>
          </header>
          <div className="space-y-3">
            <SectionFields s={s} patch={(p) => patch(i, p)} />
          </div>
        </div>
      ))}
    </div>
  );
}
