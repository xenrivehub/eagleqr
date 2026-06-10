-- Kategori başlık kartı: açıklama + görsel/video
ALTER TABLE "Category" ADD COLUMN "description" TEXT;
ALTER TABLE "Category" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Category" ADD COLUMN "videoUrl" TEXT;

-- QR açılış (splash) ekranı — Pro/Max
ALTER TABLE "Business" ADD COLUMN "splashEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Business" ADD COLUMN "splashImageUrl" TEXT;
ALTER TABLE "Business" ADD COLUMN "splashVideoUrl" TEXT;
