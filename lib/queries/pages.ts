import { prisma } from "@/lib/prisma";
import type { Block } from "@/lib/page-blocks";

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
