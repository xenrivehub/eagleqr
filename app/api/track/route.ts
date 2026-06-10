import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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

  const lang = (await cookies()).get("eq_lang")?.value ?? "tr";

  await prisma.scanEvent.create({
    data: {
      businessId,
      type,
      lang,
      menuId: menuId ?? null,
      // SCAN dışındaki olaylar ürün bazlı
      productId: type === "SCAN" ? null : (productId ?? null),
    },
  });

  return NextResponse.json({ ok: true });
}
