import { getPricingConfig } from "@/lib/queries/home";
import PricingEditor from "@/components/admin/PricingEditor";

export default async function AdminPricingPage() {
  const config = await getPricingConfig();
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Fiyatlandırma</h1>
      <p className="mt-2 text-ink/60">
        Anasayfadaki fiyat kartlarını buradan düzenleyin: plan adları, aylık/yıllık
        fiyatlar, özellik listeleri ve rozetler.
      </p>
      <div className="mt-8">
        <PricingEditor initial={config} />
      </div>
    </div>
  );
}
