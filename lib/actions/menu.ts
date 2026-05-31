"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getMediaEntitlements } from "@/lib/queries/entitlements";

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

export async function createCategory(
  menuId: string,
  name: string,
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const trimmed = name.trim();
    if (trimmed.length < 1) return { success: false, error: "Kategori adı gerekli." };

    const menu = await prisma.menu.findFirst({
      where: { id: menuId, businessId },
      select: { id: true },
    });
    if (!menu) return { success: false, error: "Menü bulunamadı." };

    await prisma.category.create({ data: { menuId: menu.id, name: trimmed } });
    revalidatePath("/dashboard/menu");
    revalidatePath(`/dashboard/menu/${menuId}`);
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
  videoUrl?: string | null;
  modelGlbUrl?: string | null;
  isFeatured?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  pairedIds?: string[];
};

/** Ürünün "yanında iyi gider" eşleşmelerini değiştirir (aynı menü, kendisi hariç). */
async function replacePairings(
  productId: string,
  businessId: string,
  pairedIds: string[],
): Promise<void> {
  await prisma.productPairing.deleteMany({ where: { productId } });
  const ids = [...new Set(pairedIds)].filter((id) => id && id !== productId);
  if (ids.length === 0) return;

  const self = await prisma.product.findFirst({
    where: { id: productId, businessId },
    select: { category: { select: { menuId: true } } },
  });
  if (!self) return;

  const valid = await prisma.product.findMany({
    where: { id: { in: ids }, category: { menuId: self.category.menuId } },
    select: { id: true },
  });
  const validSet = new Set(valid.map((v) => v.id));
  const ordered = ids.filter((id) => validSet.has(id));
  if (ordered.length === 0) return;

  await prisma.productPairing.createMany({
    data: ordered.map((pairedId, i) => ({ productId, pairedId, sortOrder: i })),
  });
}

/**
 * Video / AR yetkisini doğrular. excludeProductId: düzenlemede kendi medyasını
 * sayımdan çıkar. Yeni medya ekleniyorsa (önceden yokken) kalan kotaya bakar.
 */
async function assertMediaAllowed(
  businessId: string,
  input: { videoUrl?: string | null; modelGlbUrl?: string | null },
  prev: { videoUrl: string | null; modelGlbUrl: string | null } | null,
  excludeProductId?: string,
): Promise<string | null> {
  const addingVideo = !!input.videoUrl && !prev?.videoUrl;
  const addingAr = !!input.modelGlbUrl && !prev?.modelGlbUrl;
  if (!addingVideo && !addingAr) return null;

  const ent = await getMediaEntitlements(businessId, excludeProductId);
  if (addingVideo) {
    if (!ent.video.allowed) return "Video yükleme planınızda kapalı.";
    if (ent.video.remaining < 1) {
      return `Video kotanız doldu (${ent.video.limit} ürün). Yükseltmek için iletişime geçin.`;
    }
  }
  if (addingAr) {
    if (!ent.ar.allowed) return "AR/3D yükleme planınızda kapalı.";
    if (ent.ar.remaining < 1) {
      return `AR/3D kotanız doldu (${ent.ar.limit} ürün). Yükseltmek için iletişime geçin.`;
    }
  }
  return null;
}

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

    const mediaError = await assertMediaAllowed(businessId, input, null);
    if (mediaError) return { success: false, error: mediaError };

    const created = await prisma.product.create({
      data: {
        ...parsed.data,
        categoryId: input.categoryId,
        businessId,
        imageUrl: input.imageUrl || null,
        videoUrl: input.videoUrl || null,
        modelGlbUrl: input.modelGlbUrl || null,
        allergens: {
          create: input.allergenIds.map((allergenId) => ({ allergenId })),
        },
      },
      select: { id: true },
    });
    if (input.pairedIds) await replacePairings(created.id, businessId, input.pairedIds);
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
      select: { id: true, videoUrl: true, modelGlbUrl: true },
    });
    if (!owned) return { success: false, error: "Ürün bulunamadı." };
    await assertCategoryOwned(input.categoryId, businessId);

    const parsed = parseProduct(input);
    if (!parsed.ok) return { success: false, error: parsed.error };

    const mediaError = await assertMediaAllowed(
      businessId,
      input,
      { videoUrl: owned.videoUrl, modelGlbUrl: owned.modelGlbUrl },
      id,
    );
    if (mediaError) return { success: false, error: mediaError };

    await prisma.product.update({
      where: { id },
      data: {
        ...parsed.data,
        categoryId: input.categoryId,
        imageUrl: input.imageUrl ?? null,
        videoUrl: input.videoUrl ?? null,
        modelGlbUrl: input.modelGlbUrl ?? null,
        allergens: {
          deleteMany: {},
          create: input.allergenIds.map((allergenId) => ({ allergenId })),
        },
      },
    });
    if (input.pairedIds) await replacePairings(id, businessId, input.pairedIds);
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Ürün güncellenemedi." };
  }
}

export async function reorderCategories(
  menuId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const menu = await prisma.menu.findFirst({
      where: { id: menuId, businessId },
      select: { id: true },
    });
    if (!menu) return { success: false, error: "Menü bulunamadı." };

    // Yalnızca bu menüye ait kategorileri sırala
    const owned = await prisma.category.findMany({
      where: { menuId, id: { in: orderedIds } },
      select: { id: true },
    });
    const ownedIds = new Set(owned.map((c) => c.id));

    await prisma.$transaction(
      orderedIds
        .filter((id) => ownedIds.has(id))
        .map((id, index) =>
          prisma.category.update({ where: { id }, data: { sortOrder: index } }),
        ),
    );
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Sıralama kaydedilemedi." };
  }
}

export async function reorderProducts(
  categoryId: string,
  orderedIds: string[],
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    await assertCategoryOwned(categoryId, businessId);

    const owned = await prisma.product.findMany({
      where: { categoryId, id: { in: orderedIds } },
      select: { id: true },
    });
    const ownedIds = new Set(owned.map((p) => p.id));

    await prisma.$transaction(
      orderedIds
        .filter((id) => ownedIds.has(id))
        .map((id, index) =>
          prisma.product.update({ where: { id }, data: { sortOrder: index } }),
        ),
    );
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Sıralama kaydedilemedi." };
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
