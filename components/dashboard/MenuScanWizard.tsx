"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { scanMenuPhoto, createScannedProducts, type ScannedItem } from "@/lib/actions/menu-scan";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";
const MAX_IMAGES = 6;

// Görseli en fazla `max` px'e küçültüp JPEG data URL döndürür (payload/maliyet için)
function downscale(file: File, max = 1400, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MenuScanWizard({ menuId, branchName }: { menuId: string; branchName: string | null }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ScannedItem[] | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const room = MAX_IMAGES - images.length;
    const picked = Array.from(files).slice(0, Math.max(0, room));
    try {
      const urls = await Promise.all(picked.map((f) => downscale(f)));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setError("Görsel işlenemedi. Başka bir fotoğraf deneyin.");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function scan() {
    setError(null);
    setScanning(true);
    const res = await scanMenuPhoto(images);
    setScanning(false);
    if (res.success) setItems(res.items);
    else setError(res.error);
  }

  function patch(i: number, p: Partial<ScannedItem>) {
    setItems((arr) => (arr ? arr.map((it, idx) => (idx === i ? { ...it, ...p } : it)) : arr));
  }

  async function create() {
    if (!items) return;
    setError(null);
    setCreating(true);
    const res = await createScannedProducts(menuId, items);
    setCreating(false);
    if (res.success) router.push("/dashboard/menu");
    else setError(res.error);
  }

  // ---- Adım 2: önizleme/düzenleme ----
  if (items) {
    return (
      <div className="space-y-4">
        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink/60"><strong className="text-ink">{items.length} ürün</strong> bulundu. Eksikleri tamamlayıp ekleyin.</p>
          <button type="button" onClick={() => setItems(null)} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">← Fotoğrafa dön</button>
        </div>

        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border border-ink/10 bg-white p-3">
              <div className="flex flex-wrap items-center gap-2">
                <input value={it.name} onChange={(e) => patch(i, { name: e.target.value })} placeholder="Ürün adı" className={`${inputBase} min-w-[160px] flex-1 font-medium`} />
                <input value={it.category} onChange={(e) => patch(i, { category: e.target.value })} placeholder="Kategori" className={`${inputBase} w-40`} />
                <div className="relative w-28">
                  <input value={it.price} onChange={(e) => patch(i, { price: e.target.value })} inputMode="decimal" placeholder="Fiyat" className={`${inputBase} tabular-nums`} />
                </div>
                <button type="button" onClick={() => setItems((arr) => arr!.filter((_, idx) => idx !== i))} aria-label="Kaldır" className="shrink-0 cursor-pointer rounded-lg px-2 py-2 text-ink/40 hover:bg-red-50 hover:text-red-600">✕</button>
              </div>
              <input value={it.description} onChange={(e) => patch(i, { description: e.target.value })} placeholder="Açıklama (opsiyonel)" className={`${inputBase} mt-2`} />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setItems((arr) => [...(arr ?? []), { category: "", name: "", description: "", price: "" }])} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">+ Satır ekle</button>
          <button type="button" onClick={create} disabled={creating} className="ml-auto cursor-pointer rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
            {creating ? "Ekleniyor…" : `Menüye ekle (${items.length})`}
          </button>
        </div>
      </div>
    );
  }

  // ---- Adım 1: fotoğraf yükleme ----
  return (
    <div className="space-y-4">
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}
      {branchName && <p className="text-sm text-ink/55">Şube: <strong className="text-ink">{branchName}</strong></p>}

      <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-6 text-center">
        <p className="text-sm text-ink/60">Basılı menünüzün net bir fotoğrafını yükleyin. Birden çok sayfa ekleyebilirsiniz (en fazla {MAX_IMAGES}).</p>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} className="hidden" id="menu-photos" />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={images.length >= MAX_IMAGES} className="mt-4 cursor-pointer rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5 disabled:opacity-50">
          📷 Fotoğraf seç / çek
        </button>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-28 w-28 rounded-xl border border-ink/10 object-cover" />
              <button type="button" onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))} aria-label="Kaldır" className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-ink text-xs text-cream">✕</button>
            </div>
          ))}
        </div>
      )}

      <button type="button" onClick={scan} disabled={images.length === 0 || scanning} className="w-full cursor-pointer rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
        {scanning ? "Yapay zeka okuyor… (10-30 sn)" : "✨ Yapay zeka ile oku"}
      </button>
    </div>
  );
}
