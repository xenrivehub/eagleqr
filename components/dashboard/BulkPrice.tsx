"use client";

import { useState } from "react";
import { bulkUpdatePrices, type BulkPriceOpts, type BulkPriceReport } from "@/lib/actions/menu";
import { formatPrice, type CurrencySpec } from "@/lib/currency";

export default function BulkPrice({
  menuId,
  currency,
  categories,
  onDone,
}: {
  menuId: string;
  currency: CurrencySpec;
  categories: { id: string; name: string }[];
  onDone: () => void;
}) {
  const [scope, setScope] = useState("all");
  const [op, setOp] = useState<"discount" | "increase">("discount");
  const [method, setMethod] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [includeVariations, setIncludeVariations] = useState(true);
  const [preview, setPreview] = useState<BulkPriceReport | null>(null);
  const [result, setResult] = useState<BulkPriceReport | null>(null);
  const [busy, setBusy] = useState(false);

  function opts(): BulkPriceOpts {
    return { scope, op, method, value: Number(String(value).replace(",", ".")), includeVariations };
  }

  async function doPreview() {
    setResult(null);
    setBusy(true);
    const r = await bulkUpdatePrices(menuId, opts(), false);
    setBusy(false);
    setPreview(r);
  }
  async function apply() {
    setBusy(true);
    const r = await bulkUpdatePrices(menuId, opts(), true);
    setBusy(false);
    setResult(r);
  }

  const inputCls = "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

  if (result) {
    return (
      <div className="space-y-4">
        <div className={`rounded-xl border p-4 text-sm ${result.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`}>
          {result.ok
            ? `✓ ${result.count} ürünün fiyatı güncellendi.`
            : result.error}
        </div>
        <button type="button" onClick={onDone} className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark">
          Bitti
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Kapsam</label>
        <select value={scope} onChange={(e) => { setScope(e.target.value); setPreview(null); }} className={inputCls}>
          <option value="all">Tüm ürünler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">İşlem</label>
          <div className="flex overflow-hidden rounded-full border border-ink/15 text-sm">
            {([["discount", "İndirim"], ["increase", "Zam"]] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => { setOp(k); setPreview(null); }}
                className={`flex-1 cursor-pointer px-3 py-2 font-semibold transition-colors ${op === k ? "bg-ink text-cream" : "text-ink/60 hover:bg-ink/5"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Yöntem</label>
          <div className="flex overflow-hidden rounded-full border border-ink/15 text-sm">
            {([["percent", "Yüzde %"], ["fixed", `Tutar ${currency.symbol}`]] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => { setMethod(k); setPreview(null); }}
                className={`flex-1 cursor-pointer px-3 py-2 font-semibold transition-colors ${method === k ? "bg-ink text-cream" : "text-ink/60 hover:bg-ink/5"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Değer {method === "percent" ? "(%)" : `(${currency.symbol})`}
        </label>
        <input inputMode="decimal" value={value} onChange={(e) => { setValue(e.target.value); setPreview(null); }} placeholder={method === "percent" ? "10" : "20"} className={`${inputCls} tabular-nums`} />
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-ink/10 bg-white p-3 text-sm text-ink">
        <input type="checkbox" checked={includeVariations} onChange={(e) => { setIncludeVariations(e.target.checked); setPreview(null); }} className="h-4 w-4" />
        Varyasyon fiyatlarını da güncelle
      </label>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
        ⚠ Bu işlem ürün fiyatlarını <strong>kalıcı</strong> değiştirir (geri alma yok). Sonuç tam sayıya yuvarlanır.
      </p>

      {preview && !preview.ok && <p className="text-sm text-red-600">{preview.error}</p>}

      {preview && preview.ok && (
        <div className="rounded-xl border border-ink/10 bg-cream/50 p-3 text-sm">
          <p className="font-medium text-ink">{preview.count} ürün etkilenecek. Örnek:</p>
          <ul className="mt-2 space-y-1">
            {preview.sample.map((s, i) => (
              <li key={i} className="flex items-center justify-between gap-2 tabular-nums">
                <span className="truncate text-ink/70">{s.name}</span>
                <span><span className="text-ink/40 line-through">{formatPrice(s.oldP, currency)}</span> → <span className="font-semibold text-ink">{formatPrice(s.newP, currency)}</span></span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-1">
        {!(preview && preview.ok) ? (
          <button type="button" disabled={busy || !value} onClick={doPreview} className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
            {busy ? "Hesaplanıyor…" : "Önizle"}
          </button>
        ) : (
          <>
            <button type="button" onClick={() => setPreview(null)} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5">
              Değiştir
            </button>
            <button type="button" disabled={busy} onClick={apply} className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
              {busy ? "Uygulanıyor…" : `Uygula (${preview.count})`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
