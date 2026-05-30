-- Platform dilleri
CREATE TABLE "Language" (
  "code" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "nativeLabel" TEXT NOT NULL,
  "rtl" BOOLEAN NOT NULL DEFAULT false,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Language_pkey" PRIMARY KEY ("code")
);

-- Genel ayarlar (anahtar/değer)
CREATE TABLE "AppSetting" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

-- Çeviri alanları
ALTER TABLE "Product" ADD COLUMN "translations" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Category" ADD COLUMN "translations" JSONB NOT NULL DEFAULT '{}';

-- Varsayılan çeviri modeli + başlangıç dili (İngilizce)
INSERT INTO "AppSetting" ("key", "value") VALUES ('translation_model', 'google/gemini-2.0-flash-001');
INSERT INTO "Language" ("code", "label", "nativeLabel", "rtl", "enabled", "sortOrder") VALUES
  ('en', 'İngilizce', 'English', false, true, 1);
