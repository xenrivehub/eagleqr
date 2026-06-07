-- Şubeye özel ayarlar (zincir işletmeler) — boş/null ise marka geneli kullanılır
ALTER TABLE "Menu" ADD COLUMN "contactEmail" TEXT;
ALTER TABLE "Menu" ADD COLUMN "logoUrl" TEXT;
ALTER TABLE "Menu" ADD COLUMN "mapUrl" TEXT;
ALTER TABLE "Menu" ADD COLUMN "socialLinks" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Menu" ADD COLUMN "maintenanceMode" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Menu" ADD COLUMN "maintenanceMessage" TEXT;
ALTER TABLE "Menu" ADD COLUMN "themeKey" TEXT;
ALTER TABLE "Menu" ADD COLUMN "currency" TEXT;
