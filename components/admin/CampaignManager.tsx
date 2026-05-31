"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addCampaign,
  updateCampaign,
  toggleCampaign,
  deleteCampaign,
} from "@/lib/actions/admin";

export type CampaignRow = {
  id: string;
  label: string;
  color: string;
  translations: Record<string, string>;
  enabled: boolean;
};
export type LangOpt = { code: string; label: string };

const PRESET_COLORS = ["#dc2626", "#ea580c", "#d97706", "#16a34a", "#0891b2", "#2563eb", "#7c3aed", "#db2777", "#475569"];

export default function CampaignManager({
  campaigns,
  languages,
}: {
  campaigns: CampaignRow[];
  languages: LangOpt[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[1]);
  const [err, setErr] = useState<string | null>(null);

  async function add() {
    setErr(null);
    setBusy("add");
    const res = await addCampaign(newLabel, newColor);
    setBusy(null);
    if (res.success) { setNewLabel(""); router.refresh(); }
    else setErr(res.error);
  }
  async function toggle(id: string, enabled: boolean) {
    setBusy(id);
    const res = await toggleCampaign(id, enabled);
    setBusy(null);
    if (res.success) router.refresh();
  }
  async function remove(id: string) {
    setBusy(id);
    const res = await deleteCampaign(id);
    setBusy(null);
    if (res.success) router.refresh();
  }

  return (
    <div className="space-y-3">
      {campaigns.map((c) =>
        editId === c.id ? (
          <CampaignEditor
            key={c.id}
            campaign={c}
            languages={languages}
            onClose={() => setEditId(null)}
            onSaved={() => { setEditId(null); router.refresh(); }}
          />
        ) : (
          <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: c.color }}>
              {c.label}
            </span>
            <span className="text-xs text-ink/45">
              {Object.keys(c.translations).length > 0 ? `${Object.keys(c.translations).length} çeviri` : "çeviri yok"}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={() => setEditId(c.id)} className="cursor-pointer rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink hover:bg-ink/5">
                Düzenle
              </button>
              <button type="button" disabled={busy === c.id} onClick={() => toggle(c.id, !c.enabled)} className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${c.enabled ? "bg-emerald-100 text-emerald-700" : "bg-ink/5 text-ink/50"}`}>
                {c.enabled ? "Açık" : "Kapalı"}
              </button>
              <button type="button" disabled={busy === c.id} onClick={() => remove(c.id)} className="cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                Sil
              </button>
            </div>
          </div>
        ),
      )}

      <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-4">
        <h3 className="text-sm font-semibold text-ink">Yeni kampanya etiketi</h3>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="text-xs font-medium text-ink/60">
            Etiket (TR)
            <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="örn. 2 Al 1 Öde" className="mt-1 block w-48 rounded-lg border border-ink/15 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark" />
          </label>
          <div className="text-xs font-medium text-ink/60">
            Renk
            <div className="mt-1 flex flex-wrap gap-1.5">
              {PRESET_COLORS.map((col) => (
                <button key={col} type="button" onClick={() => setNewColor(col)} aria-label={col}
                  className={`h-7 w-7 cursor-pointer rounded-full border-2 ${newColor === col ? "border-ink" : "border-transparent"}`}
                  style={{ background: col }} />
              ))}
            </div>
          </div>
          <button type="button" disabled={busy === "add"} onClick={add} className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
            {busy === "add" ? "Ekleniyor…" : "Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignEditor({
  campaign,
  languages,
  onClose,
  onSaved,
}: {
  campaign: CampaignRow;
  languages: LangOpt[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [label, setLabel] = useState(campaign.label);
  const [color, setColor] = useState(campaign.color);
  const [tr, setTr] = useState<Record<string, string>>(campaign.translations ?? {});
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await updateCampaign(campaign.id, label, color, tr);
    setSaving(false);
    if (res.success) onSaved();
  }

  return (
    <div className="rounded-2xl border border-brand/40 bg-brand-soft/20 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs font-medium text-ink/60">
          Etiket (TR)
          <input value={label} onChange={(e) => setLabel(e.target.value)} className="mt-1 block w-48 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm" />
        </label>
        <div className="text-xs font-medium text-ink/60">
          Renk
          <div className="mt-1 flex flex-wrap gap-1.5">
            {PRESET_COLORS.map((col) => (
              <button key={col} type="button" onClick={() => setColor(col)} aria-label={col}
                className={`h-7 w-7 cursor-pointer rounded-full border-2 ${color === col ? "border-ink" : "border-transparent"}`}
                style={{ background: col }} />
            ))}
          </div>
        </div>
      </div>

      {languages.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">Çeviriler</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {languages.map((l) => (
              <label key={l.code} className="text-xs text-ink/60">
                {l.label}
                <input
                  value={tr[l.code] ?? ""}
                  onChange={(e) => setTr((p) => ({ ...p, [l.code]: e.target.value }))}
                  placeholder={campaign.label}
                  className="mt-1 block w-full rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button type="button" disabled={saving} onClick={save} className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-dark disabled:opacity-50">
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <button type="button" onClick={onClose} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
          Vazgeç
        </button>
      </div>
    </div>
  );
}
