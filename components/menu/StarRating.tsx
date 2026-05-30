"use client";

import { useState } from "react";
import { rateProduct } from "@/lib/actions/rating";

export default function StarRating({
  productId,
  avg,
  count,
  mine,
  labels,
}: {
  productId: string;
  avg: number;
  count: number;
  mine: number;
  labels: { rateThis: string; votes: string; thanks: string };
}) {
  const [state, setState] = useState({ avg, count, mine });
  const [hover, setHover] = useState(0);
  const [pending, setPending] = useState(false);
  const [thanks, setThanks] = useState(false);

  async function rate(n: number) {
    if (pending) return;
    setPending(true);
    const res = await rateProduct(productId, n);
    setPending(false);
    if (res.success) {
      setState({ avg: res.avg, count: res.count, mine: res.mine });
      setThanks(true);
      setTimeout(() => setThanks(false), 2500);
    }
  }

  const display = hover || state.mine;

  return (
    <section className="mt-7 rounded-2xl border border-menu-border bg-menu-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-menu-gold">
            ★ {labels.rateThis}
          </p>
          {state.count > 0 && (
            <p className="mt-1.5 text-sm text-menu-text/90">
              <span className="font-display text-lg font-bold">{state.avg.toFixed(1)}</span>
              <span className="text-menu-muted"> / 5 · {state.count} {labels.votes}</span>
            </p>
          )}
        </div>

        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHover(0)}
          role="radiogroup"
          aria-label={labels.rateThis}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              disabled={pending}
              onMouseEnter={() => setHover(n)}
              onClick={() => rate(n)}
              aria-label={`${n}`}
              aria-checked={state.mine === n}
              role="radio"
              className="cursor-pointer p-0.5 text-2xl leading-none transition-transform hover:scale-110 disabled:cursor-wait"
              style={{ color: n <= display ? "var(--color-menu-gold)" : "var(--color-menu-border)" }}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {thanks && (
        <p className="mt-2 text-xs font-semibold text-menu-gold">{labels.thanks}</p>
      )}
    </section>
  );
}
