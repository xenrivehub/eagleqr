"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPage, setPageStatus, deletePage } from "@/lib/actions/pages";
import { normalizeSlug } from "@/lib/reserved-slugs";

type PageRow = { id: string; title: string; slug: string; status: "DRAFT" | "PUBLISHED"; updatedAt: string };

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

export default function PagesList({ pages }: { pages: PageRow[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create() {
    setError(null);
    setBusy(true);
    const res = await createPage(title, slug || title);
    setBusy(false);
    if (res.success) router.push(`/admin/pages/${res.id}`);
    else setError(res.error);
  }

  async function toggleStatus(p: PageRow) {
    await setPageStatus(p.id, p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED");
    router.refresh();
  }

  async function remove(p: PageRow) {
    if (!confirm(`"${p.title}" sayfası silinecek. Emin misiniz?`)) return;
    await deletePage(p.id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {creating ? (
        <div className="rounded-2xl border border-ink/10 bg-white p-5">
          {error && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Başlık</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn. QR Menü Özelliği" className={inputBase} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Adres (slug)</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} onBlur={() => setSlug((s) => normalizeSlug(s))} placeholder="qr-menu" className={`${inputBase} tabular-nums`} />
              <p className="mt-1 text-xs text-ink/45">/{normalizeSlug(slug || title) || "…"}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={create} disabled={busy} className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
              {busy ? "Oluşturuluyor…" : "Oluştur ve düzenle"}
            </button>
            <button type="button" onClick={() => setCreating(false)} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
              Vazgeç
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setCreating(true)} className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark">
          + Yeni Sayfa
        </button>
      )}

      {pages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center text-sm text-ink/55">Henüz sayfa yok.</p>
      ) : (
        <div className="space-y-2">
          {pages.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-display text-base font-semibold text-ink">{p.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${p.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-ink/10 text-ink/60"}`}>
                    {p.status === "PUBLISHED" ? "Yayında" : "Taslak"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-ink/45">/{p.slug}</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <a href={`/${p.slug}?preview=1`} target="_blank" rel="noopener noreferrer" className="cursor-pointer rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5">
                  Önizle
                </a>
                <button type="button" onClick={() => toggleStatus(p)} className="cursor-pointer rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5">
                  {p.status === "PUBLISHED" ? "Taslağa al" : "Yayınla"}
                </button>
                <Link href={`/admin/pages/${p.id}`} className="cursor-pointer rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-dark">
                  Düzenle
                </Link>
                <button type="button" onClick={() => remove(p)} aria-label="Sil" className="cursor-pointer rounded-full px-2.5 py-1.5 text-xs font-semibold text-ink/50 hover:bg-red-50 hover:text-red-600">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
