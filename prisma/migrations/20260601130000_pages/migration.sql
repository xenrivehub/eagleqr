-- Pazarlama sayfaları (blok tabanlı CMS)
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED');

CREATE TABLE "Page" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
  "blocks" JSONB NOT NULL DEFAULT '[]',
  "navLabel" TEXT,
  "navOrder" INTEGER NOT NULL DEFAULT 0,
  "showInNav" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
