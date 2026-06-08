import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://eaglemenu.com";

export const revalidate = 3600; // sitemap saatte bir yenilensin

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, businesses, branches, products] = await Promise.all([
    // Yayınlanmış özel sayfalar (/slug) + yasal sayfalar
    prisma.page.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    // Yayında (ACTIVE) işletme menüleri (/m/[slug])
    prisma.business.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    // Zincir şube menüleri (/m/[isletme]/[sube])
    prisma.menu.findMany({
      where: {
        isActive: true,
        slug: { not: null },
        business: { status: "ACTIVE", type: "CHAIN" },
      },
      select: { slug: true, updatedAt: true, business: { select: { slug: true } } },
    }),
    // Ürün detay sayfaları (ACTIVE işletmeler) — sınırlı sayıda
    prisma.product.findMany({
      where: { business: { status: "ACTIVE" } },
      select: { id: true, updatedAt: true, business: { select: { slug: true } } },
      orderBy: { updatedAt: "desc" },
      take: 20000,
    }),
  ]);

  const entries: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
  ];

  for (const p of pages) {
    entries.push({ url: `${BASE}/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly", priority: 0.6 });
  }
  for (const b of businesses) {
    entries.push({ url: `${BASE}/m/${b.slug}`, lastModified: b.updatedAt, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const br of branches) {
    if (br.business.slug && br.slug) {
      entries.push({ url: `${BASE}/m/${br.business.slug}/${br.slug}`, lastModified: br.updatedAt, changeFrequency: "weekly", priority: 0.7 });
    }
  }
  for (const p of products) {
    if (p.business.slug) {
      entries.push({ url: `${BASE}/m/${p.business.slug}/urun/${p.id}`, lastModified: p.updatedAt, changeFrequency: "monthly", priority: 0.5 });
    }
  }

  return entries;
}
