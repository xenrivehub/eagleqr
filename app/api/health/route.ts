import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isR2Configured } from "@/lib/r2";

// Uptime/health kontrolü — Coolify health check'e bağlanabilir.
// DB erişilemezse 503 döner; R2 durumu bilgi amaçlıdır.
export const dynamic = "force-dynamic";

const STARTED_AT = Date.now();

export async function GET() {
  let db = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = true;
  } catch {
    db = false;
  }

  const body = {
    status: db ? "ok" : "degraded",
    db,
    r2: isR2Configured(),
    uptimeSec: Math.round((Date.now() - STARTED_AT) / 1000),
    ts: new Date().toISOString(),
  };

  return NextResponse.json(body, { status: db ? 200 : 503 });
}
