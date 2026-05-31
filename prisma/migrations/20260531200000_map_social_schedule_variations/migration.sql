-- Harita + sosyal medya (işletme)
ALTER TABLE "Business"
  ADD COLUMN "mapUrl" TEXT,
  ADD COLUMN "socialLinks" JSONB NOT NULL DEFAULT '{}';

-- Servis saatleri (kategori + ürün) + ürün varyasyonları
ALTER TABLE "Category"
  ADD COLUMN "availStart" TEXT,
  ADD COLUMN "availEnd" TEXT;

ALTER TABLE "Product"
  ADD COLUMN "availStart" TEXT,
  ADD COLUMN "availEnd" TEXT,
  ADD COLUMN "variations" JSONB NOT NULL DEFAULT '[]';
