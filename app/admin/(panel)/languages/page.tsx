import { prisma } from "@/lib/prisma";
import LanguageManager, { type LanguageRow } from "@/components/admin/LanguageManager";

export default async function AdminLanguagesPage() {
  const [languages, modelSetting] = await Promise.all([
    prisma.language.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.appSetting.findUnique({ where: { key: "translation_model" } }),
  ]);

  const rows: LanguageRow[] = languages.map((l) => ({
    code: l.code,
    label: l.label,
    nativeLabel: l.nativeLabel,
    rtl: l.rtl,
    enabled: l.enabled,
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Diller & Çeviri</h1>
      <p className="mt-2 text-ink/60">
        Platform dillerini ve menü çevirisinde kullanılacak yapay zeka modelini
        yönetin. İşletmeler, açık dillere kendi menülerini çevirebilir.
      </p>
      <div className="mt-8">
        <LanguageManager model={modelSetting?.value ?? ""} languages={rows} />
      </div>
    </div>
  );
}
