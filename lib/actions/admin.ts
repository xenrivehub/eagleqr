"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
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
