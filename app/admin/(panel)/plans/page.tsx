import { prisma } from "@/lib/prisma";
import { PLANS, type Plan } from "@/lib/plans";
import { getAllPlanFeatures } from "@/lib/queries/plan-features";
import PlanLimitsEditor, { type PlanLimitRow } from "@/components/admin/PlanLimitsEditor";
import PlanFeaturesEditor, { type PlanFeatureRow } from "@/components/admin/PlanFeaturesEditor";

export default async function AdminPlansPage() {
  const limits = await prisma.planLimit.findMany();
  const byPlan = new Map(limits.map((l) => [l.plan, l]));

  const rows: PlanLimitRow[] = PLANS.map((plan) => {
    const l = byPlan.get(plan as Plan);
    return {
      plan: plan as Plan,
      videoLimit: l?.videoLimit ?? 0,
      arLimit: l?.arLimit ?? 0,
    };
  });

  const allFeatures = await getAllPlanFeatures();
  const featureRows: PlanFeatureRow[] = PLANS.map((plan) => ({
    plan: plan as Plan,
    features: allFeatures[plan as Plan],
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Plan Limitleri</h1>
      <p className="mt-2 text-ink/60">
        Her üyelik planının kaç ürüne video / AR ekleyebileceğini buradan
        ayarlayın. İşletmelere ayrıca <strong>İşletmeler</strong> sayfasından
        plan-dışı ekstra kota verebilirsiniz.
      </p>
      <div className="mt-8">
        <PlanLimitsEditor rows={rows} />
      </div>
      <p className="mt-5 text-sm text-ink/50">
        Standart: sadece görsel · Pro: + video · Max: + AR/3D. Bir özellik için
        limit 0 ise o plan o özelliği kullanamaz.
      </p>

      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold text-ink">Plan Özellikleri</h2>
        <p className="mt-2 text-ink/60">
          Her planın hangi özellikleri kullanabileceğini buradan açıp kapatın.
          Kapalı bir özellik o plandaki işletmelerin panelinde gizlenir ve arka
          planda da engellenir.
        </p>
        <div className="mt-6">
          <PlanFeaturesEditor rows={featureRows} />
        </div>
      </div>
    </div>
  );
}
