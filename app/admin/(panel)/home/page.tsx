import { getHomeSections } from "@/lib/queries/home";
import HomeEditor from "@/components/admin/HomeEditor";

export default async function AdminHomePage() {
  const sections = await getHomeSections();
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Anasayfa</h1>
      <p className="mt-2 text-ink/60">
        Anasayfanın bölümlerini buradan düzenleyin. Bölüm ekleyin, sıralayın,
        gizleyin. Fiyatlar bölümünün içeriği ayrı <strong>Fiyatlandırma</strong> sayfasından yönetilir.
      </p>
      <div className="mt-8">
        <HomeEditor initial={sections} />
      </div>
    </div>
  );
}
