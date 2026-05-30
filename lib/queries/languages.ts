import { prisma } from "@/lib/prisma";

export type AppLanguage = {
  code: string;
  label: string;
  nativeLabel: string;
  rtl: boolean;
};

/** Açık (enabled) platform dilleri, sıraya göre. */
export async function getEnabledLanguages(): Promise<AppLanguage[]> {
  const langs = await prisma.language.findMany({
    where: { enabled: true },
    orderBy: { sortOrder: "asc" },
    select: { code: true, label: true, nativeLabel: true, rtl: true },
  });
  return langs;
}
