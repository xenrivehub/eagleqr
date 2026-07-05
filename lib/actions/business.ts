"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { ACTIVE_BRANCH_COOKIE } from "@/lib/branch-context";
import { THEMES, isThemeUnlocked } from "@/lib/themes";
import { parseHours } from "@/lib/opening-hours";

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
// QR açılış (splash) ekranı — Pro/Max
// ---------------------------------------------------------------------------

export type SplashInput = {
  enabled: boolean;
  imageUrl: string | null;
  videoUrl: string | null;
};

export async function updateSplash(input: SplashInput): Promise<ActionResult> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };

  const { hasFeature } = await import("@/lib/queries/plan-features");
  if (!(await hasFeature(businessId, "splashScreen"))) {
    return { success: false, error: "QR açılış ekranı planınızda kapalı." };
  }

  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: {
        splashEnabled: input.enabled,
        splashImageUrl: input.imageUrl || null,
        splashVideoUrl: input.videoUrl || null,
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
  currency: string;
  ratingsEnabled: boolean;
  mapUrl: string;
  social: Record<string, string>;
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

const SOCIAL_KEYS = ["instagram", "tiktok", "facebook", "x", "youtube", "website"];

export async function updateBusinessInfo(
  input: BusinessInfoInput,
): Promise<ActionResult> {
  const businessId = await requireBusinessId().catch(() => null);
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };

  const name = input.name.trim();
  if (name.length < 2) {
    return { success: false, error: "İşletme adı en az 2 karakter olmalı." };
  }
  const curRow = await prisma.currency.findFirst({
    where: { code: input.currency, enabled: true },
    select: { code: true },
  });
  const currency = curRow?.code ?? "TRY";

  const social: Record<string, string> = {};
  for (const k of SOCIAL_KEYS) {
    const v = (input.social?.[k] ?? "").trim();
    if (v) social[k] = v;
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
        currency,
        ratingsEnabled: input.ratingsEnabled,
        mapUrl: input.mapUrl.trim() || null,
        socialLinks: social,
        maintenanceMode: input.maintenanceMode,
        maintenanceMessage: input.maintenanceMessage.trim() || null,
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
// Menü ekstraları — WiFi + yapılandırılmış çalışma saatleri (işletme/marka geneli)
// ---------------------------------------------------------------------------

export type MenuExtrasInput = {
  wifiSsid: string;
  wifiPassword: string;
  wifiShow: boolean;
  openingHours: unknown; // OpeningHours objesi veya null (temizle)
};

export async function updateMenuExtras(input: MenuExtrasInput): Promise<ActionResult> {
  const businessId = await requireBusinessId().catch(() => null);
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };
  try {
    const hours = parseHours(input.openingHours);
    const business = await prisma.business.update({
      where: { id: businessId },
      data: {
        wifiSsid: input.wifiSsid.trim().slice(0, 60) || null,
        wifiPassword: input.wifiPassword.trim().slice(0, 60) || null,
        wifiShow: input.wifiShow,
        openingHoursJson: hours ? (hours as object) : Prisma.DbNull,
      },
      select: { slug: true },
    });
    revalidatePath("/dashboard/settings");
    revalidatePath(`/m/${business.slug}`, "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Kaydedilemedi." };
  }
}

export async function setTheme(themeKey: string): Promise<ActionResult> {
  const businessId = await requireBusinessId().catch(() => null);
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };
  if (!THEMES.some((t) => t.key === themeKey)) {
    return { success: false, error: "Geçersiz tema." };
  }
  const current = await prisma.business.findUnique({
    where: { id: businessId },
    select: { allowedThemes: true },
  });
  if (!current) return { success: false, error: "İşletme bulunamadı." };
  if (!isThemeUnlocked(themeKey, current.allowedThemes)) {
    return {
      success: false,
      error: "Bu tema kilitli. Kullanmak için bizimle iletişime geçin.",
    };
  }
  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: { themeKey },
      select: { slug: true },
    });
    revalidatePath("/dashboard/tema");
    revalidatePath(`/m/${business.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Tema kaydedilemedi." };
  }
}

// ---------------------------------------------------------------------------
// Şube (menü) yönetimi — yalnızca zincir işletmeler için anlamlı
// ---------------------------------------------------------------------------

export async function setActiveBranch(menuId: string): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const owned = await prisma.menu.findFirst({
      where: { id: menuId, businessId },
      select: { id: true },
    });
    if (!owned) return { success: false, error: "Şube bulunamadı." };

    const store = await cookies();
    store.set(ACTIVE_BRANCH_COOKIE, menuId, {
      path: "/dashboard",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Şube seçilemedi." };
  }
}

export async function createBranch(
  name: string,
  copyFromMenuId?: string,
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const trimmed = name.trim();
    if (trimmed.length < 1) return { success: false, error: "Şube adı gerekli." };

    const slug = await uniqueBranchSlug(businessId, trimmed);
    const menu = await prisma.menu.create({
      data: { businessId, name: trimmed, slug, schedule: "ALL_DAY" },
    });

    // İsteğe bağlı: mevcut bir şubenin kategori + ürünlerini kopyala
    if (copyFromMenuId) {
      const source = await prisma.menu.findFirst({
        where: { id: copyFromMenuId, businessId },
        select: { id: true },
      });
      if (source) {
        const categories = await prisma.category.findMany({
          where: { menuId: source.id },
          orderBy: { sortOrder: "asc" },
          include: {
            products: {
              orderBy: { createdAt: "asc" },
              include: { allergens: { select: { allergenId: true } } },
            },
          },
        });

        for (const cat of categories) {
          await prisma.category.create({
            data: {
              menuId: menu.id,
              name: cat.name,
              sortOrder: cat.sortOrder,
              products: {
                create: cat.products.map((p) => ({
                  businessId,
                  name: p.name,
                  description: p.description,
                  price: p.price,
                  calories: p.calories,
                  prepMinutes: p.prepMinutes,
                  imageUrl: p.imageUrl,
                  videoUrl: p.videoUrl,
                  modelGlbUrl: p.modelGlbUrl,
                  modelUsdzUrl: p.modelUsdzUrl,
                  mediaType: p.mediaType,
                  isSoldOut: p.isSoldOut,
                  isFeatured: p.isFeatured,
                  isNew: p.isNew,
                  isPopular: p.isPopular,
                  sortOrder: p.sortOrder,
                  allergens: {
                    create: p.allergens.map((a) => ({ allergenId: a.allergenId })),
                  },
                })),
              },
            },
          });
        }
      }
    }

    revalidatePath("/dashboard/menu");
    revalidatePath("/dashboard/branches");
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

// Marka geneli bilgiler (tüm şubelerde ortak) — zincir işletme için.
export type BrandInfoInput = {
  name: string;
  logoUrl: string | null;
  ratingsEnabled: boolean;
  about: string;
};

export async function updateBrandInfo(input: BrandInfoInput): Promise<ActionResult> {
  const businessId = await requireBusinessId().catch(() => null);
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };
  const name = input.name.trim();
  if (name.length < 2) return { success: false, error: "İşletme adı en az 2 karakter olmalı." };
  try {
    const business = await prisma.business.update({
      where: { id: businessId },
      data: {
        name,
        logoUrl: input.logoUrl || null,
        ratingsEnabled: input.ratingsEnabled,
        about: input.about.trim() || null,
      },
      select: { slug: true },
    });
    revalidatePath("/dashboard/settings");
    revalidatePath(`/m/${business.slug}`, "layout");
    return { success: true };
  } catch {
    return { success: false, error: "Kaydedilemedi." };
  }
}

// Şubeye özel ayarlar (zincir işletme) — boş bırakılanlar marka genelinden gelir.
export type BranchSettingsInput = {
  logoUrl: string | null;
  phone: string;
  contactEmail: string;
  address: string;
  openingHours: string;
  mapUrl: string;
  social: Record<string, string>;
  currency: string; // "" → marka para birimi
  themeKey: string; // "" → marka teması
  maintenanceMode: boolean;
  maintenanceMessage: string;
};

export async function updateBranchSettings(
  menuId: string,
  input: BranchSettingsInput,
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    const menu = await prisma.menu.findFirst({
      where: { id: menuId, businessId },
      select: { id: true, slug: true, business: { select: { slug: true, allowedThemes: true } } },
    });
    if (!menu) return { success: false, error: "Şube bulunamadı." };

    // Tema (boş → marka teması)
    let themeKey: string | null = null;
    if (input.themeKey) {
      if (!THEMES.some((t) => t.key === input.themeKey)) return { success: false, error: "Geçersiz tema." };
      if (!isThemeUnlocked(input.themeKey, menu.business.allowedThemes)) {
        return { success: false, error: "Bu tema kilitli. Kullanmak için iletişime geçin." };
      }
      themeKey = input.themeKey;
    }

    // Para birimi (boş → marka para birimi)
    let currency: string | null = null;
    if (input.currency) {
      const cur = await prisma.currency.findFirst({ where: { code: input.currency, enabled: true }, select: { code: true } });
      currency = cur?.code ?? null;
    }

    const social: Record<string, string> = {};
    for (const k of SOCIAL_KEYS) {
      const v = (input.social?.[k] ?? "").trim();
      if (v) social[k] = v;
    }

    await prisma.menu.update({
      where: { id: menuId },
      data: {
        logoUrl: input.logoUrl || null,
        phone: input.phone.trim() || null,
        contactEmail: input.contactEmail.trim() || null,
        address: input.address.trim() || null,
        openingHours: input.openingHours.trim() || null,
        mapUrl: input.mapUrl.trim() || null,
        socialLinks: social,
        currency,
        themeKey,
        maintenanceMode: input.maintenanceMode,
        maintenanceMessage: input.maintenanceMessage.trim() || null,
      },
    });
    revalidatePath("/dashboard/settings");
    if (menu.business.slug && menu.slug) revalidatePath(`/m/${menu.business.slug}/${menu.slug}`);
    return { success: true };
  } catch {
    return { success: false, error: "Şube ayarları kaydedilemedi." };
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
