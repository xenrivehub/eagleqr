"use client";

import { useState, useTransition } from "react";
import { requestAccountDeletion, cancelAccountDeletion } from "@/lib/actions/account";

export default function DeleteAccountSection({ hasPending }: { hasPending: boolean }) {
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!window.confirm("Hesap silme talebi göndermek istediğine emin misin? Yönetici onayından sonra tüm verilerin (menü, ürünler, görseller) kalıcı silinir.")) return;
    setError(null);
    startTransition(async () => {
      const res = await requestAccountDeletion(reason);
      if (!res.success) setError(res.error);
    });
  }

  function cancel() {
    setError(null);
    startTransition(async () => {
      const res = await cancelAccountDeletion();
      if (!res.success) setError(res.error);
    });
  }

  if (hasPending) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-900">
        <p className="font-semibold">Silme talebin alındı.</p>
        <p className="mt-1 text-amber-800">Yönetici onayı bekleniyor. Onaylanana kadar hesabın aktif kalır.</p>
        <button
          type="button"
          onClick={cancel}
          disabled={pending}
          className="mt-3 cursor-pointer rounded-lg border border-amber-400 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
        >
          Talebi geri çek
        </button>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-ink/60">
        Hesabını silmek istersen talep gönderebilirsin. Talep <strong>yönetici onayından sonra</strong> uygulanır;
        onaylandığında işletmen ve tüm verilerin (menü, ürünler, görseller) kalıcı olarak silinir.
      </p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="Gerekçe (opsiyonel)"
        className="w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      />
      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="mt-3 cursor-pointer rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
      >
        Hesabımı silmeyi talep et
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
