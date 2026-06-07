import { getSeoSettings } from "@/lib/queries/seo";
import SeoSettingsForm from "@/components/admin/SeoSettingsForm";

export default async function AdminSeoPage() {
  const seo = await getSeoSettings();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">SEO Ayarları</h1>
      <p className="mt-2 text-ink/60">
        Tüm işletmelerin müşteri menüsü için ortak arama motoru başlık, açıklama
        ve anahtar kelime şablonları. Bir kez ayarlayın; her işletmeye uygulanır.
        <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5 text-xs">{"{business}"}</code>
        yer tutucusu işletme adıyla değişir (her sayfa benzersiz kalır).
      </p>
      <div className="mt-8">
        <SeoSettingsForm initial={seo} />
      </div>
    </div>
  );
}
