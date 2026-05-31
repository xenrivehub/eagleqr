"use client";

import { useRef, useState, type FormEvent } from "react";
import type { AllergenOption, ProductView } from "./types";
import { createProduct, updateProduct, type ProductInput } from "@/lib/actions/menu";
import { generateDescription } from "@/lib/actions/ai";
import type { MediaEntitlements } from "@/lib/plans";
import type { CurrencySpec } from "@/lib/currency";
import ImageUpload from "./ImageUpload";
import MediaUpload from "./MediaUpload";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

export default function ProductForm({
  categoryId,
  allergens,
  product,
  media,
  currency,
  onDone,
}: {
  categoryId: string;
  allergens: AllergenOption[];
  product?: ProductView;
  media: MediaEntitlements;
  currency: CurrencySpec;
  onDone: () => void;
}) {
  const [selected, setSelected] = useState<string[]>(product?.allergenIds ?? []);
  const [imageUrl, setImageUrl] = useState<string | null>(product?.imageUrl ?? null);
  const [videoUrl, setVideoUrl] = useState<string | null>(product?.videoUrl ?? null);
  const [modelGlbUrl, setModelGlbUrl] = useState<string | null>(product?.modelGlbUrl ?? null);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);

  // Kilit/kota durumu: mevcut medyası olan ürün her zaman değiştirebilir
  const videoHas = !!product?.videoUrl;
  const arHas = !!product?.modelGlbUrl;
  const videoLocked = !(media.video.allowed && (videoHas || media.video.remaining > 0));
  const arLocked = !(media.ar.allowed && (arHas || media.ar.remaining > 0));
  const videoReason = !media.video.allowed
    ? "Video yükleme Pro/Max planında. Açtırmak için iletişime geçin."
    : "Video kotanız doldu. Ek hak için iletişime geçin.";
  const arReason = !media.ar.allowed
    ? "AR/3D yükleme Max planında. Açtırmak için iletişime geçin."
    : "AR/3D kotanız doldu. Ek hak için iletişime geçin.";
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isPopular, setIsPopular] = useState(product?.isPopular ?? false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Açıklama (AI önerisi input'a yazabilsin diye kontrollü)
  const [description, setDescription] = useState(product?.description ?? "");
  const nameRef = useRef<HTMLInputElement>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  async function suggestDescription() {
    const name = nameRef.current?.value ?? "";
    setAiError(null);
    setAiText(null);
    if (name.trim().length < 2) {
      setAiError("Önce ürün adını girin.");
      return;
    }
    setAiBusy(true);
    const res = await generateDescription(name, categoryId);
    setAiBusy(false);
    if (res.success) setAiText(res.text);
    else setAiError(res.error);
  }

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const input: ProductInput = {
      name: String(form.get("name") ?? ""),
      price: String(form.get("price") ?? ""),
      description: String(form.get("description") ?? ""),
      calories: String(form.get("calories") ?? ""),
      prepMinutes: String(form.get("prepMinutes") ?? ""),
      categoryId,
      allergenIds: selected,
      imageUrl,
      videoUrl,
      modelGlbUrl,
      isFeatured,
      isNew,
      isPopular,
    };

    setPending(true);
    const result = product
      ? await updateProduct(product.id, input)
      : await createProduct(input);
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

      <ImageUpload value={imageUrl} onChange={setImageUrl} />

      <MediaUpload
        kind="video"
        value={videoUrl}
        onChange={setVideoUrl}
        locked={videoLocked}
        lockedReason={videoReason}
      />

      <MediaUpload
        kind="model"
        value={modelGlbUrl}
        onChange={setModelGlbUrl}
        locked={arLocked}
        lockedReason={arReason}
      />

      <div>
        <label htmlFor="p-name" className="mb-1.5 block text-sm font-medium text-ink">
          Ürün adı <span className="text-red-600">*</span>
        </label>
        <input ref={nameRef} id="p-name" name="name" required defaultValue={product?.name} placeholder="Örn. Latte" className={inputBase} />
      </div>

      <div>
        <label htmlFor="p-price" className="mb-1.5 block text-sm font-medium text-ink">
          Fiyat ({currency.symbol}) <span className="text-red-600">*</span>
        </label>
        <input id="p-price" name="price" required inputMode="decimal" defaultValue={product?.price} placeholder="0,00" className={`${inputBase} tabular-nums`} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor="p-desc" className="block text-sm font-medium text-ink">
            Açıklama
          </label>
          <button
            type="button"
            onClick={suggestDescription}
            disabled={aiBusy}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-brand/50 bg-brand-soft/40 px-3 py-1 text-xs font-semibold text-brand-dark transition-colors hover:bg-brand-soft disabled:opacity-50"
          >
            <span aria-hidden>✨</span>
            {aiBusy ? "Öneriliyor…" : "AI ile açıklama öner"}
          </button>
        </div>

        <textarea
          id="p-desc"
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kısa açıklama"
          className={inputBase}
        />

        {aiError && <p className="mt-1.5 text-xs text-red-600">{aiError}</p>}

        {aiText && (
          <div className="mt-2 rounded-xl border border-brand/40 bg-brand-soft/30 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">✨ AI önerisi</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">{aiText}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => { setDescription(aiText); setAiText(null); }}
                className="cursor-pointer rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-brand-dark"
              >
                Kullan
              </button>
              <button
                type="button"
                onClick={suggestDescription}
                disabled={aiBusy}
                className="cursor-pointer rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5 disabled:opacity-50"
              >
                Yeniden öner
              </button>
              <button
                type="button"
                onClick={() => setAiText(null)}
                className="cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink/60 hover:bg-ink/5"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="p-cal" className="mb-1.5 block text-sm font-medium text-ink">
            Kalori
          </label>
          <input id="p-cal" name="calories" inputMode="numeric" defaultValue={product?.calories ?? ""} placeholder="örn. 180" className={`${inputBase} tabular-nums`} />
        </div>
        <div>
          <label htmlFor="p-prep" className="mb-1.5 block text-sm font-medium text-ink">
            Hazırlık (dk)
          </label>
          <input id="p-prep" name="prepMinutes" inputMode="numeric" defaultValue={product?.prepMinutes ?? ""} placeholder="örn. 10" className={`${inputBase} tabular-nums`} />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Etiketler</legend>
        <div className="flex flex-wrap gap-2">
          {[
            { on: isFeatured, set: setIsFeatured, label: "Şefin Seçimi" },
            { on: isNew, set: setIsNew, label: "Yeni" },
            { on: isPopular, set: setIsPopular, label: "Popüler" },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => b.set((v) => !v)}
              aria-pressed={b.on}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                b.on
                  ? "border-brand bg-brand-soft text-ink"
                  : "border-ink/15 text-ink/60 hover:bg-ink/5"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Alerjenler</legend>
        <div className="flex flex-wrap gap-2">
          {allergens.map((a) => {
            const on = selected.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggle(a.id)}
                aria-pressed={on}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  on
                    ? "border-brand bg-brand-soft text-ink"
                    : "border-ink/15 text-ink/60 hover:bg-ink/5"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onDone} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
          Vazgeç
        </button>
        <button type="submit" disabled={pending} className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Kaydediliyor…" : product ? "Güncelle" : "Ekle"}
        </button>
      </div>
    </form>
  );
}
