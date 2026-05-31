"use client";

import { useRef, useState } from "react";
import { importProducts, type ImportReport } from "@/lib/actions/import";

const TEMPLATE =
  "﻿" +
  "kategori,ad,açıklama,fiyat,kalori,hazırlık_dk,alerjenler,etiketler,görsel_url\n" +
  'Kahve,Latte,"Espresso ve buharlı süt",85,120,4,Süt,Popüler,\n' +
  'Tatlı,Cheesecake,"Frenk üzümü kompostosu ile",110,390,5,"Süt,Glüten,Yumurta","Şefin Seçimi,Yeni",\n';

export default function BulkImport({
  menuId,
  onImported,
}: {
  menuId: string;
  onImported: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csv, setCsv] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportReport | null>(null);
  const [result, setResult] = useState<ImportReport | null>(null);
  const [busy, setBusy] = useState(false);

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eagle-qr-menu-sablon.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setPreview(null);
    const text = await file.text();
    setCsv(text);
    setBusy(true);
    const report = await importProducts(menuId, text, false);
    setBusy(false);
    setPreview(report);
  }

  async function doImport() {
    if (!csv) return;
    setBusy(true);
    const report = await importProducts(menuId, csv, true);
    setBusy(false);
    setResult(report);
  }

  // Sonuç ekranı
  if (result) {
    return (
      <div className="space-y-4">
        {result.ok ? (
          <>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              ✓ İçe aktarma tamamlandı: <strong>{result.created}</strong> ürün eklendi
              {result.skipped > 0 && <>, {result.skipped} tekrar atlandı</>}
              {result.invalid > 0 && <>, {result.invalid} hatalı satır atlandı</>}.
            </div>
            {result.newCategories.length > 0 && (
              <p className="text-sm text-ink/60">
                Yeni kategori: {result.newCategories.join(", ")}
              </p>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {result.error ?? "İçe aktarma başarısız."}
          </div>
        )}
        <button
          type="button"
          onClick={onImported}
          className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark"
        >
          Bitti
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-ink/10 bg-cream/60 p-4 text-sm text-ink/70">
        <p className="font-medium text-ink">Nasıl çalışır?</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Şablonu indir, Excel/Sheets ile doldur, CSV olarak kaydet.</li>
          <li>Dosyayı yükle — önizlemede kaç ürün ekleneceğini gör.</li>
          <li>Onayla. Eksik kategoriler otomatik oluşur, aynı isimli ürünler atlanır.</li>
        </ol>
        <p className="mt-2 text-xs text-ink/50">
          Çoklu değer (alerjen/etiket) virgülle ayrılır ve hücre tırnak içinde olmalı:
          <code className="ml-1">&quot;Süt,Glüten&quot;</code>. Fiyatta ondalık için nokta kullanın (85.50).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={downloadTemplate}
          className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5"
        >
          ↓ Şablon indir (.csv)
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-dark"
        >
          CSV yükle
        </button>
        <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
      </div>

      {fileName && <p className="text-sm text-ink/60">Dosya: {fileName}</p>}
      {busy && <p className="text-sm text-ink/50">İşleniyor…</p>}

      {preview && !busy && (
        <div className="space-y-3">
          {preview.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {preview.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Geçerli" value={preview.valid} tone="ok" />
                <Stat label="Hatalı" value={preview.invalid} tone={preview.invalid ? "warn" : "muted"} />
                <Stat label="Yeni kategori" value={preview.newCategories.length} tone="muted" />
              </div>

              {preview.newCategories.length > 0 && (
                <p className="text-xs text-ink/55">
                  Oluşturulacak kategoriler: {preview.newCategories.join(", ")}
                </p>
              )}

              {preview.errors.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  {preview.errors.slice(0, 50).map((e) => (
                    <div key={e.row}>Satır {e.row}: {e.message}</div>
                  ))}
                  {preview.errors.length > 50 && <div>…ve {preview.errors.length - 50} hata daha</div>}
                </div>
              )}

              <button
                type="button"
                disabled={preview.valid === 0}
                onClick={doImport}
                className="w-full cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
              >
                {preview.valid} ürünü içe aktar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "ok" | "warn" | "muted" }) {
  const cls =
    tone === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : tone === "warn" ? "border-amber-200 bg-amber-50 text-amber-700"
    : "border-ink/10 bg-white text-ink/70";
  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <div className="font-display text-xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}
