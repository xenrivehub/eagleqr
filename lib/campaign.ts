// Kampanya yardımcıları. Saat aralığı kontrolü Türkiye yerel saatine göre (UTC+3).

const TR_OFFSET_MS = 3 * 3600_000;

export type CampaignInfo = {
  id: string;
  label: string; // temel (TR) etiket
  color: string;
  translations: Record<string, string>; // lang -> etiket
};

function toMinutes(t: string | null | undefined): number | null {
  if (!t) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** Geçerli "HH:MM" mi? */
export function isValidTime(t: string): boolean {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
  if (!m) return false;
  return Number(m[1]) <= 23 && Number(m[2]) <= 59;
}

/** Kampanya şu an aktif mi? (aralık yoksa hep aktif; gece aşırı aralık desteklenir) */
export function isCampaignActive(start: string | null, end: string | null): boolean {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (s === null && e === null) return true;
  const d = new Date(Date.now() + TR_OFFSET_MS);
  const mins = d.getUTCHours() * 60 + d.getUTCMinutes();
  const lo = s ?? 0;
  const hi = e ?? 1440;
  return lo <= hi ? mins >= lo && mins <= hi : mins >= lo || mins <= hi;
}

/** Servis saatleri için: şu an açık mı? (kampanya aktiflik mantığıyla aynı) */
export const isWithinWindow = isCampaignActive;

/** TR yerel tarih "YYYY-MM-DD". */
function trToday(): string {
  return new Date(Date.now() + TR_OFFSET_MS).toISOString().slice(0, 10);
}

/** Kampanya şu an canlı mı? Hem tarih aralığı hem saat aralığı geçmeli. */
export function isCampaignLive(
  timeStart: string | null,
  timeEnd: string | null,
  dateStart: string | null,
  dateEnd: string | null,
): boolean {
  const today = trToday();
  if (dateStart && today < dateStart) return false;
  if (dateEnd && today > dateEnd) return false;
  return isCampaignActive(timeStart, timeEnd);
}

/** İndirim/zam uygula (tam sayıya yuvarla, negatif olmaz). */
export function applyDiscount(
  base: number,
  type: "percent" | "fixed",
  value: number,
): number {
  const delta = type === "percent" ? (base * value) / 100 : value;
  return Math.max(0, Math.round(base - delta));
}

export type Variation = { name: string; icon?: string; price: number };

/** Aktif dile göre kampanya etiketi (yoksa TR'ye düşer). */
export function campaignLabel(c: CampaignInfo, lang: string): string {
  return (lang !== "tr" && c.translations?.[lang]) || c.label;
}
