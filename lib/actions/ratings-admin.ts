"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Result = { success: true } | { success: false; error: string };

async function requireBusinessId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.businessId ?? null;
}

// Tek ürünün tüm puanlarını sıfırlar (kötü niyetli oy saldırısına karşı).
export async function resetProductRatings(productId: string): Promise<Result> {
  const businessId = await requireBusinessId();
  if (!businessId) return { success: false, error: "Oturum bulunamadı." };
  const owned = await prisma.product.findFirst({
    where: { id: productId, businessId },
    select: { id: true },
  });
  if (!owned) return { success: false, error: "Ürün bulunamadı." };
  await prisma.productRating.deleteMany({ where: { productId } });
  revalidatePath("/dashboard/ratings");
  return { success: true };
}

// İşletmenin tüm ürünlerinin puanlarını sıfırlar.
export async function resetAllRatings(): Promise<Result> {
  const businessId = await requireBusinessId();
  if (!businessId) return { success: false, error: "Oturum bulunamadı." };
  await prisma.productRating.deleteMany({ where: { product: { businessId } } });
  revalidatePath("/dashboard/ratings");
  return { success: true };
}
