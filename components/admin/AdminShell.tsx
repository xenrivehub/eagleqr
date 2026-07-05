"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const nav = [
  { href: "/admin", label: "Genel Bakış", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/businesses", label: "İşletmeler", icon: "M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" },
  { href: "/admin/plans", label: "Plan Limitleri", icon: "M3 3v18h18M7 14l3-3 3 3 5-5" },
  { href: "/admin/languages", label: "Diller & Çeviri", icon: "M3 5h12M9 3v2m1.5 14 4-9 4 9M12.5 17h4M5 8c0 2 1.5 4.5 4 6M3 12c2.5 0 5-1.2 6-4" },
  { href: "/admin/currencies", label: "Para Birimleri", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { href: "/admin/ui-strings", label: "Arayüz Metinleri", icon: "M4 7V4h16v3M9 20h6M12 4v16" },
  { href: "/admin/campaigns", label: "Kampanya Etiketleri", icon: "M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" },
  { href: "/admin/seo", label: "SEO Ayarları", icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5" },
  { href: "/admin/home", label: "Anasayfa", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/pricing", label: "Fiyatlandırma", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
  { href: "/admin/pages", label: "Sayfalar", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8M8 9h2" },
  { href: "/admin/navbar", label: "Navbar", icon: "M3 5h18M3 12h18M3 19h18" },
  { href: "/admin/logs", label: "Denetim Kaydı", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 7h6m-6 4h4" },
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
          <Image src="/eagle-logo.webp" alt="Eagle Menu" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="font-display text-lg font-bold text-ink">Eagle Menu</span>
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
          <Image src="/eagle-logo.webp" alt="Eagle Menu" width={26} height={26} className="h-6 w-6 object-contain" />
          <span className="font-display text-base font-bold text-ink">Eagle Menu</span>
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
