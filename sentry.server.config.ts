import * as Sentry from "@sentry/nextjs";

// Sadece DSN varsa etkinleşir — yoksa tamamen no-op.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
  });
}
