import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import BusinessInfoForm from "@/components/dashboard/BusinessInfoForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { id: session.user.businessId },
    select: {
      name: true,
      logoUrl: true,
      phone: true,
      contactEmail: true,
      address: true,
      about: true,
      openingHours: true,
    },
  });
  if (!business) redirect("/login");

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">İşletme Bilgileri</h1>
      <p className="mt-2 text-ink/60">
        İşletmenizin iletişim ve tanıtım bilgilerini düzenleyin. İşletme adı
        dışında hepsi opsiyoneldir.
      </p>
      <div className="mt-8">
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
    </div>
  );
}
