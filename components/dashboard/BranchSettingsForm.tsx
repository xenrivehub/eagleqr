"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import { updateBranchSettings } from "@/lib/actions/business";
import type { CurrencySpec } from "@/lib/currency";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

const SOCIALS: { key: string; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@..." },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/..." },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@..." },
  { key: "website", label: "Web sitesi", placeholder: "https://..." },
];

type Props = {
  menuId: string;
  logoUrl: string | null;
  phone: string;
  contactEmail: string;
  address: string;
  openingHours: string;
  mapUrl: string;
  social: Record<string, string>;
  currency: string; // "" = marka geneli
  themeKey: string; // "" = marka teması
  maintenanceMode: boolean;
  maintenanceMessage: string;
  currencies: CurrencySpec[];
  themes: { key: string; name: string }[];
  brandCurrency: string;
  brandThemeName: string;
};

export default function BranchSettingsForm(initial: Props) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string | null>(initial.logoUrl);
  const [mapUrl, setMapUrl] = useState(initial.mapUrl);
  const [social, setSocial] = useState<Record<string, string>>(initial.social ?? {});
  const [currency, setCurrency] = useState(initial.currency);
  const [themeKey, setThemeKey] = useState(initial.themeKey);
  const [maintenanceMode, setMaintenanceMode] = useState(initial.maintenanceMode);
  const [maintenanceMessage, setMaintenanceMessage] = useState(initial.maintenanceMessage);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    setStatus("saving");
    const res = await updateBranchSettings(initial.menuId, {
      logoUrl,
      phone: String(f.get("phone") ?? ""),
      contactEmail: String(f.get("contactEmail") ?? ""),
      address: String(f.get("address") ?? ""),
      openingHours: String(f.get("openingHours") ?? ""),
      mapUrl,
      social,
      currency,
      themeKey,
      maintenanceMode,
      maintenanceMessage,
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
        <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="logos" label="Şube logosu (boşsa marka logosu)" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Telefon</label>
          <input name="phone" type="tel" defaultValue={initial.phone} placeholder="0212 000 00 00" className={inputBase} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">E-posta</label>
          <input name="contactEmail" type="email" defaultValue={initial.contactEmail} placeholder="sube@isletme.com" className={inputBase} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Adres</label>
        <textarea name="address" rows={2} defaultValue={initial.address} placeholder="Şube adresi" className={inputBase} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Açık saatler</label>
        <input name="openingHours" defaultValue={initial.openingHours} placeholder="Her gün 08:00 - 23:00" className={inputBase} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Harita / konum linki</label>
        <input value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} placeholder="Google Maps linki" className={inputBase} />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Sosyal medya</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIALS.map((s) => (
            <label key={s.key} className="text-xs font-medium text-ink/60">
              {s.label}
              <input value={social[s.key] ?? ""} onChange={(e) => setSocial((p) => ({ ...p, [s.key]: e.target.value }))} placeholder={s.placeholder} className={`${inputBase} mt-1`} />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Tema</label>
          <select value={themeKey} onChange={(e) => setThemeKey(e.target.value)} className={inputBase}>
            <option value="">Marka teması ({initial.brandThemeName})</option>
            {initial.themes.map((t) => (
              <option key={t.key} value={t.key}>{t.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Para birimi</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputBase}>
            <option value="">Marka para birimi ({initial.brandCurrency})</option>
            {initial.currencies.map((c) => (
              <option key={c.code} value={c.code}>{c.code} · {c.label} ({c.symbol})</option>
            ))}
          </select>
        </div>
      </div>

      <div className={`rounded-xl border p-4 ${maintenanceMode ? "border-amber-300 bg-amber-50" : "border-ink/10 bg-white"}`}>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="mt-0.5 h-4 w-4" />
          <span>
            <span className="block text-sm font-medium text-ink">Bakım modu (bu şube)</span>
            <span className="mt-0.5 block text-xs text-ink/55">Açıkken yalnızca bu şubenin menüsü yerine bilgilendirme ekranı görünür.</span>
          </span>
        </label>
        {maintenanceMode && (
          <input value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} placeholder="Örn. Menümüz güncelleniyor, kısa süre sonra tekrar deneyin." className={`${inputBase} mt-3`} />
        )}
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-60">
          {status === "saving" ? "Kaydediliyor…" : "Şubeyi kaydet"}
        </button>
        {status === "saved" && <span className="text-sm text-emerald-600">Kaydedildi ✓</span>}
      </div>
    </form>
  );
}
