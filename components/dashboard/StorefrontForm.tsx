"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import { updateStorefront } from "@/lib/actions/business";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

type Props = {
  coverUrl: string | null;
  heroOverline: string;
  heroTitle: string;
  heroSubtitle: string;
};

export default function StorefrontForm(initial: Props) {
  const router = useRouter();
  const [coverUrl, setCoverUrl] = useState<string | null>(initial.coverUrl);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("saving");
    const res = await updateStorefront({
      coverUrl,
      heroOverline: String(form.get("heroOverline") ?? ""),
      heroTitle: String(form.get("heroTitle") ?? ""),
      heroSubtitle: String(form.get("heroSubtitle") ?? ""),
    });
    if (res.success) {
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      <ImageUpload value={coverUrl} onChange={setCoverUrl} folder="covers" shape="wide" />

      <div>
        <label htmlFor="ho" className="mb-1.5 block text-sm font-medium text-ink">
          Üst etiket
        </label>
        <input id="ho" name="heroOverline" defaultValue={initial.heroOverline} placeholder="örn. BUGÜN" maxLength={30} className={inputBase} />
      </div>

      <div>
        <label htmlFor="ht" className="mb-1.5 block text-sm font-medium text-ink">
          Başlık
        </label>
        <input id="ht" name="heroTitle" defaultValue={initial.heroTitle} placeholder="örn. Yavaş demlenmiş bir öğleden sonra." maxLength={120} className={inputBase} />
      </div>

      <div>
        <label htmlFor="hs" className="mb-1.5 block text-sm font-medium text-ink">
          Alt metin
        </label>
        <textarea id="hs" name="heroSubtitle" defaultValue={initial.heroSubtitle} rows={2} placeholder="Kısa tanıtım cümlesi" maxLength={240} className={inputBase} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {status === "saving" ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {status === "saved" && <span className="text-sm text-emerald-600">Kaydedildi ✓</span>}
        {status === "error" && <span className="text-sm text-red-600">Bir hata oluştu</span>}
      </div>
    </form>
  );
}
