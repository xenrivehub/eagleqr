-- Üyelik planı (medya yetkileri)
CREATE TYPE "Plan" AS ENUM ('STANDART', 'PRO', 'MAX');

ALTER TABLE "Business"
  ADD COLUMN "plan" "Plan" NOT NULL DEFAULT 'STANDART',
  ADD COLUMN "videoQuota" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "arQuota" INTEGER NOT NULL DEFAULT 0;

-- Plan başına medya limitleri (admin panelinden düzenlenir)
CREATE TABLE "PlanLimit" (
  "plan" "Plan" NOT NULL,
  "videoLimit" INTEGER NOT NULL DEFAULT 0,
  "arLimit" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PlanLimit_pkey" PRIMARY KEY ("plan")
);

-- Varsayılan limitler: Standart 0/0, Pro 10/0, Max 30/30
INSERT INTO "PlanLimit" ("plan", "videoLimit", "arLimit", "updatedAt") VALUES
  ('STANDART', 0, 0, CURRENT_TIMESTAMP),
  ('PRO', 10, 0, CURRENT_TIMESTAMP),
  ('MAX', 30, 30, CURRENT_TIMESTAMP);
