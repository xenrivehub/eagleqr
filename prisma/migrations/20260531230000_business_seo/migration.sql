-- İşletme SEO ayarları (admin panelinden)
ALTER TABLE "Business"
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "seoDescription" TEXT,
  ADD COLUMN "seoKeywords" TEXT;
