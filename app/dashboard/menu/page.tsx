import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateDefaultMenu } from "@/lib/actions/menu";
import { getActiveBranch } from "@/lib/branch-context";
import { loadMenuForManager } from "@/lib/queries/menu";
import { getMediaEntitlements } from "@/lib/queries/entitlements";
import { getEnabledLanguages } from "@/lib/queries/languages";
import { getCurrencySpec } from "@/lib/queries/currencies";
import { getEnabledCampaigns } from "@/lib/queries/campaigns";
import { getBusinessFeatures } from "@/lib/queries/plan-features";
import MenuManager from "@/components/dashboard/MenuManager";

export default async function MenuPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { type: true, currency: true },
  });
  if (!business) redirect("/login");

  // Zincir işletme → aktif şubenin menüsü
  if (business.type === "CHAIN") {
    const { branches, active } = await getActiveBranch(businessId);

    if (!active) {
      return (
        <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
          <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center">
            <p className="font-display text-lg font-semibold text-ink">Henüz şube yok</p>
            <p className="mt-1 text-sm text-ink/60">Menü oluşturmak için önce bir şube ekleyin.</p>
            <Link
              href="/dashboard/branches"
              className="mt-5 inline-block cursor-pointer rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark"
            >
              + Şube ekle
            </Link>
          </div>
        </div>
      );
    }

    const [{ categories, allergens }, media, languages, currency, campaigns, features] = await Promise.all([
      loadMenuForManager(active.id),
      getMediaEntitlements(businessId),
      getEnabledLanguages(),
      getCurrencySpec(business.currency),
      getEnabledCampaigns(),
      getBusinessFeatures(businessId),
    ]);

    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
            {active.name} · menü
          </p>
          <Link
            href="/dashboard/branches"
            className="text-sm font-medium text-ink/60 hover:text-ink"
          >
            Şubeleri yönet ({branches.length}) →
          </Link>
        </div>
        <MenuManager menuId={active.id} categories={categories} allergens={allergens} media={media} languages={languages} currency={currency} campaigns={campaigns} features={features} />
      </div>
    );
  }

  // Tekil işletme → tek menü
  const menu = await getOrCreateDefaultMenu(businessId);
  const [{ categories, allergens }, media, languages, currency, campaigns, features] = await Promise.all([
    loadMenuForManager(menu.id),
    getMediaEntitlements(businessId),
    getEnabledLanguages(),
    getCurrencySpec(business.currency),
    getEnabledCampaigns(),
    getBusinessFeatures(businessId),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <MenuManager menuId={menu.id} categories={categories} allergens={allergens} media={media} languages={languages} currency={currency} campaigns={campaigns} features={features} />
    </div>
  );
}
