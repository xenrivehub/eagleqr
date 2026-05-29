"use client";

import { useState, type FormEvent } from "react";
import type { CategoryView } from "./types";
import { createCategory, updateCategory } from "@/lib/actions/menu";

export default function CategoryForm({
  menuId,
  category,
  onDone,
}: {
  menuId: string;
  category?: CategoryView;
  onDone: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const name = String(new FormData(e.currentTarget).get("name") ?? "");

    setPending(true);
    const result = category
      ? await updateCategory(category.id, name)
      : await createCategory(menuId, name);
    if (!result.success) {
      setError(result.error);
      setPending(false);
      return;
    }
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-ink">
          Kategori adı <span className="text-red-600">*</span>
        </label>
        <input
          id="c-name"
          name="name"
          required
          defaultValue={category?.name}
          placeholder="Örn. Sıcak İçecekler"
          className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onDone} className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink/5">
          Vazgeç
        </button>
        <button type="submit" disabled={pending} className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Kaydediliyor…" : category ? "Güncelle" : "Ekle"}
        </button>
      </div>
    </form>
  );
}
