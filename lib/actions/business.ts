"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

type ActionResult = { success: true } | { success: false; error: string };

async function requireBusinessId(): Promise<string> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) throw new Error("Yetkisiz erişim");
  return businessId;
}

async function uniqueBranchSlug(
  businessId: string,
  name: string,
  excludeMenuId?: string,
): Promise<string> {
  const base = slugify(name) || "sube";
  let slug = base;
  let n = 1;
  // aynı işletme içinde benzersiz olana kadar
  // (excludeMenuId: rename sırasında kendisini hariç tut)
  while (true) {
    const existing = await prisma.menu.findFirst({
      where: { businessId, slug, NOT: excludeMenuId ? { id: excludeMenuId } : undefined },
      select: { id: true },
    });
    if (!existing) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

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

// ---------------------------------------------------------------------------
// İşletme bilgileri (profil)
// ---------------------------------------------------------------------------

export type BusinessInfoInput = {
  name: string;
  logoUrl: string | null;
  phone: string;
  contactEmail: string;
  address: string;
  about: string;
  openingHours: string;
};

export async function updateBusinessInfo(
  input: BusinessInfoInput,
): Promise<ActionResult> {
  const businessId = await requireBusinessId().catch(() => null);
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };

  const name = input.name.trim();
  if (name.length < 2) {
    return { success: false, error: "İşletme adı en az 2 karakter olmalı." };
  }

  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: {
        name,
        logoUrl: input.logoUrl || null,
        phone: input.phone.trim() || null,
        contactEmail: input.contactEmail.trim() || null,
        address: input.address.trim() || null,
        about: input.about.trim() || null,
        openingHours: input.openingHours.trim() || null,
      },
      select: { slug: true },
    });
    revalidatePath("/dashboard/settings");
    revalidatePath(`/m/${business.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Kaydedilemedi." };
  }
}

// ---------------------------------------------------------------------------
// Şube (menü) yönetimi — yalnızca zincir işletmeler için anlamlı
// ---------------------------------------------------------------------------

export async function createBranch(name: string): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const trimmed = name.trim();
    if (trimmed.length < 1) return { success: false, error: "Şube adı gerekli." };

    const slug = await uniqueBranchSlug(businessId, trimmed);
    await prisma.menu.create({
      data: { businessId, name: trimmed, slug, schedule: "ALL_DAY" },
    });
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Şube oluşturulamadı." };
  }
}

export async function updateBranch(
  menuId: string,
  name: string,
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const owned = await prisma.menu.findFirst({
      where: { id: menuId, businessId },
      select: { id: true },
    });
    if (!owned) return { success: false, error: "Şube bulunamadı." };

    const trimmed = name.trim();
    if (trimmed.length < 1) return { success: false, error: "Şube adı gerekli." };

    const slug = await uniqueBranchSlug(businessId, trimmed, menuId);
    await prisma.menu.update({
      where: { id: menuId },
      data: { name: trimmed, slug },
    });
    revalidatePath("/dashboard/menu");
    revalidatePath(`/dashboard/menu/${menuId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Şube güncellenemedi." };
  }
}

export async function deleteBranch(menuId: string): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const owned = await prisma.menu.findFirst({
      where: { id: menuId, businessId },
      select: { id: true },
    });
    if (!owned) return { success: false, error: "Şube bulunamadı." };

    const count = await prisma.menu.count({ where: { businessId } });
    if (count <= 1) {
      return { success: false, error: "Son şube silinemez." };
    }

    await prisma.menu.delete({ where: { id: menuId } });
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Şube silinemedi." };
  }
}
