// ============================================================================
// Üyelik planları & medya yetkileri
// Plan limitleri DB'de (PlanLimit) tutulur, admin panelinden düzenlenir.
// Efektif limit = PlanLimit[plan] + işletmeye eklenen ekstra kota.
// Bir özellik "açık" demek: efektif limit > 0.
// ============================================================================

export type Plan = "STANDART" | "PRO" | "MAX";

export const PLANS: Plan[] = ["STANDART", "PRO", "MAX"];

export const PLAN_LABELS: Record<Plan, string> = {
  STANDART: "Standart",
  PRO: "Pro",
  MAX: "Max",
};

export type MediaKind = "video" | "ar";

// İşletmenin medya yetki durumu (DB'den hesaplanır)
export type MediaEntitlements = {
  plan: Plan;
  video: { limit: number; used: number; remaining: number; allowed: boolean };
  ar: { limit: number; used: number; remaining: number; allowed: boolean };
};

function slot(limit: number, used: number) {
  const remaining = Math.max(0, limit - used);
  return { limit, used, remaining, allowed: limit > 0 };
}

export function buildEntitlements(args: {
  plan: Plan;
  planVideoLimit: number;
  planArLimit: number;
  videoQuota: number;
  arQuota: number;
  videoUsed: number;
  arUsed: number;
}): MediaEntitlements {
  return {
    plan: args.plan,
    video: slot(args.planVideoLimit + args.videoQuota, args.videoUsed),
    ar: slot(args.planArLimit + args.arQuota, args.arUsed),
  };
}
