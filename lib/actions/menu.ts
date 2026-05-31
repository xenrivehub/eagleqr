"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { getMediaEntitlements } from "@/lib/queries/entitlements";
import { hasFeature } from "@/lib/queries/plan-features";
import { isValidTime } from "@/lib/campaign";

function cleanTime(t?: string | null): string | null {
  return t && isValidTime(t) ? t.trim() : null;
}

type ActionResult = { success: true } | { success: false; error: string };

function cleanDate(t?: string | null): string | null {
  return t && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t.trim() : null;
}

type CampaignData = {
  campaignId: string | null;
  campaignStart: string | null;
  campaignEnd: string | null;
  campaignDateStart: string | null;
  campaignDateEnd: string | null;
  campaignPrice: number | null;
};

/** Kampanya alanlarını doğrular (geçerli/açık kampanya, HH:MM, fiyat). */
async function campaignData(input: ProductInput, businessId: string): Promise<CampaignData> {
  const none: CampaignData = {
    campaignId: null, campaignStart: null, campaignEnd: null,
    campaignDateStart: null, campaignDateEnd: null, campaignPrice: null,
  };
  if (!input.campaignId) return none;
  if (!(await hasFeature(businessId, "campaigns"))) return none;
  const c = await prisma.campaign.findFirst({
    where: { id: input.campaignId, enabled: true },
    select: { id: true },
  });
  if (!c) return none;

  let price: number | null = null;
  if (input.campaignPrice) {
    const n = Number(String(input.campaignPrice).replace(",", "."));
    if (Number.isFinite(n) && n >= 0) price = n;
  }
  return {
    campaignId: c.id,
    campaignStart: cleanTime(input.campaignStart),
    campaignEnd: cleanTime(input.campaignEnd),
    campaignDateStart: cleanDate(input.campaignDateStart),
    campaignDateEnd: cleanDate(input.campaignDateEnd),
    campaignPrice: price,
  };
}

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

export type CategoryInput = {
  name: string;
  availStart?: string | null;
  availEnd?: string | null;
  campaignId?: string | null;
  campaignStart?: string | null;
  campaignEnd?: string | null;
  campaignDateStart?: string | null;
  campaignDateEnd?: string | null;
  campaignDiscType?: string | null;
  campaignDiscValue?: string | null;
};

async function categoryCampaignData(input: CategoryInput, businessId: string) {
  const none = {
    campaignId: null as string | null,
    campaignStart: null as string | null,
    campaignEnd: null as string | null,
    campaignDateStart: null as string | null,
    campaignDateEnd: null as string | null,
    campaignDiscType: null as string | null,
    campaignDiscValue: null as number | null,
  };
  if (!input.campaignId) return none;
  if (!(await hasFeature(businessId, "campaigns"))) return none;
  const c = await prisma.campaign.findFirst({
    where: { id: input.campaignId, enabled: true },
    select: { id: true },
  });
  if (!c) return none;
  const type = input.campaignDiscType === "fixed" || input.campaignDiscType === "percent" ? input.campaignDiscType : null;
  let value: number | null = null;
  if (input.campaignDiscValue) {
    const n = Number(String(input.campaignDiscValue).replace(",", "."));
    if (Number.isFinite(n) && n >= 0) value = type === "percent" ? Math.min(100, n) : n;
  }
  return {
    campaignId: c.id,
    campaignStart: cleanTime(input.campaignStart),
    campaignEnd: cleanTime(input.campaignEnd),
    campaignDateStart: cleanDate(input.campaignDateStart),
    campaignDateEnd: cleanDate(input.campaignDateEnd),
    campaignDiscType: value !== null ? type : null,
    campaignDiscValue: value,
  };
}

export async function createCategory(
  menuId: string,
  input: CategoryInput,
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const trimmed = input.name.trim();
    if (trimmed.length < 1) return { success: false, error: "Kategori adı gerekli." };

    const menu = await prisma.menu.findFirst({
      where: { id: menuId, businessId },
      select: { id: true },
    });
    if (!menu) return { success: false, error: "Menü bulunamadı." };

    await prisma.category.create({
      data: {
        menuId: menu.id,
        name: trimmed,
        availStart: cleanTime(input.availStart),
        availEnd: cleanTime(input.availEnd),
        ...(await categoryCampaignData(input, businessId)),
      },
    });
    revalidatePath("/dashboard/menu");
    revalidatePath(`/dashboard/menu/${menuId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Kategori oluşturulamadı." };
  }
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    await assertCategoryOwned(id, businessId);
    const trimmed = input.name.trim();
    if (trimmed.length < 1) return { success: false, error: "Kategori adı gerekli." };

    await prisma.category.update({
      where: { id },
      data: {
        name: trimmed,
        availStart: cleanTime(input.availStart),
        availEnd: cleanTime(input.availEnd),
        ...(await categoryCampaignData(input, businessId)),
      },
    });
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
  campaignId?: string | null;
  campaignStart?: string | null;
  campaignEnd?: string | null;
  campaignDateStart?: string | null;
  campaignDateEnd?: string | null;
  campaignPrice?: string | null;
  availStart?: string | null;
  availEnd?: string | null;
  variations?: { name: string; icon?: string; price: string | number }[];
};

function sanitizeVariations(
  raw?: { name: string; icon?: string; price: string | number }[],
): { name: string; icon: string; price: number }[] {
  if (!Array.isArray(raw)) return [];
  const out: { name: string; icon: string; price: number }[] = [];
  for (const v of raw.slice(0, 30)) {
    const name = (v?.name ?? "").trim();
    if (!name) continue;
    const n = Number(String(v.price).replace(",", "."));
    if (!Number.isFinite(n) || n < 0) continue;
    out.push({ name, icon: (v.icon ?? "").trim().slice(0, 8), price: n });
  }
  return out;
}

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
        ...(await campaignData(input, businessId)),
        availStart: cleanTime(input.availStart),
        availEnd: cleanTime(input.availEnd),
        variations: sanitizeVariations(input.variations),
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
        ...(await campaignData(input, businessId)),
        availStart: cleanTime(input.availStart),
        availEnd: cleanTime(input.availEnd),
        variations: sanitizeVariations(input.variations),
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

export type BulkPriceOpts = {
  scope: string; // "all" | categoryId
  op: "discount" | "increase";
  method: "percent" | "fixed";
  value: number;
  includeVariations: boolean;
};
export type BulkPriceReport =
  | { ok: true; count: number; sample: { name: string; oldP: number; newP: number }[]; committed: boolean }
  | { ok: false; error: string };

function applyBulk(base: number, op: string, method: string, value: number): number {
  const delta = method === "percent" ? (base * value) / 100 : value;
  const raw = op === "discount" ? base - delta : base + delta;
  return Math.max(0, Math.round(raw));
}

export async function bulkUpdatePrices(
  menuId: string,
  opts: BulkPriceOpts,
  commit: boolean,
): Promise<BulkPriceReport> {
  try {
    const businessId = await requireBusinessId();
    const menu = await prisma.menu.findFirst({ where: { id: menuId, businessId }, select: { id: true } });
    if (!menu) return { ok: false, error: "Menü bulunamadı." };
    if (!(await hasFeature(businessId, "bulkPrice"))) {
      return { ok: false, error: "Toplu fiyat yönetimi planınızda kapalı." };
    }
    if (opts.op !== "discount" && opts.op !== "increase") return { ok: false, error: "Geçersiz işlem." };
    if (opts.method !== "percent" && opts.method !== "fixed") return { ok: false, error: "Geçersiz yöntem." };
    if (!Number.isFinite(opts.value) || opts.value <= 0) return { ok: false, error: "Geçerli bir değer girin." };

    const where: Prisma.ProductWhereInput =
      opts.scope === "all"
        ? { category: { menuId } }
        : { categoryId: opts.scope, category: { menuId } };

    const products = await prisma.product.findMany({
      where,
      select: { id: true, name: true, price: true, variations: true },
    });
    if (products.length === 0) return { ok: false, error: "Etkilenecek ürün yok." };

    const sample = products.slice(0, 5).map((p) => ({
      name: p.name,
      oldP: Number(p.price),
      newP: applyBulk(Number(p.price), opts.op, opts.method, opts.value),
    }));

    if (commit) {
      for (const p of products) {
        const newPrice = applyBulk(Number(p.price), opts.op, opts.method, opts.value);
        const data: Prisma.ProductUpdateInput = { price: newPrice };
        if (opts.includeVariations) {
          const vars = (p.variations as { name: string; icon?: string; price: number }[]) ?? [];
          if (vars.length > 0) {
            data.variations = vars.map((v) => ({
              name: v.name,
              icon: v.icon ?? "",
              price: applyBulk(Number(v.price), opts.op, opts.method, opts.value),
            }));
          }
        }
        await prisma.product.update({ where: { id: p.id }, data });
      }
      revalidatePath("/dashboard/menu");
    }

    return { ok: true, count: products.length, sample, committed: commit };
  } catch {
    return { ok: false, error: "Fiyatlar güncellenemedi." };
  }
}

export async function toggleSoldOut(id: string): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const owned = await prisma.product.findFirst({
      where: { id, businessId },
      select: { id: true, isSoldOut: true },
    });
    if (!owned) return { success: false, error: "Ürün bulunamadı." };
    await prisma.product.update({
      where: { id },
      data: { isSoldOut: !owned.isSoldOut },
    });
    revalidatePath("/dashboard/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Güncellenemedi." };
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
