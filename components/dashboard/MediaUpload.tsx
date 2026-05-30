"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { createMediaUploadUrl } from "@/lib/actions/upload";

type Kind = "video" | "model";

const CONF: Record<
  Kind,
  { label: string; accept: string; maxBytes: number; hint: string; contentType?: string }
> = {
  video: {
    label: "Tanıtım / hazırlanış videosu",
    accept: "video/mp4,video/webm",
    maxBytes: 50 * 1024 * 1024,
    hint: "MP4 veya WEBM, max 50 MB (~30 sn)",
  },
  model: {
    label: "3D model (AR)",
    accept: ".glb,model/gltf-binary",
    maxBytes: 20 * 1024 * 1024,
    hint: "GLB (.glb), max 20 MB",
    contentType: "model/gltf-binary",
  },
};

export default function MediaUpload({
  kind,
  value,
  onChange,
  locked,
  lockedReason,
}: {
  kind: Kind;
  value: string | null;
  onChange: (url: string | null) => void;
  locked?: boolean;
  lockedReason?: string;
}) {
  const conf = CONF[kind];
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);

    // GLB için tarayıcı file.type genelde boş gelir → uzantıdan doğrula
    const isGlb = file.name.toLowerCase().endsWith(".glb");
    if (kind === "model" && !isGlb) {
      setError("Yalnızca .glb uzantılı 3D model yükleyebilirsiniz.");
      return;
    }
    if (kind === "video" && !["video/mp4", "video/webm"].includes(file.type)) {
      setError("Yalnızca MP4 veya WEBM video.");
      return;
    }
    if (file.size > conf.maxBytes) {
      setError(`Dosya en fazla ${Math.round(conf.maxBytes / 1024 / 1024)} MB olabilir.`);
      return;
    }

    const contentType = conf.contentType ?? file.type;

    setUploading(true);
    setProgress(0);
    const presign = await createMediaUploadUrl(kind, contentType);
    if (!presign.success) {
      setError(presign.error);
      setUploading(false);
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", presign.uploadUrl);
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText?.slice(0, 200) || xhr.statusText}`));
        xhr.onerror = () => reject(new Error("network/cors"));
        xhr.send(file);
      });
      onChange(presign.publicUrl);
    } catch (err) {
      const detail = err instanceof Error ? err.message : "";
      console.error(`[MediaUpload:${kind}] yükleme hatası:`, detail);
      setError("Yüklenemedi. Tekrar deneyin. (Detay konsolda.)");
    } finally {
      setUploading(false);
    }
  }

  if (locked) {
    return (
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink/60">{conf.label}</span>
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-ink/15 bg-ink/[0.03] px-4 py-3 text-sm text-ink/55">
          <span aria-hidden>🔒</span>
          <span>{lockedReason ?? "Bu özellik planınızda kapalı. Açtırmak için iletişime geçin."}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{conf.label}</span>

      {value ? (
        <div className="space-y-3">
          {kind === "video" ? (
            <video src={value} controls className="aspect-video w-full rounded-xl border border-ink/10 bg-black" />
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm text-ink/70">
              <span aria-hidden>🧊</span>
              <span className="truncate">3D model yüklendi (.glb)</span>
            </div>
          )}
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
              <span className="mb-1 block text-center text-xs">Yükleniyor… %{progress}</span>
              <span className="block h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                <span className="block h-full bg-brand transition-all" style={{ width: `${progress}%` }} />
              </span>
            </span>
          ) : (
            <>
              <span aria-hidden className="text-lg">{kind === "video" ? "🎬" : "🧊"}</span>
              <span>{conf.label} seç ({conf.hint})</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">{error}</p>
      )}

      <input ref={inputRef} type="file" accept={conf.accept} onChange={handleFile} className="hidden" />
    </div>
  );
}
