"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseCsv } from "@/lib/csv";

const MAX_ROWS = 500;

export type ImportReport = {
  ok: boolean;
  error?: string;
  total: number;
  valid: number;
  invalid: number;
  created: number;
  skipped: number;
  errors: { row: number; message: string }[];
  newCategories: string[];
  committed: boolean;
};

function norm(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i").replace(/ç/g, "c").replace(/ş/g, "s")
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o")
    .replace(/[^a-z0-9]/g, "");
}

const HEADER_ALIASES: Record<string, string> = {
  kategori: "category", category: "category",
  ad: "name", isim: "name", urunadi: "name", name: "name",
  aciklama: "description", description: "description",
  fiyat: "price", price: "price",
  kalori: "calories", calories: "calories",
  hazirlikdk: "prepMinutes", hazirlik: "prepMinutes", sure: "prepMinutes", prep: "prepMinutes",
  alerjenler: "allergens", alerjen: "allergens", allergens: "allergens",
  etiketler: "tags", etiket: "tags", tags: "tags",
  gorselurl: "imageUrl", gorsel: "imageUrl", resim: "imageUrl", image: "imageUrl", imageurl: "imageUrl",
};

function parsePrice(raw: string): number | null {
  const v = raw.replace(/[^\d.,-]/g, "").replace(",", ".");
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function parseInt0(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

type ParsedRow = {
  rowNum: number;
  category: string;
  name: string;
  description: string | null;
  price: number;
  calories: number | null;
  prepMinutes: number | null;
  imageUrl: string | null;
  allergenIds: string[];
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
};

export async function importProducts(
  menuId: string,
  csvText: string,
  commit: boolean,
): Promise<ImportReport> {
  const empty: ImportReport = {
    ok: false, total: 0, valid: 0, invalid: 0, created: 0, skipped: 0,
    errors: [], newCategories: [], committed: false,
  };

  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) return { ...empty, error: "Yetkisiz erişim." };

  const menu = await prisma.menu.findFirst({ where: { id: menuId, businessId }, select: { id: true } });
  if (!menu) return { ...empty, error: "Menü bulunamadı." };

  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    return { ...empty, error: "Dosya boş veya yalnızca başlık satırı var." };
  }
  if (rows.length - 1 > MAX_ROWS) {
    return { ...empty, error: `En fazla ${MAX_ROWS} satır içe aktarılabilir.` };
  }

  // Başlık eşleştir
  const header = rows[0].map((h) => HEADER_ALIASES[norm(h)] ?? "");
  const col = (field: string) => header.indexOf(field);
  const ci = {
    category: col("category"), name: col("name"), description: col("description"),
    price: col("price"), calories: col("calories"), prepMinutes: col("prepMinutes"),
    allergens: col("allergens"), tags: col("tags"), imageUrl: col("imageUrl"),
  };
  if (ci.name < 0 || ci.price < 0 || ci.category < 0) {
    return { ...empty, error: "Zorunlu sütunlar eksik: kategori, ad, fiyat." };
  }

  // Alerjen eşleştirme haritası (kod + Türkçe etiket)
  const allergens = await prisma.allergen.findMany();
  const allergenMap = new Map<string, string>();
  for (const a of allergens) {
    allergenMap.set(norm(a.code), a.id);
    allergenMap.set(norm(a.label), a.id);
  }

  const get = (r: string[], idx: number) => (idx >= 0 ? (r[idx] ?? "").trim() : "");

  const parsed: ParsedRow[] = [];
  const errors: { row: number; message: string }[] = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const rowNum = i + 1; // 1-tabanlı, başlık dahil
    const name = get(r, ci.name);
    const category = get(r, ci.category);
    const priceRaw = get(r, ci.price);

    if (!name) { errors.push({ row: rowNum, message: "Ürün adı boş." }); continue; }
    if (!category) { errors.push({ row: rowNum, message: "Kategori boş." }); continue; }
    const price = parsePrice(priceRaw);
    if (price === null) { errors.push({ row: rowNum, message: `Geçersiz fiyat: "${priceRaw}"` }); continue; }

    const tagsTokens = get(r, ci.tags).split(",").map(norm).filter(Boolean);
    const allergenTokens = get(r, ci.allergens).split(",").map((t) => norm(t)).filter(Boolean);
    const allergenIds = [...new Set(allergenTokens.map((t) => allergenMap.get(t)).filter(Boolean) as string[])];

    parsed.push({
      rowNum,
      category,
      name,
      description: get(r, ci.description) || null,
      price,
      calories: parseInt0(get(r, ci.calories)),
      prepMinutes: parseInt0(get(r, ci.prepMinutes)),
      imageUrl: get(r, ci.imageUrl) || null,
      allergenIds,
      isFeatured: tagsTokens.some((t) => ["sefinsecimi", "sef", "featured", "chef"].includes(t)),
      isPopular: tagsTokens.some((t) => ["populer", "popular"].includes(t)),
      isNew: tagsTokens.some((t) => ["yeni", "new"].includes(t)),
    });
  }

  // Mevcut kategoriler + bu menüde olmayan (yeni) kategoriler
  const existingCats = await prisma.category.findMany({
    where: { menuId },
    select: { id: true, name: true },
  });
  const catByNorm = new Map(existingCats.map((c) => [norm(c.name), c]));
  const wantedCatNames = [...new Set(parsed.map((p) => p.category))];
  const newCategories = wantedCatNames.filter((n) => !catByNorm.has(norm(n)));

  const base: ImportReport = {
    ok: true,
    total: rows.length - 1,
    valid: parsed.length,
    invalid: errors.length,
    created: 0,
    skipped: 0,
    errors,
    newCategories,
    committed: false,
  };

  if (!commit) return base;

  // ---- COMMIT ----
  try {
    // Eksik kategorileri oluştur
    let catOrder = existingCats.length;
    const catIdByNorm = new Map<string, string>(
      [...catByNorm].map(([k, v]) => [k, v.id]),
    );
    for (const cname of newCategories) {
      const created = await prisma.category.create({
        data: { menuId, name: cname, sortOrder: catOrder++ },
        select: { id: true },
      });
      catIdByNorm.set(norm(cname), created.id);
    }

    // Mevcut ürün adları (kategori bazında, tekrar atlamak için)
    const existingProducts = await prisma.product.findMany({
      where: { category: { menuId } },
      select: { name: true, categoryId: true },
    });
    const existingKey = new Set(existingProducts.map((p) => `${p.categoryId}:${norm(p.name)}`));

    // Her kategori için başlangıç sortOrder
    const orderByCat = new Map<string, number>();

    let created = 0;
    let skipped = 0;
    for (const p of parsed) {
      const categoryId = catIdByNorm.get(norm(p.category));
      if (!categoryId) { skipped++; continue; }
      const key = `${categoryId}:${norm(p.name)}`;
      if (existingKey.has(key)) { skipped++; continue; }
      existingKey.add(key);

      if (!orderByCat.has(categoryId)) {
        const max = await prisma.product.aggregate({
          where: { categoryId },
          _max: { sortOrder: true },
        });
        orderByCat.set(categoryId, (max._max.sortOrder ?? -1) + 1);
      }
      const sortOrder = orderByCat.get(categoryId)!;
      orderByCat.set(categoryId, sortOrder + 1);

      await prisma.product.create({
        data: {
          categoryId,
          businessId,
          name: p.name,
          description: p.description,
          price: p.price,
          calories: p.calories,
          prepMinutes: p.prepMinutes,
          imageUrl: p.imageUrl,
          isFeatured: p.isFeatured,
          isPopular: p.isPopular,
          isNew: p.isNew,
          sortOrder,
          allergens: { create: p.allergenIds.map((allergenId) => ({ allergenId })) },
        },
      });
      created++;
    }

    revalidatePath("/dashboard/menu");
    return { ...base, created, skipped, committed: true };
  } catch {
    return { ...base, ok: false, error: "İçe aktarma sırasında hata oluştu." };
  }
}
