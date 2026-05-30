"use server";

import { createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const ANON_COOKIE = "eq_anon";
const IP_WINDOW_MS = 60 * 60 * 1000; // 1 saat
const IP_MAX_PER_WINDOW = 40; // tek IP'den saatte en fazla oy (kalabalık kafeyi engellemez)

type RateResult =
  | { success: true; avg: number; count: number; mine: number }
  | { success: false; error: string };

function hashIp(ip: string): string {
  const salt = process.env.RATING_SALT ?? "eagle-qr-rating";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex").slice(0, 32);
}

async function clientIpHash(): Promise<string | null> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0] : h.get("x-real-ip"))?.trim();
  return ip ? hashIp(ip) : null;
}

async function aggregate(productId: string) {
  const agg = await prisma.productRating.aggregate({
    where: { productId },
    _avg: { stars: true },
    _count: { _all: true },
  });
  return {
    avg: Math.round((agg._avg.stars ?? 0) * 10) / 10,
    count: agg._count._all,
  };
}

export async function rateProduct(productId: string, stars: number): Promise<RateResult> {
  try {
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return { success: false, error: "Geçersiz puan." };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, business: { select: { ratingsEnabled: true } } },
    });
    if (!product) return { success: false, error: "Ürün bulunamadı." };
    if (!product.business.ratingsEnabled) {
      return { success: false, error: "Puanlama kapalı." };
    }

    // anonId çerezi (yoksa üret)
    const store = await cookies();
    let anonId = store.get(ANON_COOKIE)?.value;
    if (!anonId) {
      anonId = randomUUID();
      store.set(ANON_COOKIE, anonId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 2,
        sameSite: "lax",
      });
    }

    const ipHash = await clientIpHash();

    // IP yumuşak hız limiti — yalnızca YENİ oy için (kendi oyunu güncellemek serbest)
    const existing = await prisma.productRating.findUnique({
      where: { productId_anonId: { productId, anonId } },
      select: { id: true },
    });
    if (!existing && ipHash) {
      const since = new Date(Date.now() - IP_WINDOW_MS);
      const recent = await prisma.productRating.count({
        where: { ipHash, createdAt: { gt: since } },
      });
      if (recent >= IP_MAX_PER_WINDOW) {
        return { success: false, error: "Çok fazla oy. Lütfen daha sonra deneyin." };
      }
    }

    await prisma.productRating.upsert({
      where: { productId_anonId: { productId, anonId } },
      create: { productId, anonId, ipHash, stars },
      update: { stars, ipHash },
    });

    const { avg, count } = await aggregate(productId);
    return { success: true, avg, count, mine: stars };
  } catch {
    return { success: false, error: "Puan kaydedilemedi." };
  }
}
