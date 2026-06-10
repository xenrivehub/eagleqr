"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";
import MediaUpload from "./MediaUpload";
import { updateSplash } from "@/lib/actions/business";

type Props = {
  enabled: boolean;
  imageUrl: string | null;
  videoUrl: string | null;
};

export default function SplashForm(initial: Props) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [imageUrl, setImageUrl] = useState<string | null>(initial.imageUrl);
  const [videoUrl, setVideoUrl] = useState<string | null>(initial.videoUrl);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    const res = await updateSplash({ enabled, imageUrl, videoUrl });
    if (res.success) {
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-2xl space-y-5">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 accent-brand-dark"
        />
        <span className="text-sm font-medium text-ink">Açılış ekranını göster</span>
      </label>

      <p className="text-sm text-ink/55">
        QR okutulduğunda menüden önce tam ekran karşılama gösterilir. Video varsa
        otomatik oynar; yoksa görsel kullanılır. Ziyaretçi “Menüyü Görüntüle”ye
        basınca menü açılır (oturum başına bir kez gösterilir).
      </p>

      <ImageUpload value={imageUrl} onChange={setImageUrl} folder="covers" shape="wide" label="Açılış görseli" />

      <MediaUpload kind="video" value={videoUrl} onChange={setVideoUrl} />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {status === "saving" ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {status === "saved" && <span className="text-sm text-emerald-600">Kaydedildi ✓</span>}
        {status === "error" && <span className="text-sm text-red-600">Bir hata oluştu</span>}
      </div>
    </div>
  );
}
