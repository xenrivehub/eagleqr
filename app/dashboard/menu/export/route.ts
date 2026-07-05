import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";

// Menüyü CSV olarak dışa aktarır (içe aktarma şablonuyla uyumlu başlıklar).
// GET /dashboard/menu/export?menuId=... (menuId yoksa ilk menü)
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  const businessId = session?.user?.businessId;
  if (!businessId) return new Response("Yetkisiz", { status: 401 });

  const url = new URL(req.url);
  const menuIdParam = url.searchParams.get("menuId");
  const menu = menuIdParam
    ? await prisma.menu.findFirst({ where: { id: menuIdParam, businessId }, select: { id: true, name: true } })
    : await prisma.menu.findFirst({ where: { businessId }, orderBy: { createdAt: "asc" }, select: { id: true, name: true } });
  if (!menu) return new Response("Menü bulunamadı", { status: 404 });

  const categories = await prisma.category.findMany({
    where: { menuId: menu.id },
    orderBy: { sortOrder: "asc" },
    select: {
      name: true,
      products: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          name: true, description: true, price: true, calories: true, prepMinutes: true,
          isFeatured: true, isPopular: true, isNew: true,
          imageUrl: true,
          allergens: { select: { allergen: { select: { code: true } } } },
        },
      },
    },
  });

  const header = ["kategori", "ad", "aciklama", "fiyat", "kalori", "hazirlik_dk", "alerjenler", "etiketler", "gorsel_url"];
  const rows: (string | number | null)[][] = [header];

  for (const c of categories) {
    for (const p of c.products) {
      const tags: string[] = [];
      if (p.isFeatured) tags.push("sefinsecimi");
      if (p.isPopular) tags.push("populer");
      if (p.isNew) tags.push("yeni");
      rows.push([
        c.name,
        p.name,
        p.description ?? "",
        Number(p.price),
        p.calories ?? "",
        p.prepMinutes ?? "",
        p.allergens.map((a) => a.allergen.code).join(", "),
        tags.join(", "),
        p.imageUrl ?? "",
      ]);
    }
  }

  // UTF-8 BOM — Excel Türkçe karakterleri doğru açsın
  const csv = "﻿" + toCsv(rows);
  const fileName = `menu-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
