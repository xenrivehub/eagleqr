"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setBusinessSeo } from "@/lib/actions/admin";

export type SeoBusiness = {
  id: string;
  name: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

export default function SeoManager({ businesses }: { businesses: SeoBusiness[] }) {
  const router = useRouter();
  const [id, setId] = useState(businesses[0]?.id ?? "");
  const current = businesses.find((b) => b.id === id);
  const [title, setTitle] = useState(current?.seoTitle ?? "");
  const [description, setDescription] = useState(current?.seoDescription ?? "");
  const [keywords, setKeywords] = useState(current?.seoKeywords ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function pick(bid: string) {
    setId(bid);
    const b = businesses.find((x) => x.id === bid);
    setTitle(b?.seoTitle ?? "");
    setDescription(b?.seoDescription ?? "");
    setKeywords(b?.seoKeywords ?? "");
    setMsg(null);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await setBusinessSeo(id, { title, description, keywords });
    setSaving(false);
    if (res.success) {
      setMsg("Kaydedildi ✓");
      router.refresh();
    } else setMsg(res.error);
  }

  if (businesses.length === 0) {
    return <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center text-ink/60">Henüz işletme yok.</p>;
  }

  const defTitle = current ? `${current.name} — Menü | Dijital QR Menü` : "";
  const defDesc = current ? `${current.name} dijital menüsü. QR ile açın; güncel fiyatlar, fotoğraflı ürünler, alerjen bilgisi ve çok dilli menü.` : "";
  // canlı önizleme değerleri
  const pTitle = (title || defTitle).slice(0, 60);
  const pDesc = (description || defDesc).slice(0, 160);

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">İşletme</label>
        <select value={id} onChange={(e) => pick(e.target.value)} className={`${inputCls} max-w-md`}>
          {businesses.map((b) => (
            <option key={b.id} value={b.id}>{b.name} (/m/{b.slug})</option>
          ))}
        </select>
      </div>

      {/* Google snippet önizleme */}
      <div className="rounded-2xl border border-ink/10 bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">Arama sonucu önizleme</p>
        <div className="text-xs text-emerald-700">eagleqr.com › m › {current?.slug}</div>
        <div className="mt-0.5 text-lg text-blue-700">{pTitle}</div>
        <div className="text-sm text-ink/60">{pDesc}</div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Başlık (title)</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={defTitle} className={inputCls} maxLength={70} />
        <p className="mt-1 text-xs text-ink/45">{(title || defTitle).length}/60 karakter önerilir. Boşsa otomatik üretilir.</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Açıklama (description)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder={defDesc} className={inputCls} maxLength={200} />
        <p className="mt-1 text-xs text-ink/45">{(description || defDesc).length}/160 karakter önerilir.</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Anahtar kelimeler</label>
        <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="qr menü, dijital menü, kafe, restoran" className={inputCls} />
        <p className="mt-1 text-xs text-ink/45">Virgülle ayırın.</p>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" disabled={saving} onClick={save} className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {msg && <span className="text-sm text-emerald-600">{msg}</span>}
      </div>
    </div>
  );
}
