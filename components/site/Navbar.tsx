"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { NavLink as NavItemLink } from "@/lib/queries/navbar";
import NavIcon from "./NavIcon";

// NavItem yapılandırılmamışsa gösterilecek varsayılan menü
const FALLBACK: NavItemLink[] = [
  { href: "#nasil-calisir", label: "Nasıl Çalışır", description: null, icon: null, children: [] },
  { href: "#ozellikler", label: "Özellikler", description: null, icon: null, children: [] },
  { href: "#fiyatlandirma", label: "Fiyatlandırma", description: null, icon: null, children: [] },
  { href: "#sss", label: "SSS", description: null, icon: null, children: [] },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream";
const linkCls = `rounded text-sm font-medium text-ink/70 transition-colors hover:text-ink ${focusRing}`;

function isExternal(href: string) {
  return href.startsWith("#") || href.startsWith("http");
}

function PlainLink({ href, label, onClick, className }: { href: string; label: string; onClick?: () => void; className?: string }) {
  if (isExternal(href)) return <a href={href} onClick={onClick} className={className}>{label}</a>;
  return <Link href={href} onClick={onClick} className={className}>{label}</Link>;
}

// İkon + başlık + açıklama satırı (dropdown / mobil)
function RichLink({ href, label, description, icon, onClick }: { href: string; label: string; description: string | null; icon: string | null; onClick?: () => void }) {
  const inner = (
    <span className="flex items-start gap-3">
      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${icon ? "bg-brand-soft text-brand-dark" : ""}`}>
        <NavIcon name={icon} size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-snug text-ink/55">{description}</span>}
      </span>
    </span>
  );
  const cls = "block rounded-xl p-2.5 transition-colors hover:bg-brand-soft/50";
  return isExternal(href) ? (
    <a href={href} onClick={onClick} className={cls}>{inner}</a>
  ) : (
    <Link href={href} onClick={onClick} className={cls}>{inner}</Link>
  );
}

export default function Navbar({ items }: { items?: NavItemLink[] }) {
  const [open, setOpen] = useState(false);
  const links = items && items.length > 0 ? items : FALLBACK;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className={`flex items-center gap-2 rounded-lg ${focusRing}`}>
          <Image src="/eagle-logo.webp" alt="Eagle QR" width={32} height={32} className="h-8 w-8 object-contain" priority />
          <span className="font-display text-lg font-bold tracking-tight text-ink">Eagle QR</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((item) =>
            item.children.length > 0 ? (
              <div key={item.label} className="group relative">
                <button type="button" className={`flex items-center gap-1 ${linkCls}`}>
                  {item.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform group-hover:rotate-180">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="w-[min(92vw,540px)] rounded-2xl border border-ink/10 bg-white p-3 shadow-xl">
                    {item.description && (
                      <p className="px-2.5 pb-2 text-xs font-semibold uppercase tracking-wider text-ink/40">{item.description}</p>
                    )}
                    <div className={`grid gap-1 ${item.children.length > 4 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
                      {item.children.map((ch) => (
                        <RichLink key={ch.label} href={ch.href} label={ch.label} description={ch.description} icon={ch.icon} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : item.href ? (
              <PlainLink key={item.label} href={item.href} label={item.label} className={linkCls} />
            ) : null,
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className={`rounded-full px-4 py-2 text-sm font-semibold text-ink transition-all hover:bg-ink/5 active:scale-95 ${focusRing}`}>İşletme Girişi</Link>
          <Link href="/register" className={`rounded-full bg-brand px-4 py-2 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 ${focusRing}`}>Ücretsiz Dene</Link>
        </div>

        <button type="button" aria-label="Menüyü aç/kapat" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-ink md:hidden ${focusRing}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="max-h-[80dvh] overflow-y-auto border-t border-ink/5 bg-cream px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <PlainLink href={item.href} label={item.label} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-ink/5" />
                ) : (
                  <span className="block px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-ink/40">{item.label}</span>
                )}
                {item.children.length > 0 && (
                  <div className="ml-1 flex flex-col gap-0.5 border-l border-ink/10 pl-1">
                    {item.children.map((ch) => (
                      <RichLink key={ch.label} href={ch.href} label={ch.label} description={ch.description} icon={ch.icon} onClick={() => setOpen(false)} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border border-ink/15 px-4 py-2 text-center text-sm font-semibold text-ink">İşletme Girişi</Link>
            <Link href="/register" onClick={() => setOpen(false)} className="rounded-full bg-brand px-4 py-2 text-center text-sm font-semibold text-ink">Ücretsiz Dene</Link>
          </div>
        </div>
      )}
    </header>
  );
}
