import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";

const TYPES = ["SCAN", "VIEW", "AR_OPEN", "PAIR_CLICK"] as const;
type EventType = (typeof TYPES)[number];

type Body = {
  businessId?: string;
  type?: EventType;
  productId?: string;
  menuId?: string;
};

export async function POST(req: Request) {
  // Hız limiti — herkese açık uç; analitik kirletme + DB flood'u sınırla (IP başına 60/dk)
  const ip = ipFromRequest(req);
  if (!rateLimit(`track:${ip}`, 60, 60_000).ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { businessId, type, productId, menuId } = body;
  if (!businessId || !type || !TYPES.includes(type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true },
  });
  if (!business) return NextResponse.json({ ok: false }, { status: 404 });

  // Dil çerezi doğrulama — yalnız 2 harfli kod kabul, aksi halde "tr"
  // (rastgele/aşırı uzun çerez değerinin DB'ye yazılmasını engeller)
  const rawLang = (await cookies()).get("eq_lang")?.value;
  const lang = rawLang && /^[a-z]{2}$/.test(rawLang) ? rawLang : "tr";

  // productId / menuId yalnızca bu işletmeye aitse kabul (çapraz-kiracı kirliliği önle)
  let safeMenuId: string | null = null;
  if (menuId) {
    const m = await prisma.menu.findFirst({
      where: { id: menuId, businessId },
      select: { id: true },
    });
    safeMenuId = m?.id ?? null;
  }
  let safeProductId: string | null = null;
  if (type !== "SCAN" && productId) {
    const p = await prisma.product.findFirst({
      where: { id: productId, businessId },
      select: { id: true },
    });
    safeProductId = p?.id ?? null;
  }

  await prisma.scanEvent.create({
    data: {
      businessId,
      type,
      lang,
      menuId: safeMenuId,
      // SCAN dışındaki olaylar ürün bazlı
      productId: safeProductId,
    },
  });

  return NextResponse.json({ ok: true });
}
