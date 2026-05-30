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
