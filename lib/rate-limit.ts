// Basit, bağımlılıksız in-memory rate limiter (tek instance için yeterli).
// Railway'de tek süreçte çalışır; süreç yeniden başlarsa sayaçlar sıfırlanır.
// Dağıtık ölçek gerekirse Redis tabanlı bir limiter'a geçilebilir.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

// Süresi dolmuş kovaları ara sıra temizle (Map sınırsız büyümesin)
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (now >= b.resetAt) buckets.delete(key);
  }
}

/**
 * Sabit pencere (fixed-window) rate limit.
 * @returns ok=false ise limit aşıldı; retryAfter saniye cinsinden.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  sweep(now);

  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, retryAfter: 0 };
}

/** İstek başlıklarından istemci IP'sini çıkarır (proxy arkasında x-forwarded-for). */
export function ipFromRequest(req?: { headers: Headers }): string {
  const h = req?.headers;
  const fwd = h?.get("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0] : h?.get("x-real-ip"))?.trim();
  return ip || "unknown";
}
