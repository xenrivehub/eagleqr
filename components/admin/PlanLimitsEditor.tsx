"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLAN_LABELS, type Plan } from "@/lib/plans";
import { setPlanLimit } from "@/lib/actions/admin";

export type PlanLimitRow = { plan: Plan; videoLimit: number; arLimit: number };

function Row({ row }: { row: PlanLimitRow }) {
  const router = useRouter();
  const [video, setVideo] = useState(row.videoLimit);
  const [ar, setAr] = useState(row.arLimit);
  const [saving, setSaving] = useState(false);
  const dirty = video !== row.videoLimit || ar !== row.arLimit;

  async function save() {
    setSaving(true);
    const res = await setPlanLimit(row.plan, video, ar);
    setSaving(false);
    if (res.success) router.refresh();
  }

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-2xl border border-ink/10 bg-white p-5">
      <div className="min-w-[110px]">
        <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-cream">
          {PLAN_LABELS[row.plan]}
        </span>
      </div>
      <label className="text-sm text-ink/70">
        <span className="mb-1 block text-xs font-medium text-ink/60">Video limiti (ürün)</span>
        <input
          type="number"
          min={0}
          value={video}
          onChange={(e) => setVideo(Math.max(0, Number(e.target.value) || 0))}
          className="w-28 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
        />
      </label>
      <label className="text-sm text-ink/70">
        <span className="mb-1 block text-xs font-medium text-ink/60">AR/3D limiti (ürün)</span>
        <input
          type="number"
          min={0}
          value={ar}
          onChange={(e) => setAr(Math.max(0, Number(e.target.value) || 0))}
          className="w-28 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
        />
      </label>
      <button
        type="button"
        disabled={!dirty || saving}
        onClick={save}
        className="cursor-pointer rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
      >
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </div>
  );
}

export default function PlanLimitsEditor({ rows }: { rows: PlanLimitRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <Row key={r.plan} row={r} />
      ))}
    </div>
  );
}
