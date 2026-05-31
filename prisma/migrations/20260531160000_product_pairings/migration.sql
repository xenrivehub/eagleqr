-- "Yanında iyi gider" — ürünler arası yönlü eşleşme
CREATE TABLE "ProductPairing" (
  "productId" TEXT NOT NULL,
  "pairedId" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ProductPairing_pkey" PRIMARY KEY ("productId", "pairedId")
);

CREATE INDEX "ProductPairing_productId_idx" ON "ProductPairing" ("productId");

ALTER TABLE "ProductPairing"
  ADD CONSTRAINT "ProductPairing_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductPairing"
  ADD CONSTRAINT "ProductPairing_pairedId_fkey"
  FOREIGN KEY ("pairedId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
