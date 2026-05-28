"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* kullanıcı iptal etti */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* yoksay */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Paylaş"
      className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-menu-border text-menu-text transition-colors hover:border-menu-gold/50 hover:text-menu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-menu-gold/50"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      {copied && (
        <span className="absolute -bottom-7 right-0 whitespace-nowrap rounded-md bg-menu-surface-2 px-2 py-1 text-[10px] text-menu-text">
          Bağlantı kopyalandı
        </span>
      )}
    </button>
  );
}
