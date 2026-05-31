import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getActiveBranch } from "@/lib/branch-context";
import { getEnabledCurrencies, getCurrencySpec } from "@/lib/queries/currencies";
import BusinessInfoForm from "@/components/dashboard/BusinessInfoForm";
import BranchContactForm from "@/components/dashboard/BranchContactForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      name: true,
      type: true,
      logoUrl: true,
      phone: true,
      contactEmail: true,
      address: true,
      about: true,
      openingHours: true,
      currency: true,
      ratingsEnabled: true,
      mapUrl: true,
      socialLinks: true,
    },
  });
  if (!business) redirect("/login");

  const currencies = await getEnabledCurrencies();
  if (!currencies.some((c) => c.code === business.currency)) {
    currencies.unshift(await getCurrencySpec(business.currency));
  }

  const isChain = business.type === "CHAIN";
  const active = isChain ? (await getActiveBranch(businessId)).active : null;
  const branch = active
    ? await prisma.menu.findUnique({
        where: { id: active.id },
        select: { id: true, name: true, phone: true, address: true, openingHours: true },
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">İşletme Bilgileri</h1>
      <p className="mt-2 text-ink/60">
        {isChain
          ? "Genel marka bilgileri tüm şubelerde geçerlidir. İletişim bilgileri aktif şubeye özeldir."
          : "İşletmenizin iletişim ve tanıtım bilgilerini düzenleyin. İşletme adı dışında hepsi opsiyoneldir."}
      </p>

      <div className="mt-8">
        {isChain && (
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-dark">
            Genel bilgiler
          </h2>
        )}
        <BusinessInfoForm
          name={business.name}
          logoUrl={business.logoUrl}
          phone={business.phone ?? ""}
          contactEmail={business.contactEmail ?? ""}
          address={business.address ?? ""}
          about={business.about ?? ""}
          openingHours={business.openingHours ?? ""}
          currency={business.currency}
          currencies={currencies}
          ratingsEnabled={business.ratingsEnabled}
          mapUrl={business.mapUrl ?? ""}
          social={(business.socialLinks as Record<string, string>) ?? {}}
        />
      </div>

      {isChain && branch && (
        <div className="mt-12">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-dark">
            Şube bilgileri · {branch.name}
          </h2>
          <p className="mb-4 text-sm text-ink/60">
            Bu şubenin iletişim bilgileri. Başka şube için sol menüden şube
            değiştirin. Boş bırakılırsa işletme geneli kullanılır.
          </p>
          <BranchContactForm
            menuId={branch.id}
            branchName={branch.name}
            phone={branch.phone ?? ""}
            address={branch.address ?? ""}
            openingHours={branch.openingHours ?? ""}
          />
        </div>
      )}
    </div>
  );
}
