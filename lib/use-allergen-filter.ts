"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "eq_allergens"; // global, anonim — tüm işletmelerde hatırlanır

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(codes: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(codes));
  } catch {
    /* yoksay */
  }
}

/**
 * Müşterinin kaçındığı alerjen kodlarını localStorage'da tutar.
 * SSR uyumu için ilk render boş; `ready` true olunca gerçek değer gelir.
 */
export function useAllergenFilter() {
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSelected(read());
    setReady(true);
  }, []);

  const toggle = useCallback((code: string) => {
    setSelected((prev) => {
      const next = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code];
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelected([]);
    write([]);
  }, []);

  return { selected, toggle, clear, ready };
}
