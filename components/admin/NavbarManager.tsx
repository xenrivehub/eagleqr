"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveNavbar, type NavInput } from "@/lib/actions/navbar";
import type { AdminNavItem } from "@/lib/queries/navbar";
import NavIcon, { NAV_ICON_NAMES } from "@/components/site/NavIcon";

type PageOpt = { id: string; title: string; slug: string; published: boolean };
type Mode = "page" | "url" | "none";
type Target = { mode: Mode; pageId: string; url: string };
type Node = { label: string; description: string; icon: string; target: Target };
type Item = Node & { children: Node[] };

const inputBase =
  "rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

function toTarget(pageId: string | null, url: string | null): Target {
  if (pageId) return { mode: "page", pageId, url: "" };
  if (url) return { mode: "url", pageId: "", url };
  return { mode: "none", pageId: "", url: "" };
}
function fromTarget(t: Target): { pageId: string | null; url: string | null } {
  if (t.mode === "page") return { pageId: t.pageId || null, url: null };
  if (t.mode === "url") return { pageId: null, url: t.url || null };
  return { pageId: null, url: null };
}
function arrMove<T>(a: T[], from: number, to: number): T[] {
  if (to < 0 || to >= a.length) return a;
  const c = [...a];
  const [x] = c.splice(from, 1);
  c.splice(to, 0, x);
  return c;
}
const blankNode = (): Node => ({ label: "", description: "", icon: "", target: { mode: "page", pageId: "", url: "" } });

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink/15 text-ink/70">
        {value ? <NavIcon name={value} size={18} /> : <span className="text-xs text-ink/30">—</span>}
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputBase} w-32`}>
        <option value="">İkon yok</option>
        {NAV_ICON_NAMES.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </span>
  );
}

function TargetEditor({ target, onChange, pages, allowNone }: { target: Target; onChange: (t: Target) => void; pages: PageOpt[]; allowNone: boolean }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <select value={target.mode} onChange={(e) => onChange({ ...target, mode: e.target.value as Mode })} className={inputBase}>
        <option value="page">Sayfa</option>
        <option value="url">Özel URL</option>
        {allowNone && <option value="none">Grup (link yok)</option>}
      </select>
      {target.mode === "page" && (
        <select value={target.pageId} onChange={(e) => onChange({ ...target, pageId: e.target.value })} className={inputBase}>
          <option value="">Sayfa seç…</option>
          {pages.map((p) => (
            <option key={p.id} value={p.id}>{p.title}{p.published ? "" : " (taslak)"}</option>
          ))}
        </select>
      )}
      {target.mode === "url" && (
        <input value={target.url} onChange={(e) => onChange({ ...target, url: e.target.value })} placeholder="/ veya https://…" className={`${inputBase} w-48`} />
      )}
    </span>
  );
}

export default function NavbarManager({ initial, pages }: { initial: AdminNavItem[]; pages: PageOpt[] }) {
  const router = useRouter();
  const mapNode = (n: { label: string; description: string | null; icon: string | null; url: string | null; pageId: string | null }): Node => ({
    label: n.label, description: n.description ?? "", icon: n.icon ?? "", target: toTarget(n.pageId, n.url),
  });
  const [items, setItems] = useState<Item[]>(
    initial.map((t) => ({ ...mapNode(t), children: t.children.map(mapNode) })),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patchItem(i: number, patch: Partial<Item>) {
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function patchChild(i: number, j: number, patch: Partial<Node>) {
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, children: it.children.map((c, cj) => (cj === j ? { ...c, ...patch } : c)) } : it)));
  }
  const targetValid = (t: Target) => (t.mode === "page" && !!t.pageId) || (t.mode === "url" && !!t.url.trim());

  async function save() {
    setError(null);
    setSaved(false);
    const problems: string[] = [];
    items.forEach((it, i) => {
      const name = it.label.trim() || `#${i + 1}`;
      if (!it.label.trim()) { problems.push(`${i + 1}. üst öğenin etiketi boş.`); return; }
      const validChildren = it.children.filter((c) => c.label.trim() && targetValid(c.target));
      if (!targetValid(it.target) && validChildren.length === 0) {
        problems.push(`"${name}" için sayfa/URL seçin ya da geçerli alt link ekleyin.`);
      }
      it.children.forEach((c, j) => {
        if (c.label.trim() && !targetValid(c.target)) problems.push(`"${name}" → ${j + 1}. alt link için sayfa/URL seçin.`);
      });
    });
    if (problems.length) { setError(problems.join(" ")); return; }

    setSaving(true);
    const toInput = (n: Node): Omit<NavInput, "children"> => ({
      label: n.label.trim(), description: n.description.trim() || null, icon: n.icon || null, ...fromTarget(n.target),
    });
    const payload: NavInput[] = items
      .filter((it) => it.label.trim())
      .map((it) => ({ ...toInput(it), children: it.children.filter((c) => c.label.trim()).map(toInput) }));
    const res = await saveNavbar(payload);
    setSaving(false);
    if (res.success) { setSaved(true); router.refresh(); }
    else setError(res.error);
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}

      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border border-ink/10 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => setItems((a) => arrMove(a, i, i - 1))} aria-label="Yukarı" className="cursor-pointer px-1 text-ink/40 hover:text-ink">▲</button>
              <button type="button" onClick={() => setItems((a) => arrMove(a, i, i + 1))} aria-label="Aşağı" className="cursor-pointer px-1 text-ink/40 hover:text-ink">▼</button>
            </div>
            <input value={it.label} onChange={(e) => patchItem(i, { label: e.target.value })} placeholder="Menü etiketi" className={`${inputBase} w-40`} />
            <TargetEditor target={it.target} onChange={(t) => patchItem(i, { target: t })} pages={pages} allowNone />
            <button type="button" onClick={() => setItems((a) => a.filter((_, idx) => idx !== i))} className="ml-auto cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink/50 hover:bg-red-50 hover:text-red-600">Sil</button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <IconPicker value={it.icon} onChange={(v) => patchItem(i, { icon: v })} />
            <input value={it.description} onChange={(e) => patchItem(i, { description: e.target.value })} placeholder="Açıklama (dropdown'da görünür)" className={`${inputBase} min-w-[240px] flex-1`} />
          </div>

          {/* Alt öğeler */}
          <div className="mt-3 space-y-3 border-l-2 border-ink/10 pl-3">
            {it.children.map((c, j) => (
              <div key={j} className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => patchItem(i, { children: arrMove(it.children, j, j - 1) })} aria-label="Yukarı" className="cursor-pointer px-1 text-xs text-ink/40 hover:text-ink">▲</button>
                    <button type="button" onClick={() => patchItem(i, { children: arrMove(it.children, j, j + 1) })} aria-label="Aşağı" className="cursor-pointer px-1 text-xs text-ink/40 hover:text-ink">▼</button>
                  </div>
                  <input value={c.label} onChange={(e) => patchChild(i, j, { label: e.target.value })} placeholder="Alt link etiketi" className={`${inputBase} w-40`} />
                  <TargetEditor target={c.target} onChange={(t) => patchChild(i, j, { target: t })} pages={pages} allowNone={false} />
                  <button type="button" onClick={() => patchItem(i, { children: it.children.filter((_, cj) => cj !== j) })} className="ml-auto cursor-pointer rounded-lg px-2 py-1.5 text-ink/40 hover:bg-red-50 hover:text-red-600">✕</button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <IconPicker value={c.icon} onChange={(v) => patchChild(i, j, { icon: v })} />
                  <input value={c.description} onChange={(e) => patchChild(i, j, { description: e.target.value })} placeholder="Açıklama" className={`${inputBase} min-w-[220px] flex-1`} />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => patchItem(i, { children: [...it.children, blankNode()] })} className="cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink hover:bg-ink/5">
              + Alt link ekle
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setItems((a) => [...a, { ...blankNode(), children: [] }])} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
          + Üst öğe ekle
        </button>
        <button type="button" onClick={save} disabled={saving} className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {saved && <span className="text-sm text-green-700">Kaydedildi ✓</span>}
      </div>
    </div>
  );
}
