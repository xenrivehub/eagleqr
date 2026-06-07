"use client";

import { useEffect, useRef, useState } from "react";

export type StatInput = { prefix?: string; value: string; suffix?: string; label: string };

function useCountUp(target: number, decimals: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    const duration = 900;
    let raf = 0;
    let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);
  return value.toFixed(decimals);
}

function StatItem({ stat, start }: { stat: StatInput; start: boolean }) {
  const target = parseFloat(stat.value) || 0;
  const decimals = stat.value.includes(".") ? (stat.value.split(".")[1]?.length ?? 0) : 0;
  const display = useCountUp(target, decimals, start);
  return (
    <div className="text-center md:text-left">
      <div className="font-display text-3xl font-bold text-ink tabular-nums">
        {stat.prefix}
        {display}
        {stat.suffix}
      </div>
      <div className="mt-1 text-sm text-ink/60">{stat.label}</div>
    </div>
  );
}

export default function Stats({ items }: { items: StatInput[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const cols = items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4";
  return (
    <div ref={ref} className={`mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 sm:px-8 ${cols}`}>
      {items.map((s, i) => (
        <StatItem key={i} stat={s} start={start} />
      ))}
    </div>
  );
}
