import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ACTIVE_BRANCH_COOKIE = "eq_branch";

/**
 * Zincir işletmede aktif şubeyi (menüyü) döndürür.
 * Cookie'deki seçim geçersizse ilk şubeye düşer; şube yoksa null.
 */
export async function getActiveBranch(businessId: string) {
  const branches = await prisma.menu.findMany({
    where: { businessId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, slug: true },
  });
  if (branches.length === 0) return { branches, active: null };

  const store = await cookies();
  const stored = store.get(ACTIVE_BRANCH_COOKIE)?.value;
  const active = branches.find((b) => b.id === stored) ?? branches[0];
  return { branches, active };
}
