import Link from "next/link";
import type { Block } from "@/lib/page-blocks";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

function CtaButton({ label, href }: { label?: string; href?: string }) {
  if (!label) return null;
  return (
    <Link
      href={href || "/register"}
      className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 ${focusRing}`}
    >
      {label}
      <span aria-hidden>→</span>
    </Link>
  );
}

function Hero({ b }: { b: Block }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft/40 via-cream to-cream" />
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-28">
        {b.overline && (
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">{b.overline}</p>
        )}
        {b.title && (
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            {b.title}
          </h1>
        )}
        {b.subtitle && <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/70">{b.subtitle}</p>}
        <CtaButton label={b.ctaLabel} href={b.ctaHref} />
      </div>
    </section>
  );
}

function FeatureSplit({ b }: { b: Block }) {
  const right = b.side === "right";
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className={`grid items-center gap-10 md:grid-cols-2 ${right ? "md:[&>*:first-child]:order-2" : ""}`}>
        <div>
          {b.title && <h2 className="font-display text-3xl font-bold tracking-tight text-ink">{b.title}</h2>}
          {b.body && <p className="mt-4 leading-relaxed text-ink/70">{b.body}</p>}
          <CtaButton label={b.ctaLabel} href={b.ctaHref} />
        </div>
        <div className="flex items-center justify-center">
          {b.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.imageUrl} alt={b.title ?? ""} className="w-full rounded-3xl border border-ink/10 object-cover shadow-lg" />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl border border-dashed border-ink/15 bg-brand-soft/30 text-ink/30">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid({ b }: { b: Block }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {b.heading && (
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink">{b.heading}</h2>
        )}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(b.items ?? []).map((it, i) => (
            <div key={i} className="rounded-2xl border border-ink/10 bg-cream p-6">
              <h3 className="font-display text-lg font-semibold text-ink">{it.title}</h3>
              {it.desc && <p className="mt-2 text-sm leading-relaxed text-ink/60">{it.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ b }: { b: Block }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="grid gap-8 sm:grid-cols-3">
        {(b.items ?? []).map((it, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-4xl font-bold text-brand-dark">{it.value}</div>
            <div className="mt-1 text-sm text-ink/60">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Cta({ b }: { b: Block }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
        {b.title && <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">{b.title}</h2>}
        {b.subtitle && <p className="mx-auto mt-4 max-w-xl text-cream/70">{b.subtitle}</p>}
        {b.ctaLabel && (
          <Link
            href={b.ctaHref || "/register"}
            className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 ${focusRing} focus-visible:ring-offset-ink`}
          >
            {b.ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </section>
  );
}

function Faq({ b }: { b: Block }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        {b.heading && <h2 className="text-center font-display text-3xl font-bold tracking-tight text-ink">{b.heading}</h2>}
        <div className="mt-10 space-y-3">
          {(b.items ?? []).map((it, i) => (
            <details key={i} className="rounded-2xl border border-ink/10 bg-cream p-5">
              <summary className="cursor-pointer font-display text-base font-semibold text-ink">{it.q}</summary>
              {it.a && <p className="mt-2 text-sm leading-relaxed text-ink/70">{it.a}</p>}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function RichText({ b }: { b: Block }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      {b.heading && <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{b.heading}</h2>}
      {b.body && <p className="mt-4 whitespace-pre-line leading-relaxed text-ink/70">{b.body}</p>}
    </section>
  );
}

function ImageBlock({ b }: { b: Block }) {
  if (!b.imageUrl) return null;
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.imageUrl} alt={b.caption ?? ""} className="w-full rounded-3xl border border-ink/10 object-cover" />
      {b.caption && <p className="mt-3 text-center text-sm text-ink/50">{b.caption}</p>}
    </section>
  );
}

export default function PageRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b) => {
        switch (b.type) {
          case "hero": return <Hero key={b.id} b={b} />;
          case "featureSplit": return <FeatureSplit key={b.id} b={b} />;
          case "featureGrid": return <FeatureGrid key={b.id} b={b} />;
          case "stats": return <Stats key={b.id} b={b} />;
          case "cta": return <Cta key={b.id} b={b} />;
          case "faq": return <Faq key={b.id} b={b} />;
          case "richText": return <RichText key={b.id} b={b} />;
          case "image": return <ImageBlock key={b.id} b={b} />;
          default: return null;
        }
      })}
    </>
  );
}
