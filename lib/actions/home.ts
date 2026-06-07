"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { HomeSection } from "@/lib/home-sections";
import type { PricingConfig } from "@/lib/pricing-config";
import { HOME_SECTIONS_KEY, PRICING_CONFIG_KEY } from "@/lib/queries/home";

type Result = { success: true } | { success: false; error: string };

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("Yetkisiz erişim");
}

async function setSetting(key: string, value: string) {
  await prisma.appSetting.upsert({ where: { key }, create: { key, value }, update: { value } });
}

export async function saveHomeSections(sections: HomeSection[]): Promise<Result> {
  try {
    await requireAdmin();
    await setSetting(HOME_SECTIONS_KEY, JSON.stringify(sections));
    revalidatePath("/");
    revalidatePath("/admin/home");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Anasayfa kaydedilemedi." };
  }
}

export async function savePricingConfig(config: PricingConfig): Promise<Result> {
  try {
    await requireAdmin();
    await setSetting(PRICING_CONFIG_KEY, JSON.stringify(config));
    revalidatePath("/");
    revalidatePath("/admin/pricing");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Fiyatlandırma kaydedilemedi." };
  }
}
