"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { translateMenu } from "@/lib/actions/translate";

export type TargetLang = { code: string; label: string; nativeLabel: string };

export default function TranslateMenu({
  menuId,
  languages,
}: {
  menuId: string;
  languages: TargetLang[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (languages.length === 0) return null;

  function toggle(code: string) {
    setSel((p) => (p.includes(code) ? p.filter((c) => c !== code) : [...p, code]));
  }

  async function run() {
    if (sel.length === 0) return;
    setPending(true);
    setMsg(null);
    const res = await translateMenu(menuId, sel);
    setPending(false);
    if (res.success) {
      setMsg({ ok: true, text: `Çeviri tamam — ${res.count} ürün güncellendi.` });
      router.refresh();
    } else {
      setMsg({ ok: false, text: res.error });
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 5h12M9 3v2m1.5 14 4-9 4 9M12.5 17h4M5 8c0 2 1.5 4.5 4 6" />
        </svg>
        Menüyü çevir
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Kapat"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div className="absolute right-0 z-40 mt-2 w-72 rounded-2xl border border-ink/10 bg-white p-4 shadow-xl">
            <p className="text-sm font-semibold text-ink">Hangi dillere çevrilsin?</p>
            <p className="mt-1 text-xs text-ink/55">
              Ürün adları, açıklamaları ve kategoriler çevrilir. Mevcut çeviriler
              üzerine yazılır.
            </p>
            <div className="mt-3 space-y-1.5">
              {languages.map((l) => (
                <label key={l.code} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-cream">
                  <input type="checkbox" checked={sel.includes(l.code)} onChange={() => toggle(l.code)} className="h-4 w-4" />
                  {l.label} <span className="text-ink/40">· {l.nativeLabel}</span>
                </label>
              ))}
            </div>

            {msg && (
              <p className={`mt-3 text-xs ${msg.ok ? "text-emerald-600" : "text-red-600"}`}>{msg.text}</p>
            )}

            <button
              type="button"
              disabled={pending || sel.length === 0}
              onClick={run}
              className="mt-3 w-full cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
            >
              {pending ? "Çevriliyor… (biraz sürebilir)" : `Çevir${sel.length ? ` (${sel.length})` : ""}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
