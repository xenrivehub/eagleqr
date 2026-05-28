import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Body = {
  businessId?: string;
  type?: "SCAN" | "VIEW";
  productId?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { businessId, type, productId } = body;
  if (!businessId || (type !== "SCAN" && type !== "VIEW")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { id: true },
  });
  if (!business) return NextResponse.json({ ok: false }, { status: 404 });

  await prisma.scanEvent.create({
    data: {
      businessId,
      type,
      productId: type === "VIEW" ? (productId ?? null) : null,
    },
  });

  return NextResponse.json({ ok: true });
}
