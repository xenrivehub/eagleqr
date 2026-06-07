"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updatePage, setPageStatus } from "@/lib/actions/pages";
import { normalizeSlug } from "@/lib/reserved-slugs";
import { BLOCK_ORDER, BLOCK_META, blockDefaults, type Block, type BlockType } from "@/lib/page-blocks";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

type Initial = {
  title: string; slug: string; seoTitle: string; seoDescription: string;
  status: "DRAFT" | "PUBLISHED"; blocks: Block[];
};

function uid() {
  return "b_" + Math.random().toString(36).slice(2, 10);
}

export default function PageEditor({ id, initial }: { id: string; initial: Initial }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [seoTitle, setSeoTitle] = useState(initial.seoTitle);
  const [seoDescription, setSeoDescription] = useState(initial.seoDescription);
  const [status, setStatus] = useState(initial.status);
  const [blocks, setBlocks] = useState<Block[]>(initial.blocks);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function addBlock(type: BlockType) {
    setBlocks((b) => [...b, { id: uid(), ...blockDefaults(type) } as Block]);
  }
  function patchBlock(bid: string, patch: Partial<Block>) {
    setBlocks((b) => b.map((x) => (x.id === bid ? { ...x, ...patch } : x)));
  }
  function removeBlock(bid: string) {
    setBlocks((b) => b.filter((x) => x.id !== bid));
  }
  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    setBlocks((b) => {
      const oi = b.findIndex((x) => x.id === active.id);
      const ni = b.findIndex((x) => x.id === over.id);
      return oi < 0 || ni < 0 ? b : arrayMove(b, oi, ni);
    });
  }

  async function save(): Promise<boolean> {
    setError(null);
    setSaving(true);
    setSaved(false);
    const res = await updatePage(id, { title, slug, seoTitle, seoDescription, blocks });
    setSaving(false);
    if (res.success) {
      setSaved(true);
      router.refresh();
      return true;
    }
    setError(res.error);
    return false;
  }

  async function togglePublish() {
    const ok = await save();
    if (!ok) return;
    const next = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const res = await setPageStatus(id, next);
    if (res.success) {
      setStatus(next);
      router.refresh();
    }
  }

  async function preview() {
    await save();
    window.open(`/${normalizeSlug(slug)}?preview=1`, "_blank", "noopener");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => router.push("/admin/pages")} className="text-sm font-medium text-ink/60 hover:text-ink">
          ← Sayfalar
        </button>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-green-700">Kaydedildi ✓</span>}
          <button type="button" onClick={preview} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">Önizle</button>
          <button type="button" onClick={togglePublish} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
            {status === "PUBLISHED" ? "Taslağa al" : "Yayınla"}
          </button>
          <button type="button" onClick={save} disabled={saving} className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}

      {/* Sayfa meta */}
      <div className="grid gap-3 rounded-2xl border border-ink/10 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Başlık</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputBase} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Adres (slug)</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} onBlur={() => setSlug((s) => normalizeSlug(s))} className={`${inputBase} tabular-nums`} />
          <p className="mt-1 text-xs text-ink/45">/{normalizeSlug(slug) || "…"}</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">SEO başlığı <span className="text-ink/40">(boşsa başlık)</span></label>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputBase} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">SEO açıklaması</label>
          <input value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={inputBase} />
        </div>
      </div>

      {/* Blok paleti */}
      <div className="rounded-2xl border border-ink/10 bg-white p-4">
        <p className="mb-2 text-sm font-medium text-ink">Blok ekle</p>
        <div className="flex flex-wrap gap-2">
          {BLOCK_ORDER.map((t) => (
            <button key={t} type="button" onClick={() => addBlock(t)} title={BLOCK_META[t].desc} className="cursor-pointer rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-brand-soft">
              + {BLOCK_META[t].label}
            </button>
          ))}
        </div>
      </div>

      {/* Bloklar */}
      {blocks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center text-sm text-ink/55">
          Henüz blok yok. Yukarıdan blok ekleyin.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {blocks.map((b) => (
                <BlockCard key={b.id} block={b} onPatch={(p) => patchBlock(b.id, p)} onRemove={() => removeBlock(b.id)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function BlockCard({ block, onPatch, onRemove }: { block: Block; onPatch: (p: Partial<Block>) => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform), transition,
    opacity: isDragging ? 0.6 : 1, zIndex: isDragging ? 20 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-ink/10 bg-white">
      <header className="flex items-center justify-between gap-2 border-b border-ink/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Sürükle" className="cursor-grab touch-none text-ink/30 hover:text-ink/60 active:cursor-grabbing" {...attributes} {...listeners}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" /></svg>
          </button>
          <span className="text-sm font-semibold text-ink">{BLOCK_META[block.type].label}</span>
        </div>
        <button type="button" onClick={onRemove} className="cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold text-ink/50 hover:bg-red-50 hover:text-red-600">Sil</button>
      </header>
      <div className="space-y-3 p-4">
        <BlockFields block={block} onPatch={onPatch} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value?: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink/60">{label}</label>
      {textarea ? (
        <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} className={inputBase} />
      ) : (
        <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputBase} />
      )}
    </div>
  );
}

type Item = { title?: string; desc?: string; value?: string; label?: string; q?: string; a?: string };

function ItemsEditor({ items, onChange, fields }: { items: Item[]; onChange: (items: Item[]) => void; fields: { key: keyof Item; label: string }[] }) {
  function update(i: number, key: keyof Item, v: string) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));
  }
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-2 rounded-xl border border-ink/10 p-2.5">
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            {fields.map((f) => (
              <input key={String(f.key)} value={(it[f.key] as string) ?? ""} onChange={(e) => update(i, f.key, e.target.value)} placeholder={f.label} className={inputBase} />
            ))}
          </div>
          <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} aria-label="Kaldır" className="shrink-0 cursor-pointer rounded-lg px-2 py-2 text-ink/40 hover:bg-red-50 hover:text-red-600">✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, {}])} className="cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink hover:bg-ink/5">+ Öğe ekle</button>
    </div>
  );
}

function BlockFields({ block, onPatch }: { block: Block; onPatch: (p: Partial<Block>) => void }) {
  switch (block.type) {
    case "hero":
      return (<>
        <Field label="Üst etiket" value={block.overline} onChange={(v) => onPatch({ overline: v })} />
        <Field label="Başlık" value={block.title} onChange={(v) => onPatch({ title: v })} />
        <Field label="Alt metin" value={block.subtitle} onChange={(v) => onPatch({ subtitle: v })} textarea />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Buton metni" value={block.ctaLabel} onChange={(v) => onPatch({ ctaLabel: v })} />
          <Field label="Buton linki" value={block.ctaHref} onChange={(v) => onPatch({ ctaHref: v })} />
        </div>
      </>);
    case "featureSplit":
      return (<>
        <Field label="Başlık" value={block.title} onChange={(v) => onPatch({ title: v })} />
        <Field label="Metin" value={block.body} onChange={(v) => onPatch({ body: v })} textarea />
        <Field label="Görsel URL" value={block.imageUrl} onChange={(v) => onPatch({ imageUrl: v })} />
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/60">Görsel tarafı</label>
          <select value={block.side ?? "left"} onChange={(e) => onPatch({ side: e.target.value as "left" | "right" })} className={inputBase}>
            <option value="left">Solda</option>
            <option value="right">Sağda</option>
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Buton metni (ops.)" value={block.ctaLabel} onChange={(v) => onPatch({ ctaLabel: v })} />
          <Field label="Buton linki (ops.)" value={block.ctaHref} onChange={(v) => onPatch({ ctaHref: v })} />
        </div>
      </>);
    case "featureGrid":
      return (<>
        <Field label="Başlık" value={block.heading} onChange={(v) => onPatch({ heading: v })} />
        <ItemsEditor items={block.items ?? []} onChange={(items) => onPatch({ items })} fields={[{ key: "title", label: "Kart başlığı" }, { key: "desc", label: "Açıklama" }]} />
      </>);
    case "stats":
      return <ItemsEditor items={block.items ?? []} onChange={(items) => onPatch({ items })} fields={[{ key: "value", label: "Rakam (örn. %40)" }, { key: "label", label: "Etiket" }]} />;
    case "cta":
      return (<>
        <Field label="Başlık" value={block.title} onChange={(v) => onPatch({ title: v })} />
        <Field label="Alt metin" value={block.subtitle} onChange={(v) => onPatch({ subtitle: v })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Buton metni" value={block.ctaLabel} onChange={(v) => onPatch({ ctaLabel: v })} />
          <Field label="Buton linki" value={block.ctaHref} onChange={(v) => onPatch({ ctaHref: v })} />
        </div>
      </>);
    case "faq":
      return (<>
        <Field label="Başlık" value={block.heading} onChange={(v) => onPatch({ heading: v })} />
        <ItemsEditor items={block.items ?? []} onChange={(items) => onPatch({ items })} fields={[{ key: "q", label: "Soru" }, { key: "a", label: "Cevap" }]} />
      </>);
    case "richText":
      return (<>
        <Field label="Başlık" value={block.heading} onChange={(v) => onPatch({ heading: v })} />
        <Field label="Metin" value={block.body} onChange={(v) => onPatch({ body: v })} textarea />
      </>);
    case "image":
      return (<>
        <Field label="Görsel URL" value={block.imageUrl} onChange={(v) => onPatch({ imageUrl: v })} />
        <Field label="Açıklama (ops.)" value={block.caption} onChange={(v) => onPatch({ caption: v })} />
      </>);
    default:
      return null;
  }
}
