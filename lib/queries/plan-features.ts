import { prisma } from "@/lib/prisma";
import { PLANS, type Plan } from "@/lib/plans";
import {
  resolveFeatures,
  type FeatureKey,
  type PlanFeatures,
} from "@/lib/plan-features";

/** İşletmenin efektif özellik bayraklarını (plan + admin override) döndürür. */
export async function getBusinessFeatures(
  businessId: string,
): Promise<PlanFeatures> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { plan: true },
  });
  const plan = (business?.plan ?? "STANDART") as Plan;
  const limit = await prisma.planLimit.findUnique({
    where: { plan },
    select: { features: true },
  });
  return resolveFeatures(plan, limit?.features as Record<string, unknown>);
}

/** Tek bir özelliğin işletmede açık olup olmadığını döndürür. */
export async function hasFeature(
  businessId: string,
  key: FeatureKey,
): Promise<boolean> {
  return (await getBusinessFeatures(businessId))[key];
}

/** Admin sayfası için: tüm planların efektif bayrakları. */
export async function getAllPlanFeatures(): Promise<
  Record<Plan, PlanFeatures>
> {
  const limits = await prisma.planLimit.findMany({
    select: { plan: true, features: true },
  });
  const byPlan = new Map(limits.map((l) => [l.plan, l.features]));
  const out = {} as Record<Plan, PlanFeatures>;
  for (const plan of PLANS) {
    out[plan] = resolveFeatures(
      plan,
      byPlan.get(plan) as Record<string, unknown>,
    );
  }
  return out;
}
