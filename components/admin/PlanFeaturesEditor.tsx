"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLAN_LABELS, type Plan } from "@/lib/plans";
import {
  FEATURE_KEYS,
  FEATURE_META,
  type PlanFeatures,
} from "@/lib/plan-features";
import { setPlanFeatures } from "@/lib/actions/admin";

export type PlanFeatureRow = { plan: Plan; features: PlanFeatures };

function Row({ row }: { row: PlanFeatureRow }) {
  const router = useRouter();
  const [feat, setFeat] = useState<PlanFeatures>(row.features);
  const [saving, setSaving] = useState(false);
  const dirty = FEATURE_KEYS.some((k) => feat[k] !== row.features[k]);

  async function save() {
    setSaving(true);
    const res = await setPlanFeatures(row.plan, feat);
    setSaving(false);
    if (res.success) router.refresh();
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-cream">
          {PLAN_LABELS[row.plan]}
        </span>
        <button
          type="button"
          disabled={!dirty || saving}
          onClick={save}
          className="cursor-pointer rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {FEATURE_KEYS.map((k) => (
          <label
            key={k}
            className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-ink/10 p-3 transition-colors hover:bg-cream"
          >
            <input
              type="checkbox"
              checked={feat[k]}
              onChange={(e) => setFeat((f) => ({ ...f, [k]: e.target.checked }))}
              className="mt-0.5 h-4 w-4 cursor-pointer accent-brand-dark"
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink">{FEATURE_META[k].label}</span>
              <span className="block text-xs leading-snug text-ink/50">{FEATURE_META[k].desc}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function PlanFeaturesEditor({ rows }: { rows: PlanFeatureRow[] }) {
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <Row key={r.plan} row={r} />
      ))}
    </div>
  );
}
