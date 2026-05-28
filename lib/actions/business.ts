"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ActionResult = { success: true } | { success: false; error: string };

export type StorefrontInput = {
  coverUrl: string | null;
  heroOverline: string;
  heroTitle: string;
  heroSubtitle: string;
};

export async function updateStorefront(
  input: StorefrontInput,
): Promise<ActionResult> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };

  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: {
        coverUrl: input.coverUrl || null,
        heroOverline: input.heroOverline.trim() || null,
        heroTitle: input.heroTitle.trim() || null,
        heroSubtitle: input.heroSubtitle.trim() || null,
      },
      select: { slug: true },
    });
    revalidatePath("/dashboard/storefront");
    revalidatePath(`/m/${business.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Kaydedilemedi." };
  }
}
