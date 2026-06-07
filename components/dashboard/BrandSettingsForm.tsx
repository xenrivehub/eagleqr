"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import { updateBrandInfo } from "@/lib/actions/business";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

export default function BrandSettingsForm({
  name, logoUrl, ratingsEnabled, about,
}: { name: string; logoUrl: string | null; ratingsEnabled: boolean; about: string }) {
  const router = useRouter();
  const [logo, setLogo] = useState<string | null>(logoUrl);
  const [ratings, setRatings] = useState(ratingsEnabled);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    setStatus("saving");
    const res = await updateBrandInfo({
      name: String(f.get("name") ?? ""),
      logoUrl: logo,
      ratingsEnabled: ratings,
      about: String(f.get("about") ?? ""),
    });
    if (res.success) {
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("idle");
      setError(res.error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5">
      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>}

      <div className="max-w-[180px]">
        <ImageUpload value={logo} onChange={setLogo} folder="logos" label="Marka logosu (varsayılan)" />
      </div>

      <div>
        <label htmlFor="brand-name" className="mb-1.5 block text-sm font-medium text-ink">Marka adı <span className="text-red-600">*</span></label>
        <input id="brand-name" name="name" required defaultValue={name} placeholder="Örn. Maison Noir" className={inputBase} />
      </div>

      <div className="rounded-xl border border-ink/10 bg-white p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={ratings} onChange={(e) => setRatings(e.target.checked)} className="mt-0.5 h-4 w-4" />
          <span>
            <span className="block text-sm font-medium text-ink">Müşteri yıldız puanı</span>
            <span className="mt-0.5 block text-xs text-ink/55">Tüm şubelerde geçerli. Açıkken müşteriler ürünlere 1-5 yıldız verebilir (anonim).</span>
          </span>
        </label>
      </div>

      <div>
        <label htmlFor="brand-about" className="mb-1.5 block text-sm font-medium text-ink">Hakkında</label>
        <textarea id="brand-about" name="about" rows={4} defaultValue={about} placeholder="Markanız hakkında kısa bir tanıtım" className={inputBase} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-60">
          {status === "saving" ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {status === "saved" && <span className="text-sm text-emerald-600">Kaydedildi ✓</span>}
      </div>
    </form>
  );
}
