// Next.js instrumentation — sunucu/edge runtime'da Sentry'yi başlatır.
// DSN yoksa init no-op olduğundan güvenle çalışır.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Sunucu tarafı istek hatalarını (server action / route / RSC) yakalar.
export { captureRequestError as onRequestError } from "@sentry/nextjs";
