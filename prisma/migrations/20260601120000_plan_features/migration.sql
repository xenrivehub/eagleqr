-- Plan bazlı özellik bayrakları
ALTER TABLE "PlanLimit" ADD COLUMN "features" JSONB NOT NULL DEFAULT '{}';
