"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "eq_lang";

function readCookie(): string | null {
  const m = document.cookie.match(/(?:^|;\s*)eq_lang=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * Müşterinin seçtiği menü dili. localStorage + cookie'de tutulur;
 * cookie sayesinde sunucu (ürün detay sayfası) de aynı dili okuyabilir.
 */
export function useMenuLang(initial = "tr") {
  const [lang, setLangState] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let v: string | null = null;
    try {
      v = localStorage.getItem(KEY) || readCookie();
    } catch {
      v = readCookie();
    }
    if (v) setLangState(v);
    setReady(true);
  }, []);

  const setLang = useCallback((code: string) => {
    setLangState(code);
    try {
      localStorage.setItem(KEY, code);
    } catch {
      /* yoksay */
    }
    // 1 yıl, tüm site
    document.cookie = `${KEY}=${encodeURIComponent(code)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }, []);

  return { lang, setLang, ready };
}
