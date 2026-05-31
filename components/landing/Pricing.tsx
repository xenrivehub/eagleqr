"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

type Tier = {
  name: string;
  tagline: string;
  monthly: number;
  yearlyMonthly: number;
  yearlyTotal: number;
  features: string[];
  featured: boolean;
  highlight?: string;
};

const tiers: Tier[] = [
  {
    name: "Standart",
    tagline: "Temel ve şık — bütçe odaklı küçük işletmeler ve kafeler için.",
    monthly: 399,
    yearlyMonthly: 299,
    yearlyTotal: 3588,
    features: [
      "Sınırsız kategori ve ürün",
      "2 ücretsiz tema (Mineral & Maison)",
      "Gelişmiş QR oluşturucu (renk, çerçeve, logo)",
      "Akıllı alerjen filtresi",
      "Anonim yıldız puanlaması",
      "Temel analitik (tarama & görüntüleme)",
      "Tek tıkla 'Tükendi' & anlık fiyat değişimi",
    ],
    featured: false,
  },
  {
    name: "Pro",
    tagline: "Büyüyen ve akıllı işletmeler — video ve AI gücüyle satışı katlayın.",
    monthly: 899,
    yearlyMonthly: 699,
    yearlyTotal: 8388,
    features: [
      "Standart'taki her şey",
      "Video menü desteği (sessiz, otomatik döngü)",
      "AI açıklama yazımı & 'Yanında iyi gider' önerisi",
      "Tek tıkla AI çevirisi (RTL + dil seçici)",
      "+1 premium tema & gelişmiş stiller",
      "Akıllı kampanya & servis saatleri (Happy Hour)",
      "Gelişmiş analitik (ısı haritası, ilgi oranı)",
      "Toplu fiyat yönetimi (zam / indirim)",
    ],
    featured: true,
  },
  {
    name: "Max",
    tagline: "Premium ve deneyim odaklı — sosyal medyada fark yaratan mekanlar için.",
    monthly: 2499,
    yearlyMonthly: 1899,
    yearlyTotal: 22788,
    features: [
      "Pro'daki her şey",
      "'Masamda Görüntüle' — web tabanlı AR",
      "Tüm premium temalara sınırsız erişim (11 tema)",
      "Gelişmiş zincir & şube yönetimi (içerik kopyalama)",
      "Zarif PDF menü çıktısı (baskıya hazır A4)",
      "Maksimum medya kotası (3D / video / HD görsel)",
      "Öncelikli destek & VIP kurulum",
    ],
    featured: false,
    highlight: "Lansmana özel: İlk 5 Hero ürünün 3D modellemesi + AR çekimi hediye!",
  },
];

const tr = (n: number) => n.toLocaleString("tr-TR");

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Gift({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      <path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5zM12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <>
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
          Fiyatlandırma
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          İşletmenize uygun paketi seçin
        </h2>
        <p className="mt-3 text-ink/60">
          Tüm paketlerde kurulum ücretsiz. İstediğiniz zaman yükseltin — sözleşme,
          komisyon, gizli ücret yok.
        </p>

        {/* Aylık / Yıllık geçişi */}
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white p-1 shadow-sm" role="group" aria-label="Faturalandırma dönemi">
          <button
            type="button"
            onClick={() => setYearly(false)}
            aria-pressed={!yearly}
            className={`min-h-[44px] rounded-full px-5 py-2 text-sm font-semibold transition-all ${focusRing} ${
              !yearly ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"
            }`}
          >
            Aylık
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            aria-pressed={yearly}
            className={`relative min-h-[44px] rounded-full px-5 py-2 text-sm font-semibold transition-all ${focusRing} ${
              yearly ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"
            }`}
          >
            Yıllık
            <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-ink">
              %25 indirim
            </span>
          </button>
        </div>
      </Reveal>

      <div className="mt-12 grid items-start gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => {
          const price = yearly ? tier.yearlyMonthly : tier.monthly;
          return (
            <Reveal key={tier.name} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  tier.featured
                    ? "border-transparent bg-ink text-cream shadow-xl md:-translate-y-2"
                    : "border-ink/10 bg-white text-ink"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-xs font-bold text-ink">
                    En Popüler
                  </span>
                )}

                <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
                <p className={`mt-1 text-sm leading-relaxed ${tier.featured ? "text-cream/70" : "text-ink/60"}`}>
                  {tier.tagline}
                </p>

                {/* Fiyat */}
                <div className="mt-5">
                  <div className="flex items-end gap-1">
                    <span className="font-display text-4xl font-bold tabular-nums">₺{tr(price)}</span>
                    <span className={`pb-1 text-sm ${tier.featured ? "text-cream/60" : "text-ink/50"}`}>/ ay</span>
                  </div>
                  <p className={`mt-1.5 text-xs ${tier.featured ? "text-cream/60" : "text-ink/50"}`}>
                    {yearly ? (
                      <>
                        Yıllık faturalandırılır · {tr(tier.yearlyTotal)} ₺/yıl{" "}
                        <span className={`line-through ${tier.featured ? "text-cream/40" : "text-ink/35"}`}>
                          ₺{tr(tier.monthly)}
                        </span>
                      </>
                    ) : (
                      "Aylık faturalandırılır · istediğin zaman iptal"
                    )}
                  </p>
                </div>

                <Link
                  href="/register"
                  className={`mt-5 block rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 ${focusRing} ${
                    tier.featured
                      ? "bg-brand text-ink hover:bg-brand-dark"
                      : "border border-ink/15 text-ink hover:bg-ink/5"
                  }`}
                >
                  Ücretsiz Başla
                </Link>

                {tier.highlight && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-brand/15 px-3 py-2.5 text-xs font-semibold leading-relaxed text-cream">
                    <Gift className="mt-0.5 shrink-0 text-brand" />
                    <span>{tier.highlight}</span>
                  </div>
                )}

                <ul className="mt-6 space-y-3 text-sm">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check className="mt-0.5 shrink-0 text-brand-dark" />
                      <span className={tier.featured ? "text-cream/80" : "text-ink/70"}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Konumlandırma notu */}
      <Reveal delay={120}>
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-ink/10 bg-brand-soft/50 px-6 py-6 text-center">
          <p className="text-sm leading-relaxed text-ink/70">
            <span className="font-semibold text-ink">Karmaşık adisyon sistemleri değiliz.</span>{" "}
            Kilitlenen mutfak yazıcıları, yüksek komisyonlar ya da kurulum derdi yok.
            Eagle QR, müşterinizin iştahını kabartarak masadaki sepet ortalamanızı
            artırmaya odaklanan bir <span className="font-semibold text-ink">pazarlama platformudur</span>.
          </p>
        </div>
      </Reveal>
    </>
  );
}
