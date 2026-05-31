-- Ürün kampanyasına tarih aralığı
ALTER TABLE "Product"
  ADD COLUMN "campaignDateStart" TEXT,
  ADD COLUMN "campaignDateEnd" TEXT;

-- Kategori kampanyası (zamanlı indirim + rozet)
ALTER TABLE "Category"
  ADD COLUMN "campaignId" TEXT,
  ADD COLUMN "campaignStart" TEXT,
  ADD COLUMN "campaignEnd" TEXT,
  ADD COLUMN "campaignDateStart" TEXT,
  ADD COLUMN "campaignDateEnd" TEXT,
  ADD COLUMN "campaignDiscType" TEXT,
  ADD COLUMN "campaignDiscValue" DECIMAL(10,2);

CREATE INDEX "Category_campaignId_idx" ON "Category" ("campaignId");

ALTER TABLE "Category"
  ADD CONSTRAINT "Category_campaignId_fkey"
  FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
