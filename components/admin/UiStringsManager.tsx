"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { setUiTranslations } from "@/lib/actions/admin";
import { UI_KEYS } from "@/lib/ui-strings";

export type UiLang = { code: string; label: string };

export default function UiStringsManager({
  languages,
  initial,
}: {
  languages: UiLang[];
  initial: Record<string, Record<string, string>>; // lang -> key -> value (DB, kısmi)
}) {
  const router = useRouter();
  const [lang, setLang] = useState(languages[0]?.code ?? "en");
  const [values, setValues] = useState<Record<string, string>>(initial[lang] ?? {});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const groups = useMemo(() => {
    const m = new Map<string, typeof UI_KEYS>();
    for (const k of UI_KEYS) {
      const arr = m.get(k.group) ?? [];
      arr.push(k);
      m.set(k.group, arr);
    }
    return [...m.entries()];
  }, []);

  function switchLang(code: string) {
    setLang(code);
    setValues(initial[code] ?? {});
    setMsg(null);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await setUiTranslations(lang, values);
    setSaving(false);
    if (res.success) {
      setMsg("Kaydedildi ✓");
      router.refresh();
    } else {
      setMsg(res.error);
    }
  }

  if (languages.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center text-ink/60">
        Önce <strong>Diller & Çeviri</strong> sayfasından dil ekleyin.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink/60">Dil:</span>
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => switchLang(l.code)}
            className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
              lang === l.code ? "bg-ink text-cream" : "border border-ink/15 text-ink/60 hover:bg-ink/5"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-ink/55">
        Boş bıraktığın metinler İngilizce (yoksa Türkçe) varsayılana düşer.
        Sol taraftaki Türkçe metin kaynak referanstır. <code>{"{x}"}</code>
        değişkendir (ör. alerjen listesi) — çeviride aynen koru.
      </p>

      <div className="mt-6 space-y-8">
        {groups.map(([group, keys]) => (
          <section key={group}>
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">{group}</h2>
            <div className="space-y-3">
              {keys.map((k) => (
                <div key={k.key} className="grid items-center gap-3 sm:grid-cols-[1fr_1.4fr]">
                  <div className="text-sm">
                    <span className="text-ink">{k.tr}</span>
                    <span className="ml-2 text-xs text-ink/40">EN: {k.en}</span>
                  </div>
                  <input
                    value={values[k.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [k.key]: e.target.value }))}
                    placeholder={k.en}
                    className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {msg && <span className="text-sm text-emerald-600">{msg}</span>}
      </div>
    </div>
  );
}
