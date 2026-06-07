"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasFeature } from "@/lib/queries/plan-features";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

type GenResult = { success: true; text: string } | { success: false; error: string };
type PairResult =
  | { success: true; items: { id: string; name: string }[] }
  | { success: false; error: string };

async function getModel(): Promise<string> {
  const s = await prisma.appSetting.findUnique({ where: { key: "translation_model" } });
  return s?.value || "google/gemini-2.0-flash-001";
}

/**
 * Ürün adı (+ kategori bağlamı) için Türkçe, kısa, iştah açıcı bir açıklama üretir.
 * Admin'in seçtiği OpenRouter modelini kullanır.
 */
export async function generateDescription(
  name: string,
  categoryId: string,
): Promise<GenResult> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };
  if (!(await hasFeature(businessId, "ai"))) {
    return { success: false, error: "AI önerileri planınızda kapalı." };
  }

  const productName = name.trim();
  if (productName.length < 2) {
    return { success: false, error: "Önce ürün adını girin." };
  }
  if (!process.env.OPENROUTER_API_KEY) {
    return { success: false, error: "AI yapılandırılmadı (OPENROUTER_API_KEY eksik)." };
  }

  // Kategori bağlamı (sahiplik doğrulamasıyla)
  const category = await prisma.category.findFirst({
    where: { id: categoryId, menu: { businessId } },
    select: { name: true },
  });
  const categoryName = category?.name ?? "";

  const modelSetting = await prisma.appSetting.findUnique({
    where: { key: "translation_model" },
  });
  const model = modelSetting?.value || "google/gemini-2.0-flash-001";

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "Eagle Menu",
      },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        max_tokens: 160,
        messages: [
          {
            role: "system",
            content:
              "Sen bir restoran menüsü metin yazarısın. Verilen ürün için Türkçe, " +
              "iştah açıcı, 1-2 cümlelik KISA bir açıklama yaz. Doğal ve özgün ol; " +
              "abartı ve klişelerden kaçın. Yalnızca açıklama metnini döndür — " +
              "tırnak, başlık veya önek ekleme.",
          },
          {
            role: "user",
            content: `Ürün: ${productName}${categoryName ? `\nKategori: ${categoryName}` : ""}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { success: false, error: `AI hatası (${res.status}).` };
    }
    const data = await res.json();
    const text: string = (data?.choices?.[0]?.message?.content ?? "").trim().replace(/^["']|["']$/g, "");
    if (!text) return { success: false, error: "Açıklama üretilemedi, tekrar deneyin." };
    return { success: true, text };
  } catch {
    return { success: false, error: "AI isteği başarısız." };
  }
}

/**
 * Bir ürün için menüdeki diğer ürünlerden "yanında iyi gider" eşleşmeleri önerir.
 * Yalnızca menüdeki gerçek ürünleri döndürür (AI menü dışı öneremez).
 */
export async function suggestPairings(
  name: string,
  categoryId: string,
  excludeIds: string[],
): Promise<PairResult> {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) return { success: false, error: "Yetkisiz erişim." };
  if (!(await hasFeature(businessId, "ai"))) {
    return { success: false, error: "AI önerileri planınızda kapalı." };
  }
  const productName = name.trim();
  if (productName.length < 2) return { success: false, error: "Önce ürün adını girin." };
  if (!process.env.OPENROUTER_API_KEY) {
    return { success: false, error: "AI yapılandırılmadı (OPENROUTER_API_KEY eksik)." };
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, menu: { businessId } },
    select: { menuId: true },
  });
  if (!category) return { success: false, error: "Kategori bulunamadı." };

  const exclude = new Set(excludeIds);
  const candidates = (
    await prisma.product.findMany({
      where: { category: { menuId: category.menuId } },
      select: { id: true, name: true, category: { select: { name: true } } },
    })
  ).filter((p) => !exclude.has(p.id) && p.name.trim().toLocaleLowerCase("tr") !== productName.toLocaleLowerCase("tr"));

  if (candidates.length === 0) {
    return { success: false, error: "Menüde önerilecek başka ürün yok." };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "Eagle Menu",
      },
      body: JSON.stringify({
        model: await getModel(),
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Sen bir restoran menüsü uzmanısın. Hedef ürünle iyi giden (yemek-içecek, " +
              "tatlı-kahve vb.) 2-4 ürünü VERİLEN LİSTEDEN seç. Yalnızca listedeki id'leri kullan. " +
              'Sadece JSON döndür: {"ids":["..."]}',
          },
          {
            role: "user",
            content: JSON.stringify({
              hedef: productName,
              aday_urunler: candidates.map((c) => ({ id: c.id, ad: c.name, kategori: c.category.name })),
            }),
          },
        ],
      }),
    });
    if (!res.ok) return { success: false, error: `AI hatası (${res.status}).` };
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    let ids: string[] = [];
    try {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      const parsed = JSON.parse(content.slice(start, end + 1));
      ids = Array.isArray(parsed?.ids) ? parsed.ids.filter((x: unknown) => typeof x === "string") : [];
    } catch {
      return { success: false, error: "Öneri çözümlenemedi, tekrar deneyin." };
    }
    const byId = new Map(candidates.map((c) => [c.id, c.name]));
    const items = ids
      .filter((id) => byId.has(id))
      .slice(0, 4)
      .map((id) => ({ id, name: byId.get(id)! }));
    if (items.length === 0) return { success: false, error: "Uygun eşleşme bulunamadı." };
    return { success: true, items };
  } catch {
    return { success: false, error: "AI isteği başarısız." };
  }
}
