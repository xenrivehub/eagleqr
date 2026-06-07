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
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
        <Reveal>
          {s.badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-soft px-3 py-1 text-xs font-semibold text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-dark" />
              {s.badge}
            </span>
          )}
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            {s.titleLead} {s.titleAccent && <span className="text-brand-dark">{s.titleAccent}</span>}
          </h1>
          {s.subtitle && <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">{s.subtitle}</p>}
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
          <div className="relative flex items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-b from-brand-soft to-cream sm:h-80 sm:w-80">
              <Image src="/eagle-logo.webp" alt="Eagle QR" width={220} height={220} className="relative h-52 w-52 object-contain sm:h-60 sm:w-60" priority />
            </div>
            {s.chip1 && (
              <div className="absolute right-2 top-6 flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3 py-2 text-xs font-semibold text-ink shadow-lg">
                <NavIcon name="QrCode" size={14} className="text-brand-dark" />
                {s.chip1}
              </div>
            )}
            {s.chip2 && (
              <div className="absolute bottom-8 left-0 flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3 py-2 text-xs font-semibold text-ink shadow-lg">
                <NavIcon name="Camera" size={14} className="text-brand-dark" />
                {s.chip2}
              </div>
            )}
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
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {(s.items ?? []).map((step, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className="h-full rounded-2xl border border-ink/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-ink">{step.no}</span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{step.desc}</p>
            </div>
          </Reveal>
        ))}
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
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(s.items ?? []).map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <div className="h-full rounded-2xl border border-ink/10 bg-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
                  <NavIcon name={f.icon} size={22} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({ s }: { s: HomeSection }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <Reveal>
        <div className="rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">
            {s.ctaLead} {s.ctaAccent && <span className="text-brand">{s.ctaAccent}</span>} {s.ctaTail}
          </h2>
          {s.subtitle && <p className="mx-auto mt-4 max-w-xl text-cream/70">{s.subtitle}</p>}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
