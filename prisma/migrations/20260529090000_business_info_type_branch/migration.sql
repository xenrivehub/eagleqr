-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('SINGLE', 'CHAIN');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "type" "BusinessType" NOT NULL DEFAULT 'SINGLE',
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "about" TEXT,
ADD COLUMN     "openingHours" TEXT;

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Menu_businessId_slug_key" ON "Menu"("businessId", "slug");
