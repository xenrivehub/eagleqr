# syntax=docker/dockerfile:1
# Eagle Menu — Next.js 16 (standalone) production image for Coolify.
# Migration'ı deploy sonrası Coolify terminalinden çalıştır (Prisma 7 CLI wasm'ları
# prisma/build içinde olduğu için CLI'ı gerçek konumundan çağırıyoruz):
#   node ./node_modules/prisma/build/index.js migrate deploy --schema=./prisma/schema.prisma

# ---- deps: bağımlılıklar ----
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: postinstall'daki `prisma generate` bu aşamada şemayı göremez
# (henüz kopyalanmadı). Client, builder aşamasında `npx prisma generate` ile üretilir.
RUN npm ci --ignore-scripts

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

# Prisma CLI (build/ içinde wasm dahil) + şema + client — migration için.
# NOT: .bin/prisma symlink'i KOPYALANMAZ; düz dosya olarak kopyalanınca CLI
# kendini .bin içinde sanıp wasm'ları orada arar ve bulamaz. CLI'ı gerçek
# konumundan çalıştırıyoruz (yorumdaki komuta bak).
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
