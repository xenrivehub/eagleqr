"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { translateItems, isTranslationConfigured } from "@/lib/translate";
import { hasFeature } from "@/lib/queries/plan-features";

type ActionResult = { success: true; count: number } | { success: false; error: string };

async function requireBusinessId(): Promise<string> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) throw new Error("Yetkisiz erişim");
  return businessId;
}

type Trans = Record<string, { name?: string; description?: string }>;

/**
 * Bir menünün ürün ad/açıklamalarını + kategori adlarını hedef dil(ler)e çevirir
 * ve translations JSON alanına yazar (cache). Mevcut diğer diller korunur.
 */
export async function translateMenu(
  menuId: string,
  langCodes: string[],
): Promise<ActionResult> {
  try {
    const businessId = await requireBusinessId();
    if (!(await hasFeature(businessId, "aiTranslation"))) {
      return { success: false, error: "AI çevirisi planınızda kapalı." };
    }
    if (!isTranslationConfigured()) {
      return { success: false, error: "Çeviri yapılandırılmadı (OPENROUTER_API_KEY eksik)." };
    }

    const menu = await prisma.menu.findFirst({
      where: { id: menuId, businessId },
      select: { id: true },
    });
    if (!menu) return { success: false, error: "Menü bulunamadı." };

    const langs = await prisma.language.findMany({
      where: { code: { in: langCodes }, enabled: true },
    });
    if (langs.length === 0) return { success: false, error: "Geçerli dil seçilmedi." };

    const modelSetting = await prisma.appSetting.findUnique({
      where: { key: "translation_model" },
    });
    const model = modelSetting?.value || "google/gemini-2.0-flash-001";

    const categories = await prisma.category.findMany({
      where: { menuId },
      include: { products: { select: { id: true, name: true, description: true, translations: true } } },
    });
    const products = categories.flatMap((c) => c.products);

    if (categories.length === 0) {
      return { success: false, error: "Çevrilecek içerik yok." };
    }

    let count = 0;
    for (const lang of langs) {
      const items = [
        ...products.map((p) => ({ id: `p_${p.id}`, name: p.name, description: p.description })),
        ...categories.map((c) => ({ id: `c_${c.id}`, name: c.name })),
      ];
      const result = await translateItems(items, lang.nativeLabel, model);

      // Ürünler
      for (const p of products) {
        const tr = result.get(`p_${p.id}`);
        if (!tr) continue;
        const existing = (p.translations as Trans) ?? {};
        existing[lang.code] = { name: tr.name, description: tr.description };
        await prisma.product.update({ where: { id: p.id }, data: { translations: existing } });
        count++;
      }
      // Kategoriler
      for (const c of categories) {
        const tr = result.get(`c_${c.id}`);
        if (!tr) continue;
        const existing = (c.translations as Trans) ?? {};
        existing[lang.code] = { name: tr.name };
        await prisma.category.update({ where: { id: c.id }, data: { translations: existing } });
      }
    }

    revalidatePath("/dashboard/menu");
    return { success: true, count };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Çeviri başarısız.";
    return { success: false, error: msg };
  }
}
