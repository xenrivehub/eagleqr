import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Faq from "@/components/landing/Faq";
import Stats from "@/components/landing/Stats";
import Reveal from "@/components/site/Reveal";

const steps = [
  {
    no: "01",
    title: "Hesabını oluştur",
    desc: "Dakikalar içinde işletme hesabını aç, kredi kartı gerekmeden ücretsiz başla.",
  },
  {
    no: "02",
    title: "Menünü tasarla",
    desc: "Ürünlerini ekle; fotoğraf, video ve 3D/AR model yükle. Temanı işletmene özel düzenle.",
  },
  {
    no: "03",
    title: "QR'ı paylaş",
    desc: "Masa bazlı QR kodlarını oluştur, yazdır ve müşterilerin menüne anında ulaşsın.",
  },
];

const features = [
  {
    title: "Dinamik Menü Editörü",
    desc: "Sürükle-bırak ile kategori ve ürünleri düzenle, sold-out yönet, Excel/CSV ile içe aktar.",
    icon: "M4 6h16M4 12h16M4 18h10",
  },
  {
    title: "AR / 3D Ürünler",
    desc: "GLB/USDZ model yükle; müşteri ürünü 360° döndürsün, mobilde 'AR'da gör' ile masasına yerleştirsin.",
    icon: "M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10",
  },
  {
    title: "Videolu Ürünler",
    desc: "Her ürüne kısa hazırlanış veya tanıtım videosu ekle, iştahı menüde aç.",
    icon: "M23 7l-7 5 7 5zM1 5h15v14H1z",
  },
  {
    title: "Profil & Alerjen Filtresi",
    desc: "14 AB alerjen kategorisine göre otomatik filtre, kişisel tercihlerle akıllı sıralama.",
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  {
    title: "Analitik & Raporlar",
    desc: "Tarama sayısı, ürün görüntüleme, heatmap ve menü mühendisliği; PDF/Excel export.",
    icon: "M3 3v18h18M7 14l4-4 3 3 5-6",
  },
  {
    title: "Çok Dil & KVKK",
    desc: "10 dile kadar menü, KVKK/GDPR uyumlu veri yaklaşımı ve 2FA korumalı panel.",
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z",
  },
];

const tiers = [
  {
    name: "Standart",
    desc: "Tek lokasyonlu küçük işletmeler için.",
    features: [
      "Sınırsız görsel ürün",
      "2 ücretsiz tema (Mineral & Maison)",
      "Menü editörü & QR kod",
      "Çok dil desteği & temel analitik",
    ],
    featured: false,
  },
  {
    name: "Pro",
    desc: "Büyüyen işletmeler için en popüler paket.",
    features: [
      "Standart'taki her şey",
      "Videolu ürünler",
      "+1 premium tema hakkı",
      "Gelişmiş analitik & heatmap",
    ],
    featured: true,
  },
  {
    name: "Max",
    desc: "Premium deneyim isteyen işletmeler için.",
    features: [
      "Pro'daki her şey",
      "AR / 3D ürünler (model-viewer)",
      "Tüm temalara erişim",
      "Çoklu şube & öncelikli destek",
    ],
    featured: false,
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* arka plan zenginleştirmesi */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
            <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-brand-soft blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-soft/40 via-cream to-cream" />
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-soft px-3 py-1 text-xs font-semibold text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-dark" />
                AR & videolu menü ile yeni nesil deneyim
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
                Menünüz artık{" "}
                <span className="text-brand-dark">canlanıyor.</span>
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">
                Eagle QR ile müşterileriniz ürünlerinizi videoyla izler, 3D ve AR
                ile masalarında görür. Çok dilli, alerjen filtreli, işletmenize
                özel tasarlanan dijital menü — 15 dakikada yayında.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className={`group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 ${focusRing}`}
                >
                  Ücretsiz Dene
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <a
                  href="#nasil-calisir"
                  className={`inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-ink/5 hover:scale-[1.02] active:scale-95 ${focusRing}`}
                >
                  Nasıl Çalışır?
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/60">
                <span className="flex items-center gap-1.5">
                  <Check className="text-brand-dark" /> Kurulum 15 dakika
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="text-brand-dark" /> Kredi kartı gerekmez
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="text-brand-dark" /> KVKK uyumlu
                </span>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative flex items-center justify-center">
                <div className="absolute h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
                <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-b from-brand-soft to-cream sm:h-80 sm:w-80">
                  <Image
                    src="/eagle-logo.webp"
                    alt="Eagle QR"
                    width={220}
                    height={220}
                    className="relative h-52 w-52 object-contain sm:h-60 sm:w-60"
                    priority
                  />
                </div>
                <div className="absolute right-2 top-6 flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3 py-2 text-xs font-semibold text-ink shadow-lg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-dark" aria-hidden>
                    <path d="M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10" />
                  </svg>
                  AR'da Gör
                </div>
                <div className="absolute bottom-8 left-0 flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3 py-2 text-xs font-semibold text-ink shadow-lg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-brand-dark" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ürün Videosu
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-ink/5 bg-white">
          <Stats />
        </section>

        {/* Steps */}
        <section id="nasil-calisir" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
              Nasıl Çalışır
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Üç adımda dijital menünüz hazır
            </h2>
            <p className="mt-3 text-ink/60">
              Karmaşık kurulum yok, teknik bilgi gerekmez. Bugün başlayın — bugün
              yayınlayın.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.no} delay={i * 100}>
                <div className="h-full rounded-2xl border border-ink/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-ink">
                    {step.no}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="ozellikler" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
                Özellikler
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                İşletmenizi büyütecek her şey, tek platformda
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 100}>
                  <div className="h-full rounded-2xl border border-ink/10 bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d={f.icon} />
                      </svg>
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing — Yakında */}
        <section id="fiyatlandirma" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
              Fiyatlandırma
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              İşletmenize uygun paketi seçin
            </h2>
            <p className="mt-3 text-ink/60">
              Fiyatlandırma yakında açıklanacak. Erken erişim için ücretsiz
              denemeyle başlayabilirsiniz.
            </p>
          </Reveal>
          <div className="mt-12 grid items-start gap-6 md:grid-cols-3">
            {tiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 100}>
                <div
                  className={`relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
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
                  <p
                    className={`mt-1 text-sm ${tier.featured ? "text-cream/70" : "text-ink/60"}`}
                  >
                    {tier.desc}
                  </p>
                  <div className="mt-5">
                    <span className="font-display text-3xl font-bold">Yakında</span>
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
                  <ul className="mt-6 space-y-3 text-sm">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="mt-0.5 shrink-0 text-brand-dark" />
                        <span
                          className={tier.featured ? "text-cream/80" : "text-ink/70"}
                        >
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="sss" className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">
                SSS
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Sıkça Sorulan Sorular
              </h2>
            </Reveal>
            <Reveal className="mt-12" delay={80}>
              <Faq />
            </Reveal>
          </div>
        </section>

        {/* CTA band */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <Reveal>
            <div className="rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">
                Menünüzü <span className="text-brand">canlandırmaya</span> bugün
                başlayın.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-cream/70">
                Kredi kartı gerekmez — 15 dakikada kurun, ilk QR kodunuzu hemen
                paylaşın.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className={`group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 ${focusRing} focus-visible:ring-offset-ink`}
                >
                  Ücretsiz Başla
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/login"
                  className={`inline-flex items-center justify-center rounded-full border border-cream/20 px-6 py-3 text-sm font-semibold text-cream transition-all hover:bg-cream/10 hover:scale-[1.02] active:scale-95 ${focusRing} focus-visible:ring-offset-ink`}
                >
                  İşletme Girişi
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
