"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fillSeo, type SeoSettings } from "@/lib/seo";
import { setSeoSettings } from "@/lib/actions/admin";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

const SAMPLE = { business: "Kahve Dünyası", product: "Cheesecake", branch: "Kadıköy" };

export default function SeoSettingsForm({ initial }: { initial: SeoSettings }) {
  const router = useRouter();
  const [s, setS] = useState<SeoSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof SeoSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setS((prev) => ({ ...prev, [k]: e.target.value }));

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await setSeoSettings(s);
    setSaving(false);
    if (res.success) {
      setSaved(true);
      router.refresh();
    }
  }

  function Section({
    title, hint, titleKey, descKey,
  }: { title: string; hint: string; titleKey: keyof SeoSettings; descKey: keyof SeoSettings }) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-0.5 text-xs text-ink/50">{hint}</p>
        <div className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Başlık</label>
            <input value={s[titleKey]} onChange={set(titleKey)} className={inputBase} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/60">Açıklama</label>
            <textarea value={s[descKey]} onChange={set(descKey)} rows={2} className={inputBase} />
          </div>
          <div className="rounded-xl bg-cream/60 p-3">
            <p className="truncate text-[15px] font-medium text-blue-700">{fillSeo(s[titleKey], SAMPLE) || "—"}</p>
            <p className="mt-0.5 text-sm leading-snug text-ink/70">{fillSeo(s[descKey], SAMPLE) || "—"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="rounded-xl border border-ink/10 bg-cream/60 px-4 py-3 text-sm text-ink/70">
        Yer tutucular: <code className="rounded bg-ink/10 px-1">{"{business}"}</code> işletme adı,{" "}
        <code className="rounded bg-ink/10 px-1">{"{product}"}</code> ürün adı,{" "}
        <code className="rounded bg-ink/10 px-1">{"{branch}"}</code> şube adı. Örnek önizleme: {SAMPLE.business} / {SAMPLE.product} / {SAMPLE.branch}.
        <br />
        <span className="text-ink/50">Oluşturduğun özel sayfaların (/slug) SEO'sunu o sayfanın kendi editöründen ayarlarsın.</span>
      </p>

      <Section title="Anasayfa" hint="Tanıtım/landing sayfası (eaglemenu.com)" titleKey="homeTitle" descKey="homeDescription" />
      <Section title="İşletme menüsü" hint="/m/[işletme] — müşteri menüsü ana sayfası" titleKey="menuTitle" descKey="menuDescription" />
      <Section title="Ürün sayfası" hint="/m/[işletme]/urun/[ürün] — başlık şablonu (açıklamada ürünün kendi açıklaması varsa o önceliklidir)" titleKey="productTitle" descKey="productDescription" />
      <Section title="Şube sayfası" hint="/m/[işletme]/[şube] — zincir işletmelerde şube menüsü" titleKey="branchTitle" descKey="branchDescription" />

      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Anahtar kelimeler</h2>
        <p className="mt-0.5 text-xs text-ink/50">Virgülle ayır; menü/ürün sayfalarında kullanılır.</p>
        <input value={s.keywords} onChange={set("keywords")} className={`${inputBase} mt-3`} />
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={saving} className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {saved && <span className="text-sm text-green-700">Kaydedildi ✓</span>}
      </div>
    </div>
  );
}
