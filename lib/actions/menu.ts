"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ActionResult = { success: true } | { success: false; error: string };

async function requireBusinessId(): Promise<string> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) throw new Error("Yetkisiz erişim");
  return businessId;
}

/** İşletmenin varsayılan menüsünü getirir, yoksa oluşturur. */
export async function getOrCreateDefaultMenu(businessId: string) {
  const existing = await prisma.menu.findFirst({
    where: { businessId },
    orderBy: { createdAt: "asc" },
  });
  if (existing) return existing;
  return prisma.menu.create({
    data: { businessId, name: "Ana Menü", schedule: "ALL_DAY" },
  });
}

/** Kategorinin bu işletmeye ait olduğunu doğrular. */
async function assertCategoryOwned(categoryId: string, businessId: string) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, menu: { businessId } },
    select: { id: true },
  });
  if (!category) throw new Error("Kategori bulunamadı");
}

export async function createCategory(name: string): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const trimmed = name.trim();
    if (trimmed.length < 1) return { success: false, error: "Kategori adı gerekli." };

    const menu = await getOrCreateDefaultMenu(businessId);
    await prisma.category.create({ data: { menuId: menu.id, name: trimmed } });
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Kategori oluşturulamadı." };
  }
}

export async function updateCategory(
  id: string,
  name: string,
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    await assertCategoryOwned(id, businessId);
    const trimmed = name.trim();
    if (trimmed.length < 1) return { success: false, error: "Kategori adı gerekli." };

    await prisma.category.update({ where: { id }, data: { name: trimmed } });
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Kategori güncellenemedi." };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    await assertCategoryOwned(id, businessId);
    await prisma.category.delete({ where: { id } });
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Kategori silinemedi." };
  }
}

export type ProductInput = {
  name: string;
  price: string;
  description?: string;
  calories?: string;
  prepMinutes?: string;
  categoryId: string;
  allergenIds: string[];
  imageUrl?: string | null;
  isFeatured?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
};

type ParsedProduct =
  | { ok: false; error: string }
  | {
      ok: true;
      data: {
        name: string;
        price: number;
        calories: number | null;
        prepMinutes: number | null;
        description: string | null;
        isFeatured: boolean;
        isNew: boolean;
        isPopular: boolean;
      };
    };

function parseOptionalInt(
  raw: string | undefined,
): { ok: true; value: number | null } | { ok: false } {
  if (!raw || raw.trim() === "") return { ok: true, value: null };
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) return { ok: false };
  return { ok: true, value: n };
}

function parseProduct(input: ProductInput): ParsedProduct {
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Ürün adı gerekli." };

  const price = Number(input.price.replace(",", "."));
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: "Geçerli bir fiyat girin." };
  }

  const cal = parseOptionalInt(input.calories);
  if (!cal.ok) return { ok: false, error: "Kalori geçerli bir tam sayı olmalı." };

  const prep = parseOptionalInt(input.prepMinutes);
  if (!prep.ok) {
    return { ok: false, error: "Hazırlık süresi geçerli bir tam sayı olmalı." };
  }

  return {
    ok: true,
    data: {
      name,
      price,
      calories: cal.value,
      prepMinutes: prep.value,
      description: input.description?.trim() || null,
      isFeatured: Boolean(input.isFeatured),
      isNew: Boolean(input.isNew),
      isPopular: Boolean(input.isPopular),
    },
  };
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    await assertCategoryOwned(input.categoryId, businessId);

    const parsed = parseProduct(input);
    if (!parsed.ok) return { success: false, error: parsed.error };

    await prisma.product.create({
      data: {
        ...parsed.data,
        categoryId: input.categoryId,
        businessId,
        imageUrl: input.imageUrl || null,
        allergens: {
          create: input.allergenIds.map((allergenId) => ({ allergenId })),
        },
      },
    });
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Ürün oluşturulamadı." };
  }
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const owned = await prisma.product.findFirst({
      where: { id, businessId },
      select: { id: true },
    });
    if (!owned) return { success: false, error: "Ürün bulunamadı." };
    await assertCategoryOwned(input.categoryId, businessId);

    const parsed = parseProduct(input);
    if (!parsed.ok) return { success: false, error: parsed.error };

    await prisma.product.update({
      where: { id },
      data: {
        ...parsed.data,
        categoryId: input.categoryId,
        imageUrl: input.imageUrl ?? null,
        allergens: {
          deleteMany: {},
          create: input.allergenIds.map((allergenId) => ({ allergenId })),
        },
      },
    });
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Ürün güncellenemedi." };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const owned = await prisma.product.findFirst({
      where: { id, businessId },
      select: { id: true },
    });
    if (!owned) return { success: false, error: "Ürün bulunamadı." };

    await prisma.product.delete({ where: { id } });
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Ürün silinemedi." };
  }
}
