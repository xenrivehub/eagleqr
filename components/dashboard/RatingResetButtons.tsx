"use client";

import { useState, useTransition } from "react";
import { resetProductRatings, resetAllRatings } from "@/lib/actions/ratings-admin";

export function ResetProductButton({ productId, name }: { productId: string; name: string }) {
  const [pending, start] = useTransition();
  function run() {
    if (!window.confirm(`"${name}" ürününün tüm puanları sıfırlanacak. Emin misin?`)) return;
    start(async () => {
      await resetProductRatings(productId);
    });
  }
  return (
    <button
      type="button"
      onClick={run}
      disabled={pending}
      className="cursor-pointer rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
    >
      Sıfırla
    </button>
  );
}

export function ResetAllButton() {
  const [pending, start] = useTransition();
  function run() {
    if (!window.confirm("TÜM ürünlerin puanları sıfırlanacak. Bu işlem geri alınamaz. Emin misin?")) return;
    start(async () => {
      await resetAllRatings();
    });
  }
  return (
    <button
      type="button"
      onClick={run}
      disabled={pending}
      className="cursor-pointer rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
    >
      Tümünü sıfırla
    </button>
  );
}
