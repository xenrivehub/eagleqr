# syntax=docker/dockerfile:1
# Eagle Menu — Next.js 16 (standalone) production image for Coolify.
# Migration'ı deploy sonrası Coolify terminalinden çalıştır:
#   npx prisma migrate deploy

# ---- deps: bağımlılıklar ----
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: prisma generate + next build ----
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL build sırasında gerekmez (statik build); prisma generate şema okur.
RUN npx prisma generate && npm run build

# ---- runner: küçük çalışma imajı ----
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 nodejs && adduser -S nextjs -u 1001

# Next standalone çıktısı (server.js + izlenen node_modules)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma CLI + şema + client — Coolify terminalinden `npx prisma migrate deploy` için
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
