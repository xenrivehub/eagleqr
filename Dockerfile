# Eagle Menu — Next.js 16 production image (Coolify).
# Tek aşama, tam node_modules: Prisma CLI + wasm + .bin symlink'leri doğru kalır,
# böylece `npx prisma migrate deploy` container içinde dertsiz çalışır.
#
# Migration'ı deploy sonrası Coolify terminalinden çalıştır:
#   npx prisma migrate deploy

FROM node:22-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# prisma/ ve prisma.config.ts npm ci'den ÖNCE gelir; postinstall'daki
# `prisma generate` şemayı ve config'i bulabilsin diye.
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# Kalan kaynak + prod build
COPY . .
RUN npx prisma generate && npx next build

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000
CMD ["npx", "next", "start"]
