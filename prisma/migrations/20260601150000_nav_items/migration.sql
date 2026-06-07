-- Admin'den yönetilen site navbar'ı
CREATE TABLE "NavItem" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "url" TEXT,
  "pageId" TEXT,
  "parentId" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NavItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "NavItem_parentId_idx" ON "NavItem"("parentId");

ALTER TABLE "NavItem" ADD CONSTRAINT "NavItem_pageId_fkey"
  FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "NavItem" ADD CONSTRAINT "NavItem_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "NavItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
