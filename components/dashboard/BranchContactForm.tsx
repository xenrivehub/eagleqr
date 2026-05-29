"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateBranchContact } from "@/lib/actions/business";

const inputBase =
  "w-full rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark";

export default function BranchContactForm({
  menuId,
  branchName,
  phone,
  address,
  openingHours,
}: {
  menuId: string;
  branchName: string;
  phone: string;
  address: string;
  openingHours: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("saving");
    const res = await updateBranchContact(menuId, {
      phone: String(f.get("phone") ?? ""),
      address: String(f.get("address") ?? ""),
      openingHours: String(f.get("openingHours") ?? ""),
    });
    if (res.success) {
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-ink/10 bg-white p-5">
      <h3 className="font-display text-base font-semibold text-ink">{branchName}</h3>
      <p className="mt-0.5 text-xs text-ink/50">
        Boş bırakılırsa işletme geneli kullanılır.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/70">Telefon</label>
          <input name="phone" defaultValue={phone} placeholder="0212 …" className={inputBase} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-ink/70">Adres</label>
          <input name="address" defaultValue={address} placeholder="Şube adresi" className={inputBase} />
        </div>
        <div className="sm:col-span-3">
          <label className="mb-1 block text-xs font-medium text-ink/70">Açık saatler</label>
          <input name="openingHours" defaultValue={openingHours} placeholder="Her gün 08:00 - 23:00" className={inputBase} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button type="submit" disabled={status === "saving"} className="cursor-pointer rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-ink-soft disabled:opacity-60">
          {status === "saving" ? "Kaydediliyor…" : "Şubeyi kaydet"}
        </button>
        {status === "saved" && <span className="text-sm text-emerald-600">Kaydedildi ✓</span>}
      </div>
    </form>
  );
}
