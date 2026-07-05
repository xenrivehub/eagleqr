import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Denetim kaydı yaz. Actor verilmezse oturumdan alınır.
// ASLA throw etmez — denetim kaydı başarısızsa asıl işlem bozulmamalı.
export async function logAudit(params: {
  action: string;
  targetType: string;
  targetId?: string | null;
  meta?: Record<string, unknown>;
  actorId?: string | null;
}): Promise<void> {
  try {
    let actorId = params.actorId ?? null;
    if (actorId == null) {
      const session = await auth();
      actorId = session?.user?.id ?? null;
    }
    await prisma.auditLog.create({
      data: {
        actorId,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId ?? null,
        meta: (params.meta ?? {}) as object,
      },
    });
  } catch {
    // yut
  }
}
