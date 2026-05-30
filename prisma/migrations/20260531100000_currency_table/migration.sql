-- Para birimleri (admin panelinden yönetilir)
CREATE TABLE "Currency" (
  "code" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "position" TEXT NOT NULL DEFAULT 'before',
  "space" BOOLEAN NOT NULL DEFAULT false,
  "decimals" INTEGER NOT NULL DEFAULT 2,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Currency_pkey" PRIMARY KEY ("code")
);

-- Başlangıç para birimleri
INSERT INTO "Currency" ("code","symbol","label","position","space","decimals","sortOrder") VALUES
  ('TRY','₺','Türk Lirası','before',false,2,1),
  ('USD','$','ABD Doları','before',false,2,2),
  ('EUR','€','Euro','after',true,2,3),
  ('GBP','£','İngiliz Sterlini','before',false,2,4),
  ('RUB','₽','Rus Rublesi','after',true,2,5),
  ('SAR','﷼','Suudi Riyali','after',true,2,6),
  ('AED','د.إ','BAE Dirhemi','after',true,2,7),
  ('QAR','﷼','Katar Riyali','after',true,2,8),
  ('CHF','CHF','İsviçre Frangı','before',true,2,9),
  ('JPY','¥','Japon Yeni','before',false,0,10),
  ('CNY','¥','Çin Yuanı','before',false,2,11),
  ('AZN','₼','Azerbaycan Manatı','after',true,2,12);
