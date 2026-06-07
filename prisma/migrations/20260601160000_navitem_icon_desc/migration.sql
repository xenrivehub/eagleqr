-- Navbar öğelerine ikon + açıklama
ALTER TABLE "NavItem" ADD COLUMN "description" TEXT;
ALTER TABLE "NavItem" ADD COLUMN "icon" TEXT;
