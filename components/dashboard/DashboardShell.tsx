"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const nav = [
  {
    href: "/dashboard",
    label: "Genel Bakış",
    icon: "M3 12l9-9 9 9M5 10v10h14V10",
  },
  {
    href: "/dashboard/menu",
    label: "Menü",
    icon: "M4 6h16M4 12h16M4 18h10",
  },
  {
    href: "/dashboard/storefront",
    label: "Vitrin",
    icon: "M3 9l1.5-5h15L21 9M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M3 9h18M9 13h6",
  },
  {
    href: "/dashboard/tema",
    label: "Tema",
    icon: "M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1 .8-1.5 1.8-1.5H17a5 5 0 0 0 5-5c0-5-4.5-8-10-8zM6.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM9.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM14.5 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z",
  },
  {
    href: "/dashboard/qr",
    label: "QR Kod",
    icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM20 14v7M17 20h4",
  },
  {
    href: "/dashboard/analytics",
    label: "Analitik",
    icon: "M3 3v18h18M7 14l4-4 3 3 5-6",
  },
  {
    href: "/dashboard/ratings",
    label: "Puanlar",
    icon: "M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8z",
  },
  {
    href: "/dashboard/settings",
    label: "Ayarlar",
    icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  },
  {
    href: "/dashboard/account",
    label: "Hesap",
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
];

const PLAN_LABEL: Record<string, string> = { STANDART: "Standart", PRO: "Pro", MAX: "Max" };

function PlanBadge({ plan }: { plan: string }) {
  return (
    <div className="mx-2 mb-4 rounded-xl border border-ink/10 bg-cream/60 px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-ink/50">Plan</span>
        <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cream">
          {PLAN_LABEL[plan] ?? plan}
        </span>
      </div>
      {plan !== "MAX" && (
        <Link href="/#fiyat" className="mt-1.5 block text-xs font-semibold text-brand-dark hover:underline">
          Planı yükselt →
        </Link>
      )}
    </div>
  );
}

export default function DashboardShell({
  businessName,
  plan,
  signOutAction,
  branchSwitcher,
  children,
}: {
  businessName: string;
  plan: string;
  signOutAction: () => Promise<void>;
  branchSwitcher?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

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
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-ink/10 bg-white p-4 md:flex md:flex-col">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-2">
          <Image src="/eagle-logo.webp" alt="Eagle Menu" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="font-display text-lg font-bold text-ink">Eagle Menu</span>
        </Link>
        <div className="mt-2 px-2 pb-4">
          <p className="truncate text-xs text-ink/50">{businessName}</p>
        </div>
        <PlanBadge plan={plan} />
        {branchSwitcher && <div className="mb-4">{branchSwitcher}</div>}
        {navList}
        <form action={signOutAction} className="mt-auto pt-4">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-xl border border-ink/15 px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Çıkış Yap
          </button>
        </form>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/eagle-logo.webp" alt="Eagle Menu" width={26} height={26} className="h-6 w-6 object-contain" />
          <span className="font-display text-base font-bold text-ink">Eagle Menu</span>
        </Link>
        <button
          type="button"
          aria-label="Menü"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </header>

      {open && (
        <div className="border-b border-ink/10 bg-white px-4 py-3 md:hidden">
          <PlanBadge plan={plan} />
          {branchSwitcher && <div className="mb-3">{branchSwitcher}</div>}
          {navList}
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-xl border border-ink/15 px-3 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5"
            >
              Çıkış Yap
            </button>
          </form>
        </div>
      )}

      <main className="flex-1 bg-cream">{children}</main>
    </div>
  );
}
