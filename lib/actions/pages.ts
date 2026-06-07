"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma, PageStatus } from "@prisma/client";
import type { Block } from "@/lib/page-blocks";
import { normalizeSlug, isReservedSlug } from "@/lib/reserved-slugs";

type Result = { success: true } | { success: false; error: string };
type CreateResult = { success: true; id: string } | { success: false; error: string };

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") throw new Error("Yetkisiz erişim");
}

/** Slug doğrulama: normalize, rezerve, benzersiz. */
async function validateSlug(raw: string, excludeId?: string): Promise<{ ok: true; slug: string } | { ok: false; error: string }> {
  const slug = normalizeSlug(raw);
  if (slug.length < 2) return { ok: false, error: "Geçerli bir adres (slug) girin." };
  if (isReservedSlug(slug)) return { ok: false, error: `"${slug}" rezerve bir adres, kullanılamaz.` };
  const existing = await prisma.page.findUnique({ where: { slug }, select: { id: true } });
  if (existing && existing.id !== excludeId) return { ok: false, error: "Bu adres zaten kullanılıyor." };
  return { ok: true, slug };
}

export async function createPage(title: string, slugInput: string): Promise<CreateResult> {
  try {
    await requireAdmin();
    const t = title.trim();
    if (t.length < 2) return { success: false, error: "Sayfa başlığı gerekli." };
    const v = await validateSlug(slugInput || title);
    if (!v.ok) return { success: false, error: v.error };
    const page = await prisma.page.create({
      data: { title: t, slug: v.slug, blocks: [] },
      select: { id: true },
    });
    revalidatePath("/admin/pages");
    return { success: true, id: page.id };
  } catch {
    return { success: false, error: "Sayfa oluşturulamadı." };
  }
}

export async function updatePage(
  id: string,
  input: { title: string; slug: string; seoTitle: string; seoDescription: string; blocks: Block[] },
): Promise<Result> {
  try {
    await requireAdmin();
    const t = input.title.trim();
    if (t.length < 2) return { success: false, error: "Sayfa başlığı gerekli." };
    const v = await validateSlug(input.slug, id);
    if (!v.ok) return { success: false, error: v.error };
    await prisma.page.update({
      where: { id },
      data: {
        title: t,
        slug: v.slug,
        seoTitle: input.seoTitle.trim() || null,
        seoDescription: input.seoDescription.trim() || null,
        blocks: input.blocks as unknown as Prisma.InputJsonValue,
      },
    });
    revalidatePath("/admin/pages");
    revalidatePath(`/${v.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Sayfa kaydedilemedi." };
  }
}

export async function setPageStatus(id: string, status: PageStatus): Promise<Result> {
  try {
    await requireAdmin();
    if (status !== "DRAFT" && status !== "PUBLISHED") return { success: false, error: "Geçersiz durum." };
    const page = await prisma.page.update({ where: { id }, data: { status }, select: { slug: true } });
    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Durum güncellenemedi." };
  }
}

export async function deletePage(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const page = await prisma.page.delete({ where: { id }, select: { slug: true } });
    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Sayfa silinemedi." };
  }
}
