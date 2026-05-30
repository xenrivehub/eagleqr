"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setActiveBranch } from "@/lib/actions/business";

export type SwitcherBranch = { id: string; name: string };

export default function BranchSwitcher({
  branches,
  activeId,
}: {
  branches: SwitcherBranch[];
  activeId: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const active = branches.find((b) => b.id === activeId) ?? null;

  async function select(id: string) {
    setOpen(false);
    if (id === activeId) return;
    setPending(true);
    await setActiveBranch(id);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <span className="mb-1 block px-2 text-[10px] font-semibold uppercase tracking-wider text-ink/40">
        Aktif şube
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-ink/15 bg-cream px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors hover:bg-ink/5 disabled:opacity-60"
      >
        <span className="flex items-center gap-2 truncate">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-dark" aria-hidden>
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
          </svg>
          <span className="truncate">{active?.name ?? "Şube seçin"}</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 text-ink/40 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-ink/15 bg-white shadow-lg">
            <div className="max-h-64 overflow-y-auto py-1">
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => select(b.id)}
                  className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-cream ${
                    b.id === activeId ? "font-semibold text-ink" : "text-ink/70"
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  {b.id === activeId && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-dark" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <Link
              href="/dashboard/branches"
              onClick={() => setOpen(false)}
              className="block border-t border-ink/10 px-3 py-2.5 text-sm font-semibold text-brand-dark hover:bg-cream"
            >
              + Şubeleri yönet
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
