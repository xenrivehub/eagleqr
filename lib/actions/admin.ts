"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { THEMES, isThemeFree } from "@/lib/themes";
import { PLANS, type Plan } from "@/lib/plans";
import type { BusinessStatus, BusinessType } from "@prisma/client";

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Yetkisiz erişim");
  }
}

const ALLOWED: BusinessStatus[] = ["PENDING", "ACTIVE", "SUSPENDED"];

export async function setBusinessStatus(
  id: string,
  status: BusinessStatus,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!ALLOWED.includes(status)) {
      return { success: false, error: "Geçersiz durum." };
    }
    await prisma.business.update({ where: { id }, data: { status } });
    revalidatePath("/admin/businesses");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Durum güncellenemedi." };
  }
}

export async function setBusinessType(
  id: string,
  type: BusinessType,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (type !== "SINGLE" && type !== "CHAIN") {
      return { success: false, error: "Geçersiz tür." };
    }

    await prisma.business.update({ where: { id }, data: { type } });

    // Zincire çevrildiğinde slug'sız menülere şube slug'ı ata
    if (type === "CHAIN") {
      const menus = await prisma.menu.findMany({
        where: { businessId: id },
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, slug: true },
      });
      const used = new Set(menus.map((m) => m.slug).filter(Boolean) as string[]);
      let idx = 0;
      for (const m of menus) {
        if (m.slug) continue;
        idx += 1;
        let base = slugify(m.name) || `sube-${idx}`;
        let slug = base;
        let n = 1;
        while (used.has(slug)) {
          n += 1;
          slug = `${base}-${n}`;
        }
        used.add(slug);
        await prisma.menu.update({ where: { id: m.id }, data: { slug } });
      }
    }

    revalidatePath("/admin/businesses");
    return { success: true };
  } catch {
    return { success: false, error: "Tür güncellenemedi." };
  }
}

// İşletmenin üyelik planını ayarla (STANDART / PRO / MAX).
export async function setBusinessPlan(id: string, plan: Plan): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!PLANS.includes(plan)) return { success: false, error: "Geçersiz plan." };
    await prisma.business.update({ where: { id }, data: { plan } });
    revalidatePath("/admin/businesses");
    return { success: true };
  } catch {
    return { success: false, error: "Plan güncellenemedi." };
  }
}

// İşletmeye plan dışı ekstra medya kotası ver (video / AR).
export async function setBusinessMediaQuota(
  id: string,
  videoQuota: number,
  arQuota: number,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const v = Math.trunc(videoQuota);
    const a = Math.trunc(arQuota);
    if (!Number.isFinite(v) || !Number.isFinite(a) || v < 0 || a < 0) {
      return { success: false, error: "Kota negatif olamaz." };
    }
    await prisma.business.update({
      where: { id },
      data: { videoQuota: v, arQuota: a },
    });
    revalidatePath("/admin/businesses");
    return { success: true };
  } catch {
    return { success: false, error: "Kota güncellenemedi." };
  }
}

// Plan başına medya limitlerini düzenle (dinamik — admin paneli).
export async function setPlanLimit(
  plan: Plan,
  videoLimit: number,
  arLimit: number,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!PLANS.includes(plan)) return { success: false, error: "Geçersiz plan." };
    const v = Math.trunc(videoLimit);
    const a = Math.trunc(arLimit);
    if (!Number.isFinite(v) || !Number.isFinite(a) || v < 0 || a < 0) {
      return { success: false, error: "Limit negatif olamaz." };
    }
    await prisma.planLimit.upsert({
      where: { plan },
      create: { plan, videoLimit: v, arLimit: a },
      update: { videoLimit: v, arLimit: a },
    });
    revalidatePath("/admin/plans");
    return { success: true };
  } catch {
    return { success: false, error: "Limit güncellenemedi." };
  }
}

// ---------------------------------------------------------------------------
// Para birimleri (dinamik)
// ---------------------------------------------------------------------------

export type CurrencyInput = {
  code: string;
  symbol: string;
  label: string;
  position: "before" | "after";
  space: boolean;
  decimals: number;
};

export async function addCurrency(input: CurrencyInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const code = input.code.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(code)) {
      return { success: false, error: "Geçersiz kod (3 harf, örn. USD)." };
    }
    if (!input.symbol.trim() || !input.label.trim()) {
      return { success: false, error: "Sembol ve ad gerekli." };
    }
    if (input.position !== "before" && input.position !== "after") {
      return { success: false, error: "Geçersiz konum." };
    }
    const decimals = Math.trunc(input.decimals);
    if (decimals < 0 || decimals > 4) {
      return { success: false, error: "Ondalık 0-4 arası olmalı." };
    }
    const exists = await prisma.currency.findUnique({ where: { code } });
    if (exists) return { success: false, error: "Bu para birimi zaten ekli." };

    const max = await prisma.currency.aggregate({ _max: { sortOrder: true } });
    await prisma.currency.create({
      data: {
        code,
        symbol: input.symbol.trim(),
        label: input.label.trim(),
        position: input.position,
        space: input.space,
        decimals,
        sortOrder: (max._max.sortOrder ?? 0) + 1,
      },
    });
    revalidatePath("/admin/currencies");
    return { success: true };
  } catch {
    return { success: false, error: "Para birimi eklenemedi." };
  }
}

export async function updateCurrency(input: CurrencyInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const code = input.code.trim().toUpperCase();
    if (input.position !== "before" && input.position !== "after") {
      return { success: false, error: "Geçersiz konum." };
    }
    const decimals = Math.trunc(input.decimals);
    if (decimals < 0 || decimals > 4) {
      return { success: false, error: "Ondalık 0-4 arası olmalı." };
    }
    await prisma.currency.update({
      where: { code },
      data: {
        symbol: input.symbol.trim(),
        label: input.label.trim(),
        position: input.position,
        space: input.space,
        decimals,
      },
    });
    revalidatePath("/admin/currencies");
    return { success: true };
  } catch {
    return { success: false, error: "Para birimi güncellenemedi." };
  }
}

export async function toggleCurrency(code: string, enabled: boolean): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.currency.update({ where: { code }, data: { enabled } });
    revalidatePath("/admin/currencies");
    return { success: true };
  } catch {
    return { success: false, error: "Para birimi güncellenemedi." };
  }
}

export async function deleteCurrency(code: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (code === "TRY") return { success: false, error: "TRY silinemez (varsayılan)." };
    await prisma.currency.delete({ where: { code } });
    revalidatePath("/admin/currencies");
    return { success: true };
  } catch {
    return { success: false, error: "Para birimi silinemedi." };
  }
}

// ---------------------------------------------------------------------------
// Diller & çeviri modeli (dinamik)
// ---------------------------------------------------------------------------

export async function addLanguage(
  code: string,
  label: string,
  nativeLabel: string,
  rtl: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const c = code.trim().toLowerCase();
    if (!/^[a-z]{2}(-[a-z]{2})?$/.test(c)) {
      return { success: false, error: "Geçersiz dil kodu (örn. en, de, pt-br)." };
    }
    if (c === "tr") return { success: false, error: "TR temel dildir, eklenemez." };
    if (!label.trim() || !nativeLabel.trim()) {
      return { success: false, error: "Dil adı gerekli." };
    }
    const exists = await prisma.language.findUnique({ where: { code: c } });
    if (exists) return { success: false, error: "Bu dil zaten ekli." };

    const max = await prisma.language.aggregate({ _max: { sortOrder: true } });
    await prisma.language.create({
      data: {
        code: c,
        label: label.trim(),
        nativeLabel: nativeLabel.trim(),
        rtl,
        sortOrder: (max._max.sortOrder ?? 0) + 1,
      },
    });
    revalidatePath("/admin/languages");
    return { success: true };
  } catch {
    return { success: false, error: "Dil eklenemedi." };
  }
}

export async function toggleLanguage(code: string, enabled: boolean): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.language.update({ where: { code }, data: { enabled } });
    revalidatePath("/admin/languages");
    return { success: true };
  } catch {
    return { success: false, error: "Dil güncellenemedi." };
  }
}

export async function deleteLanguage(code: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.language.delete({ where: { code } });
    revalidatePath("/admin/languages");
    return { success: true };
  } catch {
    return { success: false, error: "Dil silinemedi." };
  }
}

// Arayüz metni çevirileri — bir dil için anahtar/değer çiftlerini kaydet.
// Boş değer gönderilirse o anahtarın çevirisi silinir (fallback'e döner).
export async function setUiTranslations(
  lang: string,
  entries: Record<string, string>,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const code = lang.trim().toLowerCase();
    if (!code) return { success: false, error: "Dil gerekli." };

    for (const [key, raw] of Object.entries(entries)) {
      const value = (raw ?? "").trim();
      if (value) {
        await prisma.uiTranslation.upsert({
          where: { lang_key: { lang: code, key } },
          create: { lang: code, key, value },
          update: { value },
        });
      } else {
        await prisma.uiTranslation.deleteMany({ where: { lang: code, key } });
      }
    }
    revalidatePath("/admin/ui-strings");
    return { success: true };
  } catch {
    return { success: false, error: "Çeviriler kaydedilemedi." };
  }
}

export async function setTranslationModel(model: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const v = model.trim();
    if (!v) return { success: false, error: "Model adı gerekli." };
    await prisma.appSetting.upsert({
      where: { key: "translation_model" },
      create: { key: "translation_model", value: v },
      update: { value: v },
    });
    revalidatePath("/admin/languages");
    return { success: true };
  } catch {
    return { success: false, error: "Model güncellenemedi." };
  }
}

// Bir işletmeye premium (kilitli) tema erişimi aç/kapat.
// Free temalar her zaman açık olduğundan allowedThemes'e yazılmaz.
export async function setBusinessThemeAccess(
  id: string,
  themeKey: string,
  allow: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!THEMES.some((t) => t.key === themeKey) || isThemeFree(themeKey)) {
      return { success: false, error: "Geçersiz tema." };
    }

    const business = await prisma.business.findUnique({
      where: { id },
      select: { allowedThemes: true, themeKey: true, slug: true },
    });
    if (!business) return { success: false, error: "İşletme bulunamadı." };

    const set = new Set(business.allowedThemes);
    if (allow) set.add(themeKey);
    else set.delete(themeKey);
    const next = [...set];

    // Erişim kapatılan tema şu an kullanılıyorsa varsayılan free temaya düşür
    const data: { allowedThemes: string[]; themeKey?: string } = {
      allowedThemes: next,
    };
    if (!allow && business.themeKey === themeKey) {
      data.themeKey = "mineral";
    }

    await prisma.business.update({ where: { id }, data });
    revalidatePath("/admin/businesses");
    if (data.themeKey) revalidatePath(`/m/${business.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Tema erişimi güncellenemedi." };
  }
}
