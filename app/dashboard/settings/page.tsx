import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getActiveBranch } from "@/lib/branch-context";
import { getEnabledCurrencies, getCurrencySpec } from "@/lib/queries/currencies";
import { THEMES, isThemeUnlocked, getTheme } from "@/lib/themes";
import { parseHours } from "@/lib/opening-hours";
import BusinessInfoForm from "@/components/dashboard/BusinessInfoForm";
import BranchSettingsForm from "@/components/dashboard/BranchSettingsForm";
import BrandSettingsForm from "@/components/dashboard/BrandSettingsForm";
import MenuExtrasForm from "@/components/dashboard/MenuExtrasForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");
  const businessId = session.user.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      name: true, type: true, logoUrl: true, phone: true, contactEmail: true,
      address: true, about: true, openingHours: true, currency: true,
      ratingsEnabled: true, mapUrl: true, socialLinks: true,
      maintenanceMode: true, maintenanceMessage: true, themeKey: true, allowedThemes: true,
      wifiSsid: true, wifiPassword: true, wifiShow: true, openingHoursJson: true,
    },
  });
  if (!business) redirect("/login");

  const extrasProps = {
    wifiSsid: business.wifiSsid ?? "",
    wifiPassword: business.wifiPassword ?? "",
    wifiShow: business.wifiShow,
    hours: parseHours(business.openingHoursJson),
  };

  const currencies = await getEnabledCurrencies();
  if (!currencies.some((c) => c.code === business.currency)) {
    currencies.unshift(await getCurrencySpec(business.currency));
  }

  // ----- TEKİL İŞLETME: tek form (önceki davranış) -----
  if (business.type !== "CHAIN") {
    return (
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-2xl font-bold text-ink">İşletme Bilgileri</h1>
        <p className="mt-2 text-ink/60">İşletmenizin iletişim ve tanıtım bilgilerini düzenleyin. İşletme adı dışında hepsi opsiyoneldir.</p>
        <div className="mt-8">
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
            maintenanceMode={business.maintenanceMode}
            maintenanceMessage={business.maintenanceMessage ?? ""}
          />
        </div>

        <div className="mt-10 border-t border-ink/10 pt-8">
          <h2 className="font-display text-xl font-bold text-ink">Menü ekstraları</h2>
          <p className="mb-6 mt-1 text-sm text-ink/60">WiFi bilgisi ve çalışma saatleri — müşteri menüsünde gösterilir.</p>
          <MenuExtrasForm {...extrasProps} />
        </div>
      </div>
    );
  }

  // ----- ZİNCİR: aktif şube ayarları + marka geneli -----
  const { active } = await getActiveBranch(businessId);
  const branch = active
    ? await prisma.menu.findUnique({
        where: { id: active.id },
        select: {
          id: true, name: true, logoUrl: true, phone: true, contactEmail: true,
          address: true, openingHours: true, mapUrl: true, socialLinks: true,
          currency: true, themeKey: true, maintenanceMode: true, maintenanceMessage: true,
        },
      })
    : null;

  const unlockedThemes = THEMES.filter((t) => isThemeUnlocked(t.key, business.allowedThemes)).map((t) => ({ key: t.key, name: t.name }));
  const brandThemeName = getTheme(business.themeKey).name;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Ayarlar</h1>

      {!branch ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">Henüz şube yok</p>
          <Link href="/dashboard/branches" className="mt-4 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-brand-dark">+ Şube ekle</Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-brand/30 bg-brand-soft/40 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">Şube ayarları</p>
              <p className="font-display text-lg font-bold text-ink">{branch.name}</p>
            </div>
            <p className="ml-auto text-sm text-ink/60">Başka şube için sol menüden şube değiştirin.</p>
          </div>
          <p className="mt-3 text-sm text-ink/60">
            Bu şubeye özel bilgiler. Tema/para birimi/logo boş bırakılırsa marka geneli kullanılır.
          </p>

          <div className="mt-6">
            <BranchSettingsForm
              menuId={branch.id}
              logoUrl={branch.logoUrl}
              phone={branch.phone ?? ""}
              contactEmail={branch.contactEmail ?? ""}
              address={branch.address ?? ""}
              openingHours={branch.openingHours ?? ""}
              mapUrl={branch.mapUrl ?? ""}
              social={(branch.socialLinks as Record<string, string>) ?? {}}
              currency={branch.currency ?? ""}
              themeKey={branch.themeKey ?? ""}
              maintenanceMode={branch.maintenanceMode}
              maintenanceMessage={branch.maintenanceMessage ?? ""}
              currencies={currencies}
              themes={unlockedThemes}
              brandCurrency={business.currency}
              brandThemeName={brandThemeName}
            />
          </div>

          <div className="mt-12 border-t border-ink/10 pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-dark">Marka geneli · tüm şubeler</h2>
            <p className="mb-4 mt-1 text-sm text-ink/60">Bu ayarlar tüm şubelerde geçerlidir.</p>
            <BrandSettingsForm
              name={business.name}
              logoUrl={business.logoUrl}
              ratingsEnabled={business.ratingsEnabled}
              about={business.about ?? ""}
            />
          </div>

          <div className="mt-10 border-t border-ink/10 pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-dark">Menü ekstraları · marka geneli</h2>
            <p className="mb-6 mt-1 text-sm text-ink/60">WiFi bilgisi ve çalışma saatleri — tüm şubelerde müşteri menüsünde gösterilir.</p>
            <MenuExtrasForm {...extrasProps} />
          </div>
        </>
      )}
    </div>
  );
}
