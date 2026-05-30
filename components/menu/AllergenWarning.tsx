"use client";

import { useAllergenFilter } from "@/lib/use-allergen-filter";
import { useMenuLang } from "@/lib/use-menu-lang";
import { allergenLabel } from "@/lib/allergen-i18n";

// Ürün detayında: müşterinin kaçındığı alerjenlerden birini içeriyorsa uyarı şeridi.
export default function AllergenWarning({
  allergens,
  intro,
}: {
  allergens: { code: string; label: string }[];
  intro: string;
}) {
  const { selected, ready } = useAllergenFilter();
  const { lang } = useMenuLang();
  if (!ready || selected.length === 0) return null;

  const hit = allergens
    .filter((a) => selected.includes(a.code))
    .map((a) => ({ code: a.code, label: allergenLabel(a.code, lang, a.label) }));
  if (hit.length === 0) return null;

  return (
    <div
      role="alert"
      className="mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
      style={{
        color: "#e0524a",
        background: "rgba(224,82,74,0.12)",
        borderColor: "rgba(224,82,74,0.34)",
      }}
    >
      <span aria-hidden className="text-base leading-none">⚠</span>
      <p>
        {intro}{" "}
        <strong>{hit.map((h) => h.label).join(", ")}</strong>.
      </p>
    </div>
  );
}
