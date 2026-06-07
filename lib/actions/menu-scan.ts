"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasFeature } from "@/lib/queries/plan-features";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MAX_IMAGES = 6;

export type ScannedItem = { category: string; name: string; description: string; price: string };
type ScanResult = { success: true; items: ScannedItem[] } | { success: false; error: string };
type CreateResult = { success: true; count: number } | { success: false; error: string };

async function requireBusinessId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.businessId ?? null;
}

async function getModel(): Promise<string> {
  const s = await prisma.appSetting.findUnique({ where: { key: "translation_model" } });
  return s?.value || "google/gemini-2.0-flash-001";
}

const SYSTEM = [
  "Sen bir menü dijitalleştirme asistanısın. Sana bir restoran/kafe menüsünün bir veya birden çok fotoğrafı verilecek.",
  "Menüde GÖRDÜĞÜN tüm ürünleri çıkar. Uydurma; yalnızca fotoğraftaki bilgileri kullan.",
  "Her ürün için: kategori (menüdeki başlık, ör. 'Başlangıçlar'), ad, açıklama (varsa, yoksa boş), fiyat (sadece sayı; para birimi sembolü ve metin OLMADAN; okunamıyorsa boş bırak).",
  'Yanıtı YALNIZCA şu JSON biçiminde ver, başka metin ekleme: {"urunler":[{"kategori":"","ad":"","aciklama":"","fiyat":""}]}',
].join(" ");

export async function scanMenuPhoto(images: string[]): Promise<ScanResult> {
  try {
    const businessId = await requireBusinessId();
    if (!businessId) return { success: false, error: "Yetkisiz erişim." };
    if (!(await hasFeature(businessId, "menuScan"))) {
      return { success: false, error: "Fotoğraftan menü oluşturma planınızda kapalı." };
    }
    if (!process.env.OPENROUTER_API_KEY) {
      return { success: false, error: "AI yapılandırılmadı (OPENROUTER_API_KEY eksik)." };
    }
    const imgs = images.filter((s) => s.startsWith("data:image/")).slice(0, MAX_IMAGES);
    if (imgs.length === 0) return { success: false, error: "En az bir menü fotoğrafı yükleyin." };

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "Eagle Menu",
      },
      body: JSON.stringify({
        model: await getModel(),
        temperature: 0.1,
        max_tokens: 4000,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: "Bu menü fotoğraf(lar)ındaki tüm ürünleri çıkar." },
              ...imgs.map((url) => ({ type: "image_url", image_url: { url } })),
            ],
          },
        ],
      }),
    });

    if (!res.ok) return { success: false, error: `AI hatası (${res.status}). Görsel okuma destekleyen bir model seçili olmalı.` };
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";

    let parsed: unknown;
    try {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      parsed = JSON.parse(start >= 0 ? content.slice(start, end + 1) : content);
    } catch {
      return { success: false, error: "Menü çözümlenemedi. Daha net bir fotoğraf deneyin." };
    }

    const raw = (parsed as { urunler?: unknown })?.urunler;
    if (!Array.isArray(raw)) return { success: false, error: "Menüde ürün bulunamadı." };

    const items: ScannedItem[] = raw
      .map((r) => {
        const o = r as Record<string, unknown>;
        return {
          category: String(o.kategori ?? "").trim(),
          name: String(o.ad ?? "").trim(),
          description: String(o.aciklama ?? "").trim(),
          price: String(o.fiyat ?? "").trim(),
        };
      })
      .filter((it) => it.name.length > 0)
      .slice(0, 300);

    if (items.length === 0) return { success: false, error: "Menüde ürün bulunamadı." };
    return { success: true, items };
  } catch {
    return { success: false, error: "AI isteği başarısız oldu." };
  }
}

export async function createScannedProducts(menuId: string, items: ScannedItem[]): Promise<CreateResult> {
  try {
    const businessId = await requireBusinessId();
    if (!businessId) return { success: false, error: "Yetkisiz erişim." };
    if (!(await hasFeature(businessId, "menuScan"))) {
      return { success: false, error: "Bu özellik planınızda kapalı." };
    }
    const menu = await prisma.menu.findFirst({ where: { id: menuId, businessId }, select: { id: true } });
    if (!menu) return { success: false, error: "Menü bulunamadı." };

    const clean = items
      .map((it) => ({
        category: (it.category || "Diğer").trim(),
        name: it.name.trim(),
        description: it.description?.trim() || null,
        price: Math.max(0, Number(String(it.price).replace(",", ".")) || 0),
      }))
      .filter((it) => it.name.length > 0);
    if (clean.length === 0) return { success: false, error: "Eklenecek ürün yok." };

    const norm = (s: string) => s.toLocaleLowerCase("tr").trim();

    await prisma.$transaction(async (tx) => {
      // Mevcut kategoriler
      const existing = await tx.category.findMany({ where: { menuId }, select: { id: true, name: true, sortOrder: true } });
      const byName = new Map(existing.map((c) => [norm(c.name), c.id]));
      let nextCatOrder = existing.reduce((m, c) => Math.max(m, c.sortOrder), -1) + 1;

      // Eksik kategorileri oluştur
      const wantedCats = [...new Set(clean.map((it) => it.category))];
      for (const catName of wantedCats) {
        if (!byName.has(norm(catName))) {
          const created = await tx.category.create({
            data: { menuId, name: catName, sortOrder: nextCatOrder++ },
            select: { id: true },
          });
          byName.set(norm(catName), created.id);
        }
      }

      // Her kategori için mevcut en yüksek ürün sırası
      const orderByCat = new Map<string, number>();
      const counts = await tx.product.groupBy({ by: ["categoryId"], where: { businessId }, _max: { sortOrder: true } });
      for (const c of counts) orderByCat.set(c.categoryId, (c._max.sortOrder ?? -1) + 1);

      for (const it of clean) {
        const categoryId = byName.get(norm(it.category))!;
        const sortOrder = orderByCat.get(categoryId) ?? 0;
        orderByCat.set(categoryId, sortOrder + 1);
        await tx.product.create({
          data: {
            categoryId,
            businessId,
            name: it.name,
            description: it.description,
            price: it.price,
            sortOrder,
          },
        });
      }
    });

    revalidatePath("/dashboard/menu");
    return { success: true, count: clean.length };
  } catch {
    return { success: false, error: "Ürünler oluşturulamadı." };
  }
}
