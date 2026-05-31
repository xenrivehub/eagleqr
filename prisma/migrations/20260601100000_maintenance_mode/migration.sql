-- Bakım modu
ALTER TABLE "Business"
  ADD COLUMN "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "maintenanceMessage" TEXT;
