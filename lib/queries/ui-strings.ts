import { prisma } from "@/lib/prisma";
import { UI_KEYS, type UiStrings } from "@/lib/ui-strings";

const CODE_TR: UiStrings = Object.fromEntries(UI_KEYS.map((k) => [k.key, k.tr]));
const CODE_EN: UiStrings = Object.fromEntries(UI_KEYS.map((k) => [k.key, k.en]));

/**
 * Verilen diller için tüm arayüz metinlerini çözümler.
 * Öncelik: DB[lang] → DB[en] → kod EN → kod TR.
 * (tr için: DB[tr] → kod TR)
 * Dönüş: { lang: { key: value } } — her dil için tüm anahtarlar dolu.
 */
export async function getUiStrings(
  langCodes: string[],
): Promise<Record<string, UiStrings>> {
  const wanted = Array.from(new Set(["tr", "en", ...langCodes]));
  const rows = await prisma.uiTranslation.findMany({
    where: { lang: { in: wanted } },
  });

  const db: Record<string, UiStrings> = {};
  for (const r of rows) {
    (db[r.lang] ??= {})[r.key] = r.value;
  }

  const out: Record<string, UiStrings> = {};
  for (const lang of Array.from(new Set(["tr", ...langCodes]))) {
    const resolved: UiStrings = {};
    for (const k of UI_KEYS) {
      resolved[k.key] =
        db[lang]?.[k.key] ??
        (lang === "tr"
          ? CODE_TR[k.key]
          : (db["en"]?.[k.key] ?? CODE_EN[k.key] ?? CODE_TR[k.key]));
    }
    out[lang] = resolved;
  }
  return out;
}

/** Admin için: bir dilin mevcut (DB) değerleri — boşsa boş bırakılır. */
export async function getUiTranslationsForLang(lang: string): Promise<UiStrings> {
  const rows = await prisma.uiTranslation.findMany({ where: { lang } });
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
