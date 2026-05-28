"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { BusinessStatus } from "@prisma/client";

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
