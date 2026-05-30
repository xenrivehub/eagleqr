-- İşletme başına açılan premium temalar (free temalar her zaman erişilebilir)
ALTER TABLE "Business" ADD COLUMN "allowedThemes" TEXT[] NOT NULL DEFAULT '{}';

-- Yeni işletmeler için varsayılan tema ücretsiz bir temaya çekildi
ALTER TABLE "Business" ALTER COLUMN "themeKey" SET DEFAULT 'mineral';
