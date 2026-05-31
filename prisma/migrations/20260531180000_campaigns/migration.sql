-- Kampanya etiketleri (admin panelinden yönetilir)
CREATE TABLE "Campaign" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "color" TEXT NOT NULL DEFAULT '#ea580c',
  "translations" JSONB NOT NULL DEFAULT '{}',
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- Ürün kampanya alanları
ALTER TABLE "Product"
  ADD COLUMN "campaignId" TEXT,
  ADD COLUMN "campaignStart" TEXT,
  ADD COLUMN "campaignEnd" TEXT,
  ADD COLUMN "campaignPrice" DECIMAL(10,2);

CREATE INDEX "Product_campaignId_idx" ON "Product" ("campaignId");

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_campaignId_fkey"
  FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Başlangıç kampanya etiketleri (EN çevirileriyle)
INSERT INTO "Campaign" ("id","label","color","translations","sortOrder") VALUES
  ('camp_discount','İndirimde','#dc2626','{"en":"On Sale"}',1),
  ('camp_happyhour','Happy Hour','#ea580c','{"en":"Happy Hour"}',2),
  ('camp_daily','Günün Menüsü','#16a34a','{"en":"Daily Special"}',3),
  ('camp_deal','Fırsat','#7c3aed','{"en":"Deal"}',4),
  ('camp_season','Yeni Sezon','#0891b2','{"en":"New Season"}',5);
