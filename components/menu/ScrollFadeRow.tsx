"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// Yatay kaydırılabilir satır: çirkin kaydırma çubuğunu gizler, kaydırılabilir
// yöne doğru kenarı soluklaştırır (ipucu). Kaydırdıkça soluklaşma güncellenir.
export default function ScrollFadeRow({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  function update() {
    const el = ref.current;
    if (!el) return;
    const start = el.scrollLeft > 2;
    const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setEdges((p) => (p.start === start && p.end === end ? p : { start, end }));
  }

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const f = 26; // soluklaşma genişliği (px)
  const mask =
    edges.start && edges.end
      ? `linear-gradient(to right, transparent 0, #000 ${f}px, #000 calc(100% - ${f}px), transparent 100%)`
      : edges.end
        ? `linear-gradient(to right, #000 calc(100% - ${f}px), transparent 100%)`
        : edges.start
          ? `linear-gradient(to right, transparent 0, #000 ${f}px)`
          : "none";

  return (
    <div
      ref={ref}
      className="no-scrollbar"
      style={{ overflowX: "auto", WebkitMaskImage: mask, maskImage: mask, ...style }}
    >
      {children}
    </div>
  );
}
