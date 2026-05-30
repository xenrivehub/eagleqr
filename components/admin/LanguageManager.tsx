"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addLanguage,
  toggleLanguage,
  deleteLanguage,
  setTranslationModel,
} from "@/lib/actions/admin";

export type LanguageRow = {
  code: string;
  label: string;
  nativeLabel: string;
  rtl: boolean;
  enabled: boolean;
};

export default function LanguageManager({
  languages,
  model,
}: {
  languages: LanguageRow[];
  model: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  // yeni dil formu
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [nativeLabel, setNativeLabel] = useState("");
  const [rtl, setRtl] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // model
  const [modelVal, setModelVal] = useState(model);
  const [modelSaving, setModelSaving] = useState(false);

  async function add() {
    setErr(null);
    setBusy("add");
    const res = await addLanguage(code, label, nativeLabel, rtl);
    setBusy(null);
    if (res.success) {
      setCode(""); setLabel(""); setNativeLabel(""); setRtl(false);
      router.refresh();
    } else setErr(res.error);
  }

  async function toggle(c: string, enabled: boolean) {
    setBusy(c);
    const res = await toggleLanguage(c, enabled);
    setBusy(null);
    if (res.success) router.refresh();
  }

  async function remove(c: string) {
    setBusy(c);
    const res = await deleteLanguage(c);
    setBusy(null);
    if (res.success) router.refresh();
  }

  async function saveModel() {
    setModelSaving(true);
    const res = await setTranslationModel(modelVal);
    setModelSaving(false);
    if (res.success) router.refresh();
  }

  const inputCls =
    "rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

  return (
    <div className="space-y-8">
      {/* Çeviri modeli */}
      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Çeviri modeli</h2>
        <p className="mt-1 text-sm text-ink/55">
          OpenRouter model adı. Menü çevirileri bu modelle yapılır.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            value={modelVal}
            onChange={(e) => setModelVal(e.target.value)}
            placeholder="google/gemini-2.0-flash-001"
            className={`${inputCls} w-80 max-w-full font-mono`}
          />
          <button
            type="button"
            disabled={modelSaving || modelVal.trim() === model}
            onClick={saveModel}
            className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {modelSaving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </section>

      {/* Diller */}
      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Diller</h2>
        <p className="mt-1 text-sm text-ink/55">
          TR temel dildir. Eklediğiniz ve açık olan diller işletmelerin menü
          çevirisinde kullanılabilir.
        </p>

        <ul className="mt-4 divide-y divide-ink/5">
          <li className="flex items-center gap-3 py-2.5 text-sm">
            <span className="w-12 font-mono font-semibold text-ink/70">tr</span>
            <span className="flex-1 text-ink">Türkçe <span className="text-ink/40">· temel dil</span></span>
            <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink/50">Sabit</span>
          </li>
          {languages.map((l) => (
            <li key={l.code} className="flex items-center gap-3 py-2.5 text-sm">
              <span className="w-12 font-mono font-semibold text-ink/70">{l.code}</span>
              <span className="flex-1 text-ink">
                {l.label} <span className="text-ink/40">· {l.nativeLabel}</span>
                {l.rtl && <span className="ml-2 rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-semibold text-ink/50">RTL</span>}
              </span>
              <button
                type="button"
                disabled={busy === l.code}
                onClick={() => toggle(l.code, !l.enabled)}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                  l.enabled ? "bg-emerald-100 text-emerald-700" : "bg-ink/5 text-ink/50"
                }`}
              >
                {l.enabled ? "Açık" : "Kapalı"}
              </button>
              <button
                type="button"
                disabled={busy === l.code}
                onClick={() => remove(l.code)}
                className="cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Sil
              </button>
            </li>
          ))}
        </ul>

        {/* Yeni dil */}
        <div className="mt-5 border-t border-ink/10 pt-5">
          <h3 className="text-sm font-semibold text-ink">Yeni dil ekle</h3>
          {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="text-xs font-medium text-ink/60">
              Kod
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="en" className={`${inputCls} mt-1 block w-24 font-mono`} />
            </label>
            <label className="text-xs font-medium text-ink/60">
              Türkçe ad
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="İngilizce" className={`${inputCls} mt-1 block w-40`} />
            </label>
            <label className="text-xs font-medium text-ink/60">
              Yerel ad
              <input value={nativeLabel} onChange={(e) => setNativeLabel(e.target.value)} placeholder="English" className={`${inputCls} mt-1 block w-40`} />
            </label>
            <label className="flex items-center gap-2 pb-2 text-sm text-ink/70">
              <input type="checkbox" checked={rtl} onChange={(e) => setRtl(e.target.checked)} className="h-4 w-4" />
              RTL (sağdan sola)
            </label>
            <button
              type="button"
              disabled={busy === "add"}
              onClick={add}
              className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              {busy === "add" ? "Ekleniyor…" : "Ekle"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
