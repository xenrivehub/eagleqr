import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateDefaultMenu } from "@/lib/actions/menu";
import { getActiveBranch } from "@/lib/branch-context";
import { getBusinessFeatures } from "@/lib/queries/plan-features";
import MenuScanWizard from "@/components/dashboard/MenuScanWizard";

export const metadata = { title: "Fotoğraftan İçe Aktar — Eagle Menu" };

export default async function MenuScanPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({ where: { id: businessId }, select: { type: true } });
  if (!business) redirect("/login");

  const features = await getBusinessFeatures(businessId);

  // Menü çözümle (tekil → varsayılan, zincir → aktif şube)
  let menuId: string | null = null;
  let branchName: string | null = null;
  if (business.type === "CHAIN") {
    const { active } = await getActiveBranch(businessId);
    if (active) { menuId = active.id; branchName = active.name; }
  } else {
    const menu = await getOrCreateDefaultMenu(businessId);
    menuId = menu.id;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <Link href="/dashboard/menu" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
        Menü
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold text-ink">Fotoğraftan menü oluştur (AI)</h1>
      <p className="mt-2 text-ink/60">
        Basılı menünüzün fotoğrafını yükleyin; yapay zeka ürünleri, açıklamaları ve
        fiyatları çıkarsın. Önizlemede düzenleyip menünüze ekleyin.
      </p>

      <div className="mt-8">
        {!features.menuScan ? (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center">
            <div className="text-3xl">🔒</div>
            <p className="mt-2 font-display text-lg font-semibold text-ink">Bu özellik Max planında</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-ink/60">Fotoğraftan menü oluşturma yalnızca Max planında. Açtırmak için iletişime geçin.</p>
          </div>
        ) : !menuId ? (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center">
            <p className="font-display text-lg font-semibold text-ink">Önce bir şube ekleyin</p>
            <Link href="/dashboard/branches" className="mt-4 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark">+ Şube ekle</Link>
          </div>
        ) : (
          <MenuScanWizard menuId={menuId} branchName={branchName} />
        )}
      </div>
    </div>
  );
}
