import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import Stats from "@/components/landing/Stats";
import Faq from "@/components/landing/Faq";
import Pricing from "@/components/landing/Pricing";
import NavIcon from "@/components/site/NavIcon";
import type { HomeSection } from "@/lib/home-sections";
import type { PricingConfig } from "@/lib/pricing-config";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

function Check({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Btn({ href, children, primary, onDark }: { href: string; children: React.ReactNode; primary?: boolean; onDark?: boolean }) {
  const cls = primary
    ? `group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink shadow-sm transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 ${focusRing}${onDark ? " focus-visible:ring-offset-ink" : ""}`
    : `inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 ${focusRing} ${onDark ? "border-cream/20 text-cream hover:bg-cream/10 focus-visible:ring-offset-ink" : "border-ink/15 text-ink hover:bg-ink/5"}`;
  const isAnchor = href.startsWith("#") || href.startsWith("http");
  return isAnchor ? <a href={href} className={cls}>{children}</a> : <Link href={href} className={cls}>{children}</Link>;
}

function Hero({ s }: { s: HomeSection }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-brand-soft blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-soft/40 via-cream to-cream" />
        {/* ince grid dokusu */}
        <svg className="absolute inset-0 h-full w-full opacity-35" aria-hidden>
          <defs>
            <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="#0f1a2a" strokeOpacity="0.04" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
        <Reveal>
          {s.badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-dark/25 bg-brand-soft px-4 py-1.5 text-xs font-bold tracking-wide text-ink/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-dark opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-dark" />
              </span>
              {s.badge}
            </span>
          )}
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {s.titleLead}{" "}
            {s.titleAccent && (
              <span className="relative inline-block text-brand-dark">
                {s.titleAccent}
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 220 10" fill="none" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 8C60 2 160 2 218 6" stroke="#f5b70c" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
                </svg>
              </span>
            )}
          </h1>
          {s.subtitle && <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65">{s.subtitle}</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {s.primaryLabel && (
              <Btn href={s.primaryHref || "/register"} primary>
                {s.primaryLabel}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Btn>
            )}
            {s.secondaryLabel && <Btn href={s.secondaryHref || "#"}>{s.secondaryLabel}</Btn>}
          </div>
          {s.bullets && s.bullets.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/60">
              {s.bullets.map((b) => (
                <span key={b} className="flex items-center gap-1.5"><Check className="text-brand-dark" /> {b}</span>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="hero-drift relative motion-reduce:animate-none">
              {/* yüzen chip kartları (DB: chip1/chip2) */}
              {s.chip1 && (
                <div className="absolute -right-2 top-10 z-10 flex items-center gap-2 rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-xs font-bold text-ink shadow-xl shadow-ink/10 sm:-right-6">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand-dark">
                    <NavIcon name="QrCode" size={15} />
                  </span>
                  {s.chip1}
                </div>
              )}
              {s.chip2 && (
                <div className="absolute -left-2 bottom-16 z-10 flex items-center gap-2 rounded-2xl border border-ink/10 bg-white px-3.5 py-2.5 text-xs font-bold text-ink shadow-xl shadow-ink/10 sm:-left-8">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-soft text-brand-dark">
                    <NavIcon name="Camera" size={15} />
                  </span>
                  {s.chip2}
                </div>
              )}

              {/* telefon gövdesi — dekoratif menü önizlemesi */}
              <div className="relative mx-auto w-[250px] rounded-[2.6rem] border-[10px] border-ink bg-ink shadow-2xl shadow-ink/30 sm:w-[270px]">
                <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" />
                <div className="overflow-hidden rounded-[2rem] bg-[#140d08]">
                  <div className="px-4 pb-5 pt-8 text-[#f2e8d9]">
                    <Image src="/eagle-logo.webp" alt="" width={36} height={36} className="mx-auto h-9 w-9 rounded-full object-contain" priority />
                    <p className="mt-1.5 text-center text-[8px] font-semibold tracking-[0.35em] text-[#cda86d]">DİJİTAL MENÜ</p>
                    <div className="mt-3 flex gap-1.5 overflow-hidden text-[9px] font-bold">
                      <span className="rounded-full bg-[#cda86d] px-2.5 py-1 text-[#140d08]">Tümü</span>
                      <span className="rounded-full border border-[#3a2c1f] px-2.5 py-1 text-[#ab9883]">Kahve</span>
                      <span className="rounded-full border border-[#3a2c1f] px-2.5 py-1 text-[#ab9883]">Tatlı</span>
                      <span className="rounded-full border border-[#3a2c1f] px-2.5 py-1 text-[#ab9883]">Brunch</span>
                    </div>
                    <div className="mt-3 rounded-xl bg-[#221710] p-2.5">
                      <div className="flex gap-2.5">
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#cda86d] to-[#8a6a3c] text-[#140d08]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" /></svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <p className="truncate text-[11px] font-bold">Cold Brew 18h</p>
                            <span className="rounded border border-[#3a2c1f] px-1 text-[6.5px] font-bold text-[#cda86d]">▶ VIDEO</span>
                          </div>
                          <p className="mt-0.5 text-[8.5px] leading-snug text-[#ab9883]">18 saat soğuk demleme, düşük asidite</p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="rounded-full bg-[#cda86d] px-1.5 py-px text-[7px] font-extrabold text-[#140d08]">🔥 Bugün Popüler</span>
                            <span className="text-[11px] font-bold text-[#cda86d]">₺95</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 rounded-xl bg-[#221710] p-2.5">
                      <div className="flex gap-2.5">
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#5c4632] to-[#2c2017] text-[#cda86d]">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" /><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" /></svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <p className="truncate text-[11px] font-bold">San Sebastian</p>
                            <span className="rounded border border-[#3a2c1f] px-1 text-[6.5px] font-bold text-[#cda86d]">AR</span>
                          </div>
                          <p className="mt-0.5 text-[8.5px] leading-snug text-[#ab9883]">Masanda 3D görüntüle — gerçek boyut</p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[8px] text-[#ab9883]">★ 4.8 (124)</span>
                            <span className="text-[11px] font-bold text-[#cda86d]">₺180</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 w-full rounded-full bg-[#cda86d] py-2 text-center text-[10px] font-extrabold text-[#140d08]">Masamda Görüntüle (AR)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Steps({ s }: { s: HomeSection }) {
  return (
    <section id="nasil-calisir" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        {s.overline && <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">{s.overline}</p>}
        {s.heading && <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{s.heading}</h2>}
        {s.subtitle && <p className="mt-3 text-ink/60">{s.subtitle}</p>}
      </Reveal>
      <div className="mt-14 grid gap-10 md:grid-cols-3">
        {(s.items ?? []).map((step, i, arr) => {
          const last = i === arr.length - 1;
          return (
            <Reveal key={i} delay={i * 100}>
              <div className="relative h-full text-center">
                <span className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl font-display text-xl font-bold ${last ? "bg-brand text-ink" : "bg-ink text-brand"}`}>
                  {step.no}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink/60">{step.desc}</p>
                {!last && (
                  <svg className="absolute -right-7 top-6 hidden text-ink/15 md:block" width="44" height="14" viewBox="0 0 44 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M1 7h38m0 0-5-5m5 5-5 5" />
                  </svg>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Features({ s }: { s: HomeSection }) {
  return (
    <section id="ozellikler" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          {s.overline && <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">{s.overline}</p>}
          {s.heading && <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{s.heading}</h2>}
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(s.items ?? []).map((f, i) => {
            // ilk özellik: büyük koyu "kahraman kart" (2 sütun) — sıralama admin panelinden
            if (i === 0) {
              return (
                <Reveal key={i} className="sm:col-span-2">
                  <div className="group relative h-full overflow-hidden rounded-3xl bg-ink p-8 text-cream transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl transition-all group-hover:bg-brand/30" aria-hidden />
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                      <NavIcon name={f.icon} size={22} />
                    </span>
                    <h3 className="mt-4 font-display text-xl font-bold sm:text-2xl">{f.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/70">{f.desc}</p>
                  </div>
                </Reveal>
              );
            }
            return (
              <Reveal key={i} delay={(i % 3) * 100}>
                <div className="h-full rounded-3xl border border-ink/10 bg-cream p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                    <NavIcon name={f.icon} size={22} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Cta({ s }: { s: HomeSection }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" aria-hidden />
          <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">
            {s.ctaLead} {s.ctaAccent && <span className="text-brand">{s.ctaAccent}</span>} {s.ctaTail}
          </h2>
          {s.subtitle && <p className="relative mx-auto mt-4 max-w-xl text-cream/70">{s.subtitle}</p>}
          <div className="relative mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            {s.primaryLabel && (
              <Btn href={s.primaryHref || "/register"} primary onDark>
                {s.primaryLabel}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Btn>
            )}
            {s.secondaryLabel && <Btn href={s.secondaryHref || "/login"} onDark>{s.secondaryLabel}</Btn>}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function HomeRenderer({ sections, pricing }: { sections: HomeSection[]; pricing: PricingConfig }) {
  return (
    <>
      {sections.filter((s) => s.enabled !== false).map((s) => {
        switch (s.type) {
          case "hero":
            return <Hero key={s.id} s={s} />;
          case "stats":
            return (
              <section key={s.id} className="border-y border-ink/5 bg-white">
                <Stats items={(s.items ?? []).map((it) => ({ prefix: it.prefix, value: it.value ?? "0", suffix: it.suffix, label: it.label ?? "" }))} />
              </section>
            );
          case "steps":
            return <Steps key={s.id} s={s} />;
          case "features":
            return <Features key={s.id} s={s} />;
          case "pricing":
            return (
              <section key={s.id} id="fiyatlandirma" className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
                <Pricing config={pricing} />
              </section>
            );
          case "faq":
            return (
              <section key={s.id} id="sss" className="bg-white py-20">
                <div className="mx-auto max-w-6xl px-5 sm:px-8">
                  <Reveal className="mx-auto max-w-2xl text-center">
                    {s.overline && <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">{s.overline}</p>}
                    {s.heading && <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{s.heading}</h2>}
                  </Reveal>
                  <Reveal className="mt-12" delay={80}>
                    <Faq items={(s.items ?? []).map((it) => ({ q: it.q ?? "", a: it.a ?? "" }))} />
                  </Reveal>
                </div>
              </section>
            );
          case "cta":
            return <Cta key={s.id} s={s} />;
          default:
            return null;
        }
      })}
    </>
  );
}
