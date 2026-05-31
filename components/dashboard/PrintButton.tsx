"use client";

export default function PrintButton() {
  return (
    <div className="no-print fixed right-4 top-4 z-50 flex gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="cursor-pointer rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream shadow-lg transition-transform hover:scale-105"
      >
        ↓ PDF olarak kaydet / Yazdır
      </button>
      <button
        type="button"
        onClick={() => window.close()}
        className="cursor-pointer rounded-full border border-ink/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-ink/5"
      >
        Kapat
      </button>
    </div>
  );
}
