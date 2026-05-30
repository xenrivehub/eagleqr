-- İşletme yıldız puanı açık/kapalı
ALTER TABLE "Business" ADD COLUMN "ratingsEnabled" BOOLEAN NOT NULL DEFAULT true;

-- Anonim yıldız puanı (yorumsuz)
CREATE TABLE "ProductRating" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "anonId" TEXT NOT NULL,
  "ipHash" TEXT,
  "stars" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductRating_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductRating_productId_anonId_key" ON "ProductRating" ("productId", "anonId");
CREATE INDEX "ProductRating_productId_idx" ON "ProductRating" ("productId");
CREATE INDEX "ProductRating_ipHash_createdAt_idx" ON "ProductRating" ("ipHash", "createdAt");

ALTER TABLE "ProductRating"
  ADD CONSTRAINT "ProductRating_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
