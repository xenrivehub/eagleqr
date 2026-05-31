"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import { updateBusinessInfo } from "@/lib/actions/business";
import { formatPrice, FALLBACK_CURRENCY, type CurrencySpec } from "@/lib/currency";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

type Props = {
  name: string;
  logoUrl: string | null;
  phone: string;
  contactEmail: string;
  address: string;
  about: string;
  openingHours: string;
  currency: string;
  currencies: CurrencySpec[];
  ratingsEnabled: boolean;
  mapUrl: string;
  social: Record<string, string>;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

const SOCIALS: { key: string; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@..." },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/..." },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@..." },
  { key: "website", label: "Web sitesi", placeholder: "https://..." },
];

export default function BusinessInfoForm(initial: Props) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string | null>(initial.logoUrl);
  const [currency, setCurrency] = useState(initial.currency);
  const [ratingsEnabled, setRatingsEnabled] = useState(initial.ratingsEnabled);
  const [mapUrl, setMapUrl] = useState(initial.mapUrl);
  const [social, setSocial] = useState<Record<string, string>>(initial.social ?? {});
  const [maintenanceMode, setMaintenanceMode] = useState(initial.maintenanceMode);
  const [maintenanceMessage, setMaintenanceMessage] = useState(initial.maintenanceMessage);
  const currencyList = initial.currencies;
  const currentSpec =
    currencyList.find((c) => c.code === currency) ?? FALLBACK_CURRENCY;
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    setStatus("saving");
    const res = await updateBusinessInfo({
      name: String(f.get("name") ?? ""),
      logoUrl,
      phone: String(f.get("phone") ?? ""),
      contactEmail: String(f.get("contactEmail") ?? ""),
      address: String(f.get("address") ?? ""),
      about: String(f.get("about") ?? ""),
      openingHours: String(f.get("openingHours") ?? ""),
      currency,
      ratingsEnabled,
      mapUrl,
      social,
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
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="max-w-[180px]">
        <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="logos" label="İşletme logosu" />
      </div>

      <div>
        <label htmlFor="b-name" className="mb-1.5 block text-sm font-medium text-ink">
          İşletme adı <span className="text-red-600">*</span>
        </label>
        <input id="b-name" name="name" required defaultValue={initial.name} placeholder="Örn. Maison Noir" className={inputBase} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="b-phone" className="mb-1.5 block text-sm font-medium text-ink">Telefon</label>
          <input id="b-phone" name="phone" type="tel" defaultValue={initial.phone} placeholder="0212 000 00 00" className={inputBase} />
        </div>
        <div>
          <label htmlFor="b-email" className="mb-1.5 block text-sm font-medium text-ink">E-posta</label>
          <input id="b-email" name="contactEmail" type="email" defaultValue={initial.contactEmail} placeholder="iletisim@isletme.com" className={inputBase} />
        </div>
      </div>

      <div>
        <label htmlFor="b-address" className="mb-1.5 block text-sm font-medium text-ink">Adres</label>
        <textarea id="b-address" name="address" rows={2} defaultValue={initial.address} placeholder="Mahalle, cadde, no, ilçe/şehir" className={inputBase} />
      </div>

      <div>
        <label htmlFor="b-hours" className="mb-1.5 block text-sm font-medium text-ink">Açık saatler</label>
        <input id="b-hours" name="openingHours" defaultValue={initial.openingHours} placeholder="Örn. Her gün 08:00 - 23:00" className={inputBase} />
      </div>

      <div>
        <label htmlFor="b-map" className="mb-1.5 block text-sm font-medium text-ink">Harita / konum linki</label>
        <input id="b-map" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} placeholder="Google Maps linki (yapıştırın)" className={inputBase} />
        <p className="mt-1 text-xs text-ink/45">Müşteri menüde "Yol tarifi" butonuyla buraya yönlenir. Boşsa adresten arama yapılır.</p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Sosyal medya</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {SOCIALS.map((s) => (
            <label key={s.key} className="text-xs font-medium text-ink/60">
              {s.label}
              <input
                value={social[s.key] ?? ""}
                onChange={(e) => setSocial((p) => ({ ...p, [s.key]: e.target.value }))}
                placeholder={s.placeholder}
                className={`${inputBase} mt-1`}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="b-currency" className="mb-1.5 block text-sm font-medium text-ink">Para birimi</label>
        <div className="flex flex-wrap items-center gap-3">
          <select
            id="b-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`${inputBase} max-w-xs`}
          >
            {currencyList.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} · {c.label} ({c.symbol})
              </option>
            ))}
          </select>
          <span className="text-sm text-ink/50">
            Örnek: {formatPrice(85, currentSpec)}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-ink/45">
          Menüdeki fiyatların gösterileceği para birimi. Fiyatlar bu birimde
          girilir; otomatik kur dönüşümü yapılmaz.
        </p>
      </div>

      <div className="rounded-xl border border-ink/10 bg-white p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={ratingsEnabled}
            onChange={(e) => setRatingsEnabled(e.target.checked)}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            <span className="block text-sm font-medium text-ink">Müşteri yıldız puanı</span>
            <span className="mt-0.5 block text-xs text-ink/55">
              Açıkken müşteriler ürünlere 1-5 yıldız verebilir (anonim, yorumsuz).
              Kapatırsan menüde hiçbir yerde puan görünmez.
            </span>
          </span>
        </label>
      </div>

      <div className={`rounded-xl border p-4 ${maintenanceMode ? "border-amber-300 bg-amber-50" : "border-ink/10 bg-white"}`}>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="mt-0.5 h-4 w-4" />
          <span>
            <span className="block text-sm font-medium text-ink">Bakım modu</span>
            <span className="mt-0.5 block text-xs text-ink/55">
              Açıkken müşteriler menü yerine bir bilgilendirme ekranı görür. Menüde
              düzenleme yaparken geçici olarak açabilirsiniz.
            </span>
          </span>
        </label>
        {maintenanceMode && (
          <input
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            placeholder="Örn. Menümüz güncelleniyor, kısa süre sonra tekrar deneyin."
            className={`${inputBase} mt-3`}
          />
        )}
      </div>

      <div>
        <label htmlFor="b-about" className="mb-1.5 block text-sm font-medium text-ink">Hakkında</label>
        <textarea id="b-about" name="about" rows={4} defaultValue={initial.about} placeholder="İşletmeniz hakkında kısa bir tanıtım" className={inputBase} />
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
