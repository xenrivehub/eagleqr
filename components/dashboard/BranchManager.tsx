"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SlideOver from "./SlideOver";
import ConfirmDialog from "./ConfirmDialog";
import { createBranch, updateBranch, deleteBranch } from "@/lib/actions/business";

export type BranchView = {
  id: string;
  name: string;
  slug: string | null;
  productCount: number;
};

export default function BranchManager({ branches }: { branches: BranchView[] }) {
  const router = useRouter();
  const [panel, setPanel] = useState<{ branch?: BranchView } | null>(null);
  const [confirm, setConfirm] = useState<BranchView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const copyFrom = String(form.get("copyFrom") ?? "");
    setPending(true);
    const res = panel?.branch
      ? await updateBranch(panel.branch.id, name)
      : await createBranch(name, copyFrom || undefined);
    setPending(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setPanel(null);
    router.refresh();
  }

  async function onConfirmDelete() {
    if (!confirm) return;
    setDeleting(true);
    const res = await deleteBranch(confirm.id);
    setDeleting(false);
    setConfirm(null);
    if (res.success) router.refresh();
  }

  const copyable = branches.filter((b) => b.productCount > 0);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Şubeler</h1>
          <p className="mt-1 text-sm text-ink/60">
            Her şubenin kendi menüsü ve QR kodu vardır.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setError(null); setPanel({}); }}
          className="shrink-0 cursor-pointer rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-brand-dark active:scale-95"
        >
          + Şube
        </button>
      </div>

      {branches.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">Henüz şube yok</p>
          <p className="mt-1 text-sm text-ink/60">İlk şubenizi ekleyin.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {branches.map((b) => (
            <div key={b.id} className="rounded-2xl border border-ink/10 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold text-ink">{b.name}</h2>
                  <p className="mt-0.5 truncate text-xs text-ink/50">/m/…/{b.slug}</p>
                  <p className="mt-1 text-sm text-ink/60">{b.productCount} ürün</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label="Şubeyi yeniden adlandır"
                    onClick={() => { setError(null); setPanel({ branch: b }); }}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-ink/50 hover:bg-ink/5 hover:text-ink"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Şubeyi sil"
                    onClick={() => setConfirm(b)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
                  </button>
                </div>
              </div>
              <Link
                href={`/dashboard/menu/${b.id}`}
                className="mt-4 block rounded-full bg-ink px-4 py-2 text-center text-sm font-semibold text-cream transition-colors hover:bg-ink-soft"
              >
                Menüyü düzenle →
              </Link>
            </div>
          ))}
        </div>
      )}

      <SlideOver
        open={!!panel}
        onClose={() => setPanel(null)}
        title={panel?.branch ? "Şubeyi Yeniden Adlandır" : "Yeni Şube"}
      >
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {error && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="b-name" className="mb-1.5 block text-sm font-medium text-ink">
              Şube adı <span className="text-red-600">*</span>
            </label>
            <input
              id="b-name"
              name="name"
              required
              defaultValue={panel?.branch?.name}
              placeholder="Örn. Kadıköy Şubesi"
              className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            />
          </div>

          {!panel?.branch && copyable.length > 0 && (
            <div>
              <label htmlFor="b-copy" className="mb-1.5 block text-sm font-medium text-ink">
                İçeriği kopyala
              </label>
              <select
                id="b-copy"
                name="copyFrom"
                defaultValue=""
                className="w-full cursor-pointer rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
              >
                <option value="">Boş başla</option>
                {copyable.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.productCount} ürün)
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-ink/50">
                Seçilen şubenin tüm kategori ve ürünleri yeni şubeye kopyalanır.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setPanel(null)} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
              Vazgeç
            </button>
            <button type="submit" disabled={pending} className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-60">
              {pending ? "Kaydediliyor…" : panel?.branch ? "Güncelle" : "Ekle"}
            </button>
          </div>
        </form>
      </SlideOver>

      <ConfirmDialog
        open={!!confirm}
        title="Şubeyi sil"
        message={`"${confirm?.name}" şubesi ve menüsündeki tüm ürünler silinecek. Bu işlem geri alınamaz.`}
        pending={deleting}
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
