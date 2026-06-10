"use client";

import { useState, type FormEvent } from "react";
import type { CategoryView } from "./types";
import { createCategory, updateCategory } from "@/lib/actions/menu";
import ImageUpload from "./ImageUpload";
import MediaUpload from "./MediaUpload";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

export default function CategoryForm({
  menuId,
  category,
  campaigns,
  campaignsEnabled = true,
  videoAllowed = false,
  onDone,
}: {
  menuId: string;
  category?: CategoryView;
  campaigns: { id: string; label: string; color: string }[];
  campaignsEnabled?: boolean;
  videoAllowed?: boolean;
  onDone: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [availStart, setAvailStart] = useState(category?.availStart ?? "");
  const [availEnd, setAvailEnd] = useState(category?.availEnd ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(category?.imageUrl ?? null);
  const [videoUrl, setVideoUrl] = useState<string | null>(category?.videoUrl ?? null);
  const [campaignId, setCampaignId] = useState<string | null>(category?.campaignId ?? null);
  const [cStart, setCStart] = useState(category?.campaignStart ?? "");
  const [cEnd, setCEnd] = useState(category?.campaignEnd ?? "");
  const [cDateStart, setCDateStart] = useState(category?.campaignDateStart ?? "");
  const [cDateEnd, setCDateEnd] = useState(category?.campaignDateEnd ?? "");
  const [cDiscType, setCDiscType] = useState(category?.campaignDiscType ?? "percent");
  const [cDiscValue, setCDiscValue] = useState(category?.campaignDiscValue ?? "");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const description = String(fd.get("description") ?? "");

    const input = {
      name,
      description: description || null,
      imageUrl,
      videoUrl,
      availStart: availStart || null,
      availEnd: availEnd || null,
      campaignId,
      campaignStart: campaignId ? cStart || null : null,
      campaignEnd: campaignId ? cEnd || null : null,
      campaignDateStart: campaignId ? cDateStart || null : null,
      campaignDateEnd: campaignId ? cDateEnd || null : null,
      campaignDiscType: campaignId ? cDiscType : null,
      campaignDiscValue: campaignId ? cDiscValue || null : null,
    };

    setPending(true);
    const result = category
      ? await updateCategory(category.id, input)
      : await createCategory(menuId, input);
    if (!result.success) {
      setError(result.error);
      setPending(false);
      return;
    }
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-ink">
          Kategori adı <span className="text-red-600">*</span>
        </label>
        <input
          id="c-name"
          name="name"
          required
          defaultValue={category?.name}
          placeholder="Örn. Sıcak İçecekler"
          className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
        />
      </div>

      <div>
        <label htmlFor="c-desc" className="mb-1.5 block text-sm font-medium text-ink">
          Açıklama (opsiyonel)
        </label>
        <textarea
          id="c-desc"
          name="description"
          defaultValue={category?.description ?? ""}
          rows={2}
          maxLength={240}
          placeholder="Örn. Güne enerjik başlamanız için doyurucu seçenekler."
          className={inputBase}
        />
        <p className="mt-1 text-xs text-ink/45">Kategori kartının üstünde görünür (resimdeki gibi).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUpload value={imageUrl} onChange={setImageUrl} folder="covers" shape="wide" label="Kategori görseli (opsiyonel)" />
        <MediaUpload
          kind="video"
          value={videoUrl}
          onChange={setVideoUrl}
          locked={!videoAllowed}
          lockedReason="Kategori videosu için video özelliği (Pro/Max) gerekir."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Servis saatleri (opsiyonel)</label>
        <div className="flex items-center gap-2">
          <input type="time" value={availStart} onChange={(e) => setAvailStart(e.target.value)} className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm" />
          <span className="text-ink/40">–</span>
          <input type="time" value={availEnd} onChange={(e) => setAvailEnd(e.target.value)} className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm" />
        </div>
        <p className="mt-1 text-xs text-ink/45">Bu kategori sadece bu saatler arasında müşteriye görünür (örn. kahvaltı 07:00–11:00). Boşsa hep açık.</p>
      </div>

      {campaignsEnabled && (
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Kategori kampanyası (opsiyonel)</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setCampaignId(null)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium ${campaignId === null ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink/60 hover:bg-ink/5"}`}>
            Yok
          </button>
          {campaigns.map((c) => {
            const on = campaignId === c.id;
            return (
              <button key={c.id} type="button" onClick={() => setCampaignId(c.id)} className="cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold"
                style={on ? { background: c.color, color: "#fff", borderColor: c.color } : { borderColor: c.color, color: c.color }}>
                {c.label}
              </button>
            );
          })}
        </div>

        {campaignId && (
          <div className="mt-3 grid gap-3 rounded-xl border border-ink/10 bg-cream/50 p-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">İndirim</label>
              <div className="flex gap-2">
                <select value={cDiscType} onChange={(e) => setCDiscType(e.target.value)} className={`${inputBase} w-28`}>
                  <option value="percent">Yüzde %</option>
                  <option value="fixed">Sabit tutar</option>
                </select>
                <input inputMode="decimal" value={cDiscValue} onChange={(e) => setCDiscValue(e.target.value)} placeholder={cDiscType === "percent" ? "10" : "20"} className={`${inputBase} w-24 tabular-nums`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60">Saat başlangıç</label>
                <input type="time" value={cStart} onChange={(e) => setCStart(e.target.value)} className={inputBase} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink/60">Saat bitiş</label>
                <input type="time" value={cEnd} onChange={(e) => setCEnd(e.target.value)} className={inputBase} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">Tarih başlangıç</label>
              <input type="date" value={cDateStart} onChange={(e) => setCDateStart(e.target.value)} className={inputBase} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink/60">Tarih bitiş</label>
              <input type="date" value={cDateEnd} onChange={(e) => setCDateEnd(e.target.value)} className={inputBase} />
            </div>
            <p className="text-xs text-ink/45 sm:col-span-2">
              Aktifken bu kategorideki tüm ürünlerde rozet + indirimli fiyat görünür. Saat/tarih boşsa hep aktif.
              (Ürünün kendi kampanyası varsa o öncelikli.)
            </p>
          </div>
        )}
      </fieldset>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onDone} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
          Vazgeç
        </button>
        <button type="submit" disabled={pending} className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Kaydediliyor…" : category ? "Güncelle" : "Ekle"}
        </button>
      </div>
    </form>
  );
}
