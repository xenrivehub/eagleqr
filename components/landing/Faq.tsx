"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };

export default function Faq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-ink/8 rounded-3xl border border-ink/8 bg-white shadow-sm">
      {items.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-6 py-5 text-left transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-inset"
            >
              <span className="font-display text-base font-bold text-ink">{faq.q}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`shrink-0 text-ink/40 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`} aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <div className={`grid px-6 transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <p className="min-h-0 overflow-hidden text-sm leading-relaxed text-ink/70">{faq.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
