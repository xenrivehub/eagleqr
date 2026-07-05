"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

type Result = { success: true } | { success: false; error: string };

// İşletme sahibi hesap silme talebi oluşturur — HEMEN silinmez, admin onayı bekler.
export async function requestAccountDeletion(reason: string): Promise<Result> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  const userId = session?.user?.id;
  if (!businessId || !userId) return { success: false, error: "Oturum bulunamadı." };

  const existing = await prisma.accountDeletionRequest.findFirst({
    where: { businessId, status: "PENDING" },
  });
  if (existing) return { success: false, error: "Zaten bekleyen bir silme talebiniz var." };

  await prisma.accountDeletionRequest.create({
    data: {
      businessId,
      requestedById: userId,
      reason: reason.trim().slice(0, 500) || null,
    },
  });
  await logAudit({
    action: "business.deleteRequest",
    targetType: "Business",
    targetId: businessId,
    actorId: userId,
  });
  revalidatePath("/dashboard/account");
  return { success: true };
}

// İşletme sahibi bekleyen talebini geri çeker.
export async function cancelAccountDeletion(): Promise<Result> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) return { success: false, error: "Oturum bulunamadı." };
  await prisma.accountDeletionRequest.deleteMany({ where: { businessId, status: "PENDING" } });
  revalidatePath("/dashboard/account");
  return { success: true };
}
