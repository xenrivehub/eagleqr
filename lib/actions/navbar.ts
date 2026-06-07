"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Result = { success: true } | { success: false; error: string };

export type NavInput = {
  label: string;
  description?: string | null;
  icon?: string | null;
  url?: string | null;
  pageId?: string | null;
  children?: NavInput[];
};

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("Yetkisiz erişim");
}

function cleanTarget(item: NavInput): { url: string | null; pageId: string | null } {
  // pageId öncelikli; yoksa url
  if (item.pageId) return { url: null, pageId: item.pageId };
  const url = item.url?.trim();
  return { url: url || null, pageId: null };
}

/** Navbar'ı tamamen yeniden yazar (replace-all). Sıra = dizi indeksi. */
export async function saveNavbar(items: NavInput[]): Promise<Result> {
  try {
    await requireAdmin();
    await prisma.$transaction(async (tx) => {
      await tx.navItem.deleteMany({});
      for (const [i, top] of items.entries()) {
        const label = top.label.trim();
        if (!label) continue;
        const t = cleanTarget(top);
        const created = await tx.navItem.create({
          data: {
            label, url: t.url, pageId: t.pageId, order: i,
            description: top.description?.trim() || null,
            icon: top.icon?.trim() || null,
          },
          select: { id: true },
        });
        for (const [j, child] of (top.children ?? []).entries()) {
          const clabel = child.label.trim();
          if (!clabel) continue;
          const ct = cleanTarget(child);
          await tx.navItem.create({
            data: {
              label: clabel, url: ct.url, pageId: ct.pageId, parentId: created.id, order: j,
              description: child.description?.trim() || null,
              icon: child.icon?.trim() || null,
            },
          });
        }
      }
    });
    revalidatePath("/admin/navbar");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("saveNavbar error:", e);
    const msg = e instanceof Error ? e.message : "Navbar kaydedilemedi.";
    return { success: false, error: msg };
  }
}
