"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

type GenResult = { success: true; text: string } | { success: false; error: string };

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
        "X-Title": "Eagle QR",
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
