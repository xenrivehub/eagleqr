-- Yeni etkileşim olayları + dil + indeks (popüler rozet, etki paneli, dil analitiği)
ALTER TYPE "ScanType" ADD VALUE IF NOT EXISTS 'AR_OPEN';
ALTER TYPE "ScanType" ADD VALUE IF NOT EXISTS 'PAIR_CLICK';

ALTER TABLE "ScanEvent" ADD COLUMN "lang" TEXT;

CREATE INDEX "ScanEvent_menuId_type_ts_idx" ON "ScanEvent"("menuId", "type", "ts");
