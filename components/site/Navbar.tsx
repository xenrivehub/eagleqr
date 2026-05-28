"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#nasil-calisir", label: "Nasıl Çalışır" },
  { href: "#ozellikler", label: "Özellikler" },
  { href: "#fiyatlandirma", label: "Fiyatlandırma" },
  { href: "#sss", label: "SSS" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className={`flex items-center gap-2 rounded-lg ${focusRing}`}
        >
          <Image
            src="/eagle-logo.webp"
            alt="Eagle QR"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Eagle QR
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded text-sm font-medium text-ink/70 transition-colors hover:text-ink ${focusRing}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={`rounded-full px-4 py-2 text-sm font-semibold text-ink transition-all hover:bg-ink/5 active:scale-95 ${focusRing}`}
          >
            İşletme Girişi
          </Link>
          <Link
            href="/register"
            className={`rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 ${focusRing}`}
          >
            Ücretsiz Dene
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menüyü aç/kapat"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-ink md:hidden ${focusRing}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/5 bg-cream px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-ink/5"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full border border-ink/15 px-4 py-2 text-center text-sm font-semibold text-ink"
            >
              İşletme Girişi
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="rounded-full bg-brand px-4 py-2 text-center text-sm font-semibold text-ink"
            >
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
