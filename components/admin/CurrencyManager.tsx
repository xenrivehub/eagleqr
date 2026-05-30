"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addCurrency,
  toggleCurrency,
  deleteCurrency,
  type CurrencyInput,
} from "@/lib/actions/admin";
import { formatPrice } from "@/lib/currency";

export type CurrencyRow = {
  code: string;
  symbol: string;
  label: string;
  position: "before" | "after";
  space: boolean;
  decimals: number;
  enabled: boolean;
};

const inputCls =
  "rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

export default function CurrencyManager({ currencies }: { currencies: CurrencyRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<CurrencyInput>({
    code: "",
    symbol: "",
    label: "",
    position: "before",
    space: false,
    decimals: 2,
  });

  function spec(c: CurrencyRow) {
    return { code: c.code, symbol: c.symbol, label: c.label, position: c.position, space: c.space, decimals: c.decimals };
  }

  async function add() {
    setErr(null);
    setBusy("add");
    const res = await addCurrency(form);
    setBusy(null);
    if (res.success) {
      setForm({ code: "", symbol: "", label: "", position: "before", space: false, decimals: 2 });
      router.refresh();
    } else setErr(res.error);
  }

  async function toggle(code: string, enabled: boolean) {
    setBusy(code);
    const res = await toggleCurrency(code, enabled);
    setBusy(null);
    if (res.success) router.refresh();
  }

  async function remove(code: string) {
    setBusy(code);
    const res = await deleteCurrency(code);
    setBusy(null);
    if (res.success) router.refresh();
  }

  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5">
      <ul className="divide-y divide-ink/5">
        {currencies.map((c) => (
          <li key={c.code} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
            <span className="w-12 font-mono font-semibold text-ink/70">{c.code}</span>
            <span className="flex-1 min-w-[140px] text-ink">
              {c.label}{" "}
              <span className="text-ink/40">
                · örnek {formatPrice(85, spec(c))} · {c.position === "before" ? "sembol solda" : "sembol sağda"}
              </span>
            </span>
            <button
              type="button"
              disabled={busy === c.code}
              onClick={() => toggle(c.code, !c.enabled)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                c.enabled ? "bg-emerald-100 text-emerald-700" : "bg-ink/5 text-ink/50"
              }`}
            >
              {c.enabled ? "Açık" : "Kapalı"}
            </button>
            {c.code !== "TRY" && (
              <button
                type="button"
                disabled={busy === c.code}
                onClick={() => remove(c.code)}
                className="cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                Sil
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-ink/10 pt-5">
        <h3 className="text-sm font-semibold text-ink">Yeni para birimi ekle</h3>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-xs font-medium text-ink/60">
            Kod
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="USD" className={`${inputCls} mt-1 block w-24 font-mono`} />
          </label>
          <label className="text-xs font-medium text-ink/60">
            Sembol
            <input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="$" className={`${inputCls} mt-1 block w-20`} />
          </label>
          <label className="text-xs font-medium text-ink/60">
            Ad
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="ABD Doları" className={`${inputCls} mt-1 block w-40`} />
          </label>
          <label className="text-xs font-medium text-ink/60">
            Sembol konumu
            <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value as "before" | "after" })} className={`${inputCls} mt-1 block w-32`}>
              <option value="before">Solda (₺85)</option>
              <option value="after">Sağda (85 ₺)</option>
            </select>
          </label>
          <label className="text-xs font-medium text-ink/60">
            Ondalık
            <input type="number" min={0} max={4} value={form.decimals} onChange={(e) => setForm({ ...form, decimals: Number(e.target.value) || 0 })} className={`${inputCls} mt-1 block w-20 tabular-nums`} />
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm text-ink/70">
            <input type="checkbox" checked={form.space} onChange={(e) => setForm({ ...form, space: e.target.checked })} className="h-4 w-4" />
            Boşluk
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
  );
}
