import { prisma } from "@/lib/prisma";
import UiStringsManager, { type UiLang } from "@/components/admin/UiStringsManager";

export default async function AdminUiStringsPage() {
  const [langs, rows] = await Promise.all([
    prisma.language.findMany({ where: { enabled: true }, orderBy: { sortOrder: "asc" } }),
    prisma.uiTranslation.findMany(),
  ]);

  // tr (kaynak düzenleme) + açık diller
  const languages: UiLang[] = [
    { code: "tr", label: "Türkçe (kaynak)" },
    ...langs.map((l) => ({ code: l.code, label: l.label })),
  ];

  const initial: Record<string, Record<string, string>> = {};
  for (const r of rows) {
    (initial[r.lang] ??= {})[r.key] = r.value;
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Arayüz Metinleri</h1>
      <p className="mt-2 text-ink/60">
        Müşteri menüsündeki sabit etiketlerin (Şefin Seçimi, arama kutusu,
        “Masamda Görüntüle” vb.) çevirilerini buradan girin.
      </p>
      <div className="mt-8">
        <UiStringsManager languages={languages} initial={initial} />
      </div>
    </div>
  );
}
