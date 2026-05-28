"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const nav = [
  { href: "/admin", label: "Genel Bakış", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/businesses", label: "İşletmeler", icon: "M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" },
];

export default function AdminShell({
  email,
  signOutAction,
  children,
}: {
  email: string;
  signOutAction: () => Promise<void>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const navList = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive(item.href)
              ? "bg-brand-soft text-ink"
              : "text-ink/60 hover:bg-ink/5 hover:text-ink"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={item.icon} />
          </svg>
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <aside className="hidden w-64 shrink-0 border-r border-ink/10 bg-white p-4 md:flex md:flex-col">
        <div className="flex items-center gap-2 px-2 py-2">
          <Image src="/eagle-logo.webp" alt="Eagle QR" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="font-display text-lg font-bold text-ink">Eagle QR</span>
        </div>
        <div className="mt-2 px-2 pb-4">
          <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cream">
            Admin
          </span>
        </div>
        {navList}
        <form action={signOutAction} className="mt-auto pt-4">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-ink/15 px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
          >
            Çıkış Yap
          </button>
        </form>
      </aside>

      <header className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <Image src="/eagle-logo.webp" alt="Eagle QR" width={26} height={26} className="h-6 w-6 object-contain" />
          <span className="font-display text-base font-bold text-ink">Eagle QR</span>
          <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase text-cream">Admin</span>
        </div>
        <button
          type="button"
          aria-label="Menü"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-ink"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </header>

      {open && (
        <div className="border-b border-ink/10 bg-white px-4 py-3 md:hidden">
          {navList}
          <form action={signOutAction} className="mt-3">
            <button type="submit" className="w-full cursor-pointer rounded-xl border border-ink/15 px-3 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5">
              Çıkış Yap
            </button>
          </form>
        </div>
      )}

      <main className="flex-1 bg-cream">{children}</main>
    </div>
  );
}
