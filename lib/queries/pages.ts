import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { Block } from "@/lib/page-blocks";
import { LEGAL_DEFAULTS } from "@/lib/legal-defaults";

/** Yasal sayfaları (yoksa) varsayılan içerikle oluşturur. Idempotent. */
export async function ensureLegalPages() {
  await prisma.page.createMany({
    data: LEGAL_DEFAULTS.map((d) => ({
      slug: d.slug,
      title: d.title,
      seoTitle: d.seoTitle,
      seoDescription: d.seoDescription,
      status: "PUBLISHED" as const,
      blocks: d.blocks as unknown as Prisma.InputJsonValue,
    })),
    skipDuplicates: true,
  });
}

export async function listPages() {
  return prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, slug: true, status: true, updatedAt: true },
  });
}

export async function getPageForEdit(id: string) {
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return null;
  return { ...page, blocks: (page.blocks as unknown as Block[]) ?? [] };
}

export async function getPageBySlug(slug: string) {
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return null;
  return { ...page, blocks: (page.blocks as unknown as Block[]) ?? [] };
}
