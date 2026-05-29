import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BusinessInfoForm from "@/components/dashboard/BusinessInfoForm";
import BranchContactForm from "@/components/dashboard/BranchContactForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    select: {
      name: true,
      type: true,
      logoUrl: true,
      phone: true,
      contactEmail: true,
      address: true,
      about: true,
      openingHours: true,
    },
  });
  if (!business) redirect("/login");

  const isChain = business.type === "CHAIN";
  const branches = isChain
    ? await prisma.menu.findMany({
        where: { businessId: session.user.businessId },
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, phone: true, address: true, openingHours: true },
      })
    : [];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">İşletme Bilgileri</h1>
      <p className="mt-2 text-ink/60">
        {isChain
          ? "Genel marka bilgileri ve her şube için iletişim bilgilerini düzenleyin. İşletme adı dışında hepsi opsiyoneldir."
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
        />
      </div>

      {isChain && (
        <div className="mt-12">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-dark">
            Şube bilgileri
          </h2>
          <p className="mb-4 text-sm text-ink/60">
            Her şubenin kendi telefon, adres ve çalışma saatleri olabilir.
          </p>
          <div className="space-y-4">
            {branches.map((b) => (
              <BranchContactForm
                key={b.id}
                menuId={b.id}
                branchName={b.name}
                phone={b.phone ?? ""}
                address={b.address ?? ""}
                openingHours={b.openingHours ?? ""}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
