"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Mevcut menümü nasıl aktarırım?",
    a: "Ürünlerinizi tek tek ekleyebilir veya Excel/CSV dosyanızı içe aktararak menünüzü dakikalar içinde oluşturabilirsiniz. Sürükle-bırak editörle kategori ve sıralamayı kolayca düzenlersiniz.",
  },
  {
    q: "AR ve videolu ürün nasıl çalışıyor?",
    a: "Ürüne bir tanıtım videosu veya 3D model (GLB/USDZ) yüklersiniz. Müşteri menüde ürünü 360° döndürebilir, mobil cihazda 'AR'da gör' ile ürünü kendi masasına yerleştirebilir — ek uygulama gerekmez.",
  },
  {
    q: "Kurulum ne kadar sürer?",
    a: "Hesabınızı oluşturup menünüzü ekledikten sonra QR kodunuz anında hazır olur. Tipik kurulum 15 dakikadan kısa sürer.",
  },
  {
    q: "Müşterilerim uygulama indirmek zorunda mı?",
    a: "Hayır. Menü doğrudan tarayıcıda açılır (PWA). Müşteriler QR'ı okutur, menü anında yüklenir; isterlerse ana ekranlarına ekleyebilir.",
  },
  {
    q: "Çok dilli menü ve alerjen filtresi var mı?",
    a: "Evet. 10 dile kadar menü sunabilir, 14 AB alerjen kategorisine göre otomatik filtreleme sağlayabilirsiniz. KVKK/GDPR uyumlu veri yaklaşımı kullanılır.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-5 py-5 text-left transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-inset"
            >
              <span className="text-base font-semibold text-ink">{faq.q}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`shrink-0 text-ink/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className={`grid px-5 transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="min-h-0 overflow-hidden text-sm leading-relaxed text-ink/70">
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
