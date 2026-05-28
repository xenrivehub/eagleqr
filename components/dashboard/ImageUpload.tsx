"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { createImageUploadUrl } from "@/lib/actions/upload";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ACCEPT = "image/jpeg,image/png,image/webp";

export default function ImageUpload({
  value,
  onChange,
  folder = "products",
  shape = "square",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder?: "products" | "covers";
  shape?: "square" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // aynı dosya tekrar seçilebilsin
    if (!file) return;
    setError(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Yalnızca JPG, PNG veya WEBP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Görsel en fazla 4 MB olabilir.");
      return;
    }

    setUploading(true);
    setProgress(0);

    const presign = await createImageUploadUrl(file.type, folder);
    if (!presign.success) {
      setError(presign.error);
      setUploading(false);
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presign.uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            setProgress(Math.round((ev.loaded / ev.total) * 100));
          }
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error("upload-failed"));
        xhr.onerror = () => reject(new Error("network"));
        xhr.send(file);
      });
      onChange(presign.publicUrl);
    } catch {
      setError("Görsel yüklenemedi. Tekrar deneyin.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">
        Ürün görseli
      </span>

      {value ? (
        <div className={shape === "wide" ? "space-y-3" : "flex items-center gap-3"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Görsel önizleme"
            className={
              shape === "wide"
                ? "aspect-[16/7] w-full rounded-xl border border-ink/10 object-cover"
                : "h-20 w-20 rounded-xl border border-ink/10 object-cover"
            }
          />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5"
            >
              Değiştir
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Kaldır
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 bg-white px-4 py-6 text-sm text-ink/60 transition-colors hover:border-brand hover:bg-brand-soft/30 disabled:opacity-60"
        >
          {uploading ? (
            <span className="w-full">
              <span className="mb-1 block text-center text-xs">
                Yükleniyor… %{progress}
              </span>
              <span className="block h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                <span
                  className="block h-full bg-brand transition-all"
                  style={{ width: `${progress}%` }}
                />
              </span>
            </span>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span>Görsel seç (JPG/PNG/WEBP, max 4 MB)</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
