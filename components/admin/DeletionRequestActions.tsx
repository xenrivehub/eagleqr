"use client";

import { useState, useTransition } from "react";
import { approveAccountDeletion, rejectAccountDeletion } from "@/lib/actions/admin";

export default function DeletionRequestActions({
  requestId,
  businessName,
}: {
  requestId: string;
  businessName: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function approve() {
    if (!window.confirm(`"${businessName}" işletmesi ve TÜM verileri (menü, ürünler, görseller) kalıcı olarak silinecek. Onaylıyor musun?`)) return;
    setError(null);
    startTransition(async () => {
      const res = await approveAccountDeletion(requestId);
      if (!res.success) setError(res.error);
    });
  }

  function reject() {
    setError(null);
    startTransition(async () => {
      const res = await rejectAccountDeletion(requestId);
      if (!res.success) setError(res.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={reject}
          disabled={pending}
          className="cursor-pointer rounded-lg border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5 disabled:opacity-50"
        >
          Reddet
        </button>
        <button
          type="button"
          onClick={approve}
          disabled={pending}
          className="cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Sil (onayla)
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
