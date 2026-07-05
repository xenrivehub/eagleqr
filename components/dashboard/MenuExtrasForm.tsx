"use client";

import { useState } from "react";
import { updateMenuExtras } from "@/lib/actions/business";
import {
  DAY_KEYS,
  DAY_LABELS,
  defaultHours,
  type OpeningHours,
} from "@/lib/opening-hours";

export default function MenuExtrasForm({
  wifiSsid: initSsid,
  wifiPassword: initPass,
  wifiShow: initShow,
  hours: initHours,
}: {
  wifiSsid: string;
  wifiPassword: string;
  wifiShow: boolean;
  hours: OpeningHours | null;
}) {
  const [ssid, setSsid] = useState(initSsid);
  const [pass, setPass] = useState(initPass);
  const [show, setShow] = useState(initShow);
  const [hoursEnabled, setHoursEnabled] = useState(!!initHours);
  const [hours, setHours] = useState<OpeningHours>(initHours ?? defaultHours());
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function setDay(key: (typeof DAY_KEYS)[number], patch: Partial<OpeningHours[typeof key]>) {
    setHours((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  async function save() {
    setPending(true);
    setMsg(null);
    const res = await updateMenuExtras({
      wifiSsid: ssid,
      wifiPassword: pass,
      wifiShow: show,
      openingHours: hoursEnabled ? hours : null,
    });
    setPending(false);
    setMsg(res.success ? { ok: true, text: "Kaydedildi." } : { ok: false, text: res.error });
  }

  const inputCls =
    "h-11 w-full rounded-xl border border-ink/15 bg-white px-3.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

  return (
    <div className="space-y-8">
      {/* WiFi */}
      <div>
        <h3 className="font-display text-base font-semibold text-ink">WiFi bilgisi</h3>
        <p className="mt-1 text-sm text-ink/55">Müşteriler menüde WiFi bilgisini görebilir.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Ağ adı (SSID)</label>
            <input value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Kafe_WiFi" className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Şifre</label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className={inputCls} />
          </div>
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-ink">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="h-4 w-4 rounded border-ink/30 accent-brand-dark" />
          Menüde WiFi bilgisini göster
        </label>
      </div>

      {/* Çalışma saatleri */}
      <div>
        <h3 className="font-display text-base font-semibold text-ink">Çalışma saatleri</h3>
        <p className="mt-1 text-sm text-ink/55">Açıkken menüde gerçek zamanlı “Açık / Kapalı” rozeti gösterilir.</p>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-ink">
          <input type="checkbox" checked={hoursEnabled} onChange={(e) => setHoursEnabled(e.target.checked)} className="h-4 w-4 rounded border-ink/30 accent-brand-dark" />
          Çalışma saatlerini kullan
        </label>

        {hoursEnabled && (
          <div className="mt-4 space-y-2">
            {DAY_KEYS.map((k) => {
              const d = hours[k];
              return (
                <div key={k} className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 bg-white px-3 py-2.5">
                  <span className="w-24 text-sm font-medium text-ink">{DAY_LABELS[k]}</span>
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs text-ink/60">
                    <input type="checkbox" checked={d.closed} onChange={(e) => setDay(k, { closed: e.target.checked })} className="h-3.5 w-3.5 rounded border-ink/30 accent-brand-dark" />
                    Kapalı
                  </label>
                  {!d.closed && (
                    <div className="flex items-center gap-2">
                      <input type="time" value={d.open} onChange={(e) => setDay(k, { open: e.target.value })} className="h-9 rounded-lg border border-ink/15 bg-white px-2 text-sm text-ink" />
                      <span className="text-ink/40">–</span>
                      <input type="time" value={d.close} onChange={(e) => setDay(k, { close: e.target.value })} className="h-9 rounded-lg border border-ink/15 bg-white px-2 text-sm text-ink" />
                    </div>
                  )}
                </div>
              );
            })}
            <p className="text-xs text-ink/45">Gece yarısını aşan saatler (örn. 18:00–02:00) desteklenir.</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {msg && <span className={`text-sm ${msg.ok ? "text-green-700" : "text-red-600"}`}>{msg.text}</span>}
      </div>
    </div>
  );
}
