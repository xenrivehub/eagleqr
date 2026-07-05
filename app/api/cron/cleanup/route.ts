import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isR2Configured } from "@/lib/r2";
import { listObjects, deleteKeys, keyFromUrl } from "@/lib/r2-admin";
import { logAudit } from "@/lib/audit";

// R2 sahipsiz (orphan) dosya temizliği. X-Cron-Secret header'ı ile korunur.
// Coolify cron veya harici zamanlayıcıdan tetiklenir:
//   curl -H "X-Cron-Secret: $CRON_SECRET" https://.../api/cron/cleanup
// Güvenlik: yalnızca `businesses/` prefix'i taranır; son 24 saatte yüklenen
// dosyalar (henüz kaydedilmemiş olabilir) atlanır.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const GRACE_MS = 24 * 60 * 60 * 1000;

async function handle(req: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET tanımlı değil." }, { status: 503 });
  }
  if (req.headers.get("x-cron-secret") !== secret) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 yapılandırılmamış." }, { status: 503 });
  }

  // DB'de referans verilen tüm anahtarlar
  const referenced = new Set<string>();
  const add = (url: string | null | undefined) => {
    const k = keyFromUrl(url);
    if (k) referenced.add(k);
  };

  const [products, businesses, menus, categories] = await Promise.all([
    prisma.product.findMany({ select: { imageUrl: true, videoUrl: true, modelGlbUrl: true, modelUsdzUrl: true } }),
    prisma.business.findMany({ select: { logoUrl: true, coverUrl: true, splashImageUrl: true, splashVideoUrl: true } }),
    prisma.menu.findMany({ select: { logoUrl: true } }),
    prisma.category.findMany({ select: { imageUrl: true, videoUrl: true } }),
  ]);
  for (const p of products) { add(p.imageUrl); add(p.videoUrl); add(p.modelGlbUrl); add(p.modelUsdzUrl); }
  for (const b of businesses) { add(b.logoUrl); add(b.coverUrl); add(b.splashImageUrl); add(b.splashVideoUrl); }
  for (const m of menus) add(m.logoUrl);
  for (const c of categories) { add(c.imageUrl); add(c.videoUrl); }

  // R2'deki tüm işletme dosyaları
  const objects = await listObjects("businesses/");
  const cutoff = Date.now() - GRACE_MS;
  const orphans = objects
    .filter((o) => !referenced.has(o.key))
    .filter((o) => !o.lastModified || o.lastModified.getTime() < cutoff)
    .map((o) => o.key);

  const deleted = await deleteKeys(orphans);
  await logAudit({
    action: "cron.cleanup",
    targetType: "R2",
    meta: { scanned: objects.length, referenced: referenced.size, orphans: orphans.length, deleted },
  });

  return NextResponse.json({
    ok: true,
    scanned: objects.length,
    referenced: referenced.size,
    orphans: orphans.length,
    deleted,
  });
}

export async function GET(req: Request) {
  return handle(req);
}
export async function POST(req: Request) {
  return handle(req);
}
