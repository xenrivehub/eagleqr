// Yapılandırılmış çalışma saatleri — Açık/Kapalı rozetini gerçek saate göre hesaplar.
// TR (Europe/Istanbul, UTC+3) sabit; gün: pazartesi..pazar.

export type DayHours = { closed: boolean; open: string; close: string }; // "HH:MM"
export type OpeningHours = Record<DayKey, DayHours>;

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Pazartesi", tue: "Salı", wed: "Çarşamba", thu: "Perşembe",
  fri: "Cuma", sat: "Cumartesi", sun: "Pazar",
};

const TR_OFFSET_MIN = 3 * 60; // UTC+3

export function defaultHours(): OpeningHours {
  const d = (): DayHours => ({ closed: false, open: "09:00", close: "22:00" });
  return { mon: d(), tue: d(), wed: d(), thu: d(), fri: d(), sat: d(), sun: d() };
}

// Gelen JSON'u güvenli biçimde OpeningHours'a çevirir (eksik/bozuk alanlar tolere edilir).
export function parseHours(raw: unknown): OpeningHours | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const out = defaultHours();
  let any = false;
  for (const k of DAY_KEYS) {
    const v = obj[k];
    if (v && typeof v === "object") {
      const d = v as Record<string, unknown>;
      out[k] = {
        closed: Boolean(d.closed),
        open: typeof d.open === "string" && /^\d{2}:\d{2}$/.test(d.open) ? d.open : "09:00",
        close: typeof d.close === "string" && /^\d{2}:\d{2}$/.test(d.close) ? d.close : "22:00",
      };
      any = true;
    }
  }
  return any ? out : null;
}

const toMin = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// Şu an (TR saatiyle) açık mı? Gece yarısını aşan aralıkları (close <= open) da yönetir.
export function isOpenNow(hours: OpeningHours, nowMs: number): { open: boolean; today: DayHours } {
  const tr = new Date(nowMs + TR_OFFSET_MIN * 60_000);
  const dow = tr.getUTCDay(); // 0=Pazar
  const idx = (dow + 6) % 7; // 0=Pazartesi
  const key = DAY_KEYS[idx];
  const prevKey = DAY_KEYS[(idx + 6) % 7];
  const nowMin = tr.getUTCHours() * 60 + tr.getUTCMinutes();
  const today = hours[key];

  const within = (d: DayHours, minute: number): boolean => {
    if (d.closed) return false;
    const o = toMin(d.open);
    const c = toMin(d.close);
    if (c > o) return minute >= o && minute < c; // aynı gün
    return minute >= o || minute < c; // gece yarısını aşan
  };

  // Bugünkü aralık VEYA dünden taşan gece aralığı
  let open = within(today, nowMin);
  if (!open) {
    const prev = hours[prevKey];
    if (!prev.closed && toMin(prev.close) <= toMin(prev.open) && nowMin < toMin(prev.close)) {
      open = true;
    }
  }
  return { open, today };
}
