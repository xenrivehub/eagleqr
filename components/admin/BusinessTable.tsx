"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BusinessStatus, BusinessType } from "@prisma/client";
import {
  setBusinessStatus,
  setBusinessType,
  setBusinessThemeAccess,
  setBusinessPlan,
  setBusinessMediaQuota,
} from "@/lib/actions/admin";
import { THEMES, isThemeFree } from "@/lib/themes";
import { PLANS, PLAN_LABELS, type Plan } from "@/lib/plans";

const PREMIUM_THEMES = THEMES.filter((t) => !isThemeFree(t.key));

export type BusinessRow = {
  id: string;
  name: string;
  slug: string;
  status: BusinessStatus;
  type: BusinessType;
  ownerEmail: string | null;
  productCount: number;
  allowedThemes: string[];
  plan: Plan;
  videoQuota: number;
  arQuota: number;
};

const statusLabel: Record<BusinessStatus, string> = {
  PENDING: "Onay bekliyor",
  ACTIVE: "Aktif",
  SUSPENDED: "Askıda",
};

const statusClass: Record<BusinessStatus, string> = {
  PENDING: "bg-brand-soft text-brand-dark",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  SUSPENDED: "bg-red-100 text-red-700",
};

export default function BusinessTable({ businesses }: { businesses: BusinessRow[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [themeBusy, setThemeBusy] = useState<string | null>(null);

  async function change(id: string, status: BusinessStatus) {
    setPendingId(id);
    const res = await setBusinessStatus(id, status);
    setPendingId(null);
    if (res.success) router.refresh();
  }

  async function changeType(id: string, type: BusinessType) {
    setPendingId(id);
    const res = await setBusinessType(id, type);
    setPendingId(null);
    if (res.success) router.refresh();
  }

  async function toggleTheme(id: string, themeKey: string, allow: boolean) {
    setThemeBusy(`${id}:${themeKey}`);
    const res = await setBusinessThemeAccess(id, themeKey, allow);
    setThemeBusy(null);
    if (res.success) router.refresh();
  }

  async function changePlan(id: string, plan: Plan) {
    setPendingId(id);
    const res = await setBusinessPlan(id, plan);
    setPendingId(null);
    if (res.success) router.refresh();
  }

  if (businesses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-12 text-center">
        <p className="font-display text-lg font-semibold text-ink">Henüz işletme yok</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wider text-ink/50">
            <th className="px-5 py-3 font-semibold">İşletme</th>
            <th className="px-5 py-3 font-semibold">Sahip</th>
            <th className="px-5 py-3 font-semibold">Ürün</th>
            <th className="px-5 py-3 font-semibold">Tür</th>
            <th className="px-5 py-3 font-semibold">Plan</th>
            <th className="px-5 py-3 font-semibold">Durum</th>
            <th className="px-5 py-3 text-right font-semibold">İşlemler</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/5">
          {businesses.map((b) => {
            const busy = pendingId === b.id;
            const expanded = expandedId === b.id;
            return (
              <Fragment key={b.id}>
              <tr className="transition-colors hover:bg-cream/60">
                <td className="px-5 py-3.5">
                  <div className="font-medium text-ink">{b.name}</div>
                  <Link
                    href={`/m/${b.slug}`}
                    target="_blank"
                    className="text-xs text-ink/50 hover:text-brand-dark hover:underline"
                  >
                    /m/{b.slug}
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-ink/70">{b.ownerEmail ?? "—"}</td>
                <td className="px-5 py-3.5 tabular-nums text-ink/70">{b.productCount}</td>
                <td className="px-5 py-3.5">
                  <div className="inline-flex overflow-hidden rounded-full border border-ink/15 text-xs">
                    {(["SINGLE", "CHAIN"] as BusinessType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        disabled={busy || b.type === t}
                        onClick={() => changeType(b.id, t)}
                        className={`cursor-pointer px-2.5 py-1 font-semibold transition-colors disabled:cursor-default ${
                          b.type === t
                            ? "bg-ink text-cream"
                            : "text-ink/60 hover:bg-ink/5"
                        }`}
                      >
                        {t === "SINGLE" ? "Tekil" : "Zincir"}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="inline-flex overflow-hidden rounded-full border border-ink/15 text-xs">
                    {PLANS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        disabled={busy || b.plan === p}
                        onClick={() => changePlan(b.id, p)}
                        className={`cursor-pointer px-2.5 py-1 font-semibold transition-colors disabled:cursor-default ${
                          b.plan === p ? "bg-ink text-cream" : "text-ink/60 hover:bg-ink/5"
                        }`}
                      >
                        {PLAN_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[b.status]}`}>
                    {statusLabel[b.status]}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : b.id)}
                      className="cursor-pointer rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-ink/5"
                    >
                      Temalar{b.allowedThemes.length > 0 ? ` (${b.allowedThemes.length})` : ""}
                    </button>
                    {b.status !== "ACTIVE" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => change(b.id, "ACTIVE")}
                        className="cursor-pointer rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
                      >
                        {b.status === "PENDING" ? "Onayla" : "Aktifleştir"}
                      </button>
                    )}
                    {b.status !== "SUSPENDED" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => change(b.id, "SUSPENDED")}
                        className="cursor-pointer rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        Askıya al
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {expanded && (
                <tr className="bg-cream/40">
                  <td colSpan={7} className="px-5 py-4">
                    <QuotaEditor
                      id={b.id}
                      videoQuota={b.videoQuota}
                      arQuota={b.arQuota}
                    />
                    <p className="mb-2.5 mt-5 text-xs font-semibold uppercase tracking-wider text-ink/50">
                      Premium tema erişimi — açtığınız temaları işletme kullanabilir
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PREMIUM_THEMES.map((t) => {
                        const on = b.allowedThemes.includes(t.key);
                        const tBusy = themeBusy === `${b.id}:${t.key}`;
                        return (
                          <button
                            key={t.key}
                            type="button"
                            disabled={tBusy}
                            onClick={() => toggleTheme(b.id, t.key, !on)}
                            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                              on
                                ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                                : "border-ink/15 text-ink/60 hover:bg-ink/5"
                            }`}
                          >
                            {on ? "✓ " : "🔒 "}
                            {t.name}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2.5 text-xs text-ink/45">
                      Mineral ve Maison her işletmede ücretsiz açıktır.
                    </p>
                  </td>
                </tr>
              )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function QuotaEditor({
  id,
  videoQuota,
  arQuota,
}: {
  id: string;
  videoQuota: number;
  arQuota: number;
}) {
  const router = useRouter();
  const [video, setVideo] = useState(videoQuota);
  const [ar, setAr] = useState(arQuota);
  const [saving, setSaving] = useState(false);
  const dirty = video !== videoQuota || ar !== arQuota;

  async function save() {
    setSaving(true);
    const res = await setBusinessMediaQuota(id, video, ar);
    setSaving(false);
    if (res.success) router.refresh();
  }

  return (
    <div>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-ink/50">
        Ekstra medya kotası — plan limitinin üzerine eklenir (plan-dışı hak verir)
      </p>
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm text-ink/70">
          <span className="mb-1 block text-xs font-medium text-ink/60">Ekstra video hakkı</span>
          <input
            type="number"
            min={0}
            value={video}
            onChange={(e) => setVideo(Math.max(0, Number(e.target.value) || 0))}
            className="w-28 rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
          />
        </label>
        <label className="text-sm text-ink/70">
          <span className="mb-1 block text-xs font-medium text-ink/60">Ekstra AR/3D hakkı</span>
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
          className="cursor-pointer rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-50"
        >
          {saving ? "Kaydediliyor…" : "Kotayı kaydet"}
        </button>
      </div>
    </div>
  );
}
