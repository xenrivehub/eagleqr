"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Fable landing — koyu orman + kor. Scroll-frame video hero + GSAP animasyonlar.
// Kareler public/landing/frames, AR videosu public/landing/video.

const N = 97; // hero kare sayısı (public/landing/frames)
const FRAME_URLS = Array.from(
  { length: N },
  (_, i) => `/landing/frames/f${String(i + 1).padStart(3, "0")}.webp`,
);
const FRAME_W = 1280;
const FRAME_H = 720;

export type LandingTiers = { standart: string; pro: string; max: string };

const brandMark = (
  <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="#ff5a2e" />
    <path d="M9 21c2.8 0 4.6-1.6 5.7-4.1L17 11h6l-3.6 8.2C17.6 23.6 14.3 25 10 25z" fill="#0c110d" />
  </svg>
);

function TickerRow({ hidden = false }: { hidden?: boolean }) {
  const names = ["Fern İzmir", "Kordon 22", "Sade Kahve", "Nou Bistro", "Meyhane Krom"];
  return (
    <div className="flex items-center gap-14" aria-hidden={hidden}>
      {names.map((n) => (
        <span key={n} className="flex items-center gap-3">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <circle cx="13" cy="13" r="13" fill="#22301f" />
            <text x="13" y="17.5" textAnchor="middle" fontFamily="var(--font-fable)" fontSize="12" fontWeight="700" fill="#ece9df">
              {n[0]}
            </text>
          </svg>
          <span className="font-fable text-base font-semibold text-bone-dim">{n}</span>
        </span>
      ))}
    </div>
  );
}

export default function MotionLanding({ tiers }: { tiers: LandingTiers }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames: (HTMLImageElement | null)[] = new Array(N).fill(null);
    let current = 0;

    function sizeCanvas() {
      const c = canvas!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
    }
    function draw(i: number) {
      let f = frames[i];
      if (!f) for (let k = i; k >= 0; k--) if (frames[k]) { f = frames[k]; break; }
      if (!f) return;
      current = i;
      const c = canvas!;
      const scale = Math.max(c.width / FRAME_W, c.height / FRAME_H);
      const dw = FRAME_W * scale, dh = FRAME_H * scale;
      ctx!.clearRect(0, 0, c.width, c.height);
      ctx!.drawImage(f, (c.width - dw) / 2, (c.height - dh) / 2, dw, dh);
    }
    sizeCanvas();
    const onResize = () => { sizeCanvas(); draw(current); };
    window.addEventListener("resize", onResize);

    function prepare(i: number) {
      const img = new Image();
      img.src = FRAME_URLS[i];
      img.onload = () => { frames[i] = img; if (i === 0) draw(0); };
    }
    prepare(0);
    let queue = 1;
    function idleBatch(deadline?: IdleDeadline) {
      while (queue < N && (deadline ? deadline.timeRemaining() > 4 : true)) prepare(queue++);
      if (queue < N) schedule();
    }
    function schedule() {
      if ("requestIdleCallback" in window) (window as Window & typeof globalThis).requestIdleCallback(idleBatch);
      else setTimeout(() => idleBatch(), 16);
    }
    schedule();

    if (reduce) {
      prepare(Math.floor(N / 2));
      setTimeout(() => draw(Math.floor(N / 2)), 400);
      document.querySelectorAll<HTMLVideoElement>("video[data-autoplay]").forEach((v) => v.removeAttribute("autoplay"));
      return () => window.removeEventListener("resize", onResize);
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctxGsap = gsap.context(() => {
      const state = { frame: 0 };
      gsap.to(state, {
        frame: N - 1,
        ease: "none",
        scrollTrigger: { trigger: "#fable-scrub", start: "top top", end: "bottom bottom", scrub: 0.4 },
        onUpdate: () => draw(Math.round(state.frame)),
      });

      gsap.timeline({ scrollTrigger: { trigger: "#fable-scrub", start: "top top", end: "bottom bottom", scrub: true } })
        .to("#cap-0", { opacity: 0, y: -40, duration: 0.6 }, 0.5)
        .fromTo("#cap-1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, immediateRender: false }, 1.1)
        .to("#cap-1", { opacity: 0, y: -40, duration: 0.6 }, 2.1)
        .fromTo("#cap-2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, immediateRender: false }, 2.7);

      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card.firstElementChild, {
          scale: 0.94, opacity: 0.45, ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top+=96", scrub: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: (i % 3) * 0.07,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      document.querySelectorAll<HTMLElement>(".fable-count").forEach((el) => {
        const to = Number(el.dataset.to);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to, duration: 1.4, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
        });
      });
    });

    return () => { window.removeEventListener("resize", onResize); ctxGsap.revert(); };
  }, []);

  const check = <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />;

  return (
    <div className="bg-pine-950 font-fable-body text-bone antialiased">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-bone/5 bg-pine-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Eagle Menu">
            {brandMark}
            <span className="font-fable text-lg font-bold tracking-tight">Eagle Menu</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-bone-dim lg:flex" aria-label="Ana gezinme">
            <a className="transition-colors hover:text-bone" href="#neler">Neler yapar</a>
            <a className="transition-colors hover:text-bone" href="#temalar">Temalar</a>
            <a className="transition-colors hover:text-bone" href="#kurulum">Kurulum</a>
            <a className="transition-colors hover:text-bone" href="#fiyat">Fiyat</a>
          </nav>
          <Link href="/register" className="cursor-pointer rounded-full bg-ember px-5 py-2.5 text-sm font-bold text-pine-950 transition-all hover:bg-ember-deep active:scale-[0.98]">
            Ücretsiz Başla
          </Link>
        </div>
      </header>

      <main>
        {/* HERO scrub */}
        <section id="fable-scrub" className="relative" style={{ height: "420vh" }}>
          <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/35 to-pine-950/55" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-r from-pine-950/70 via-transparent to-pine-950/30" aria-hidden="true" />
            <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
              <div id="cap-0" className="fable-cap max-w-xl">
                <h1 className="font-fable text-[3rem] font-extrabold leading-[1.02] tracking-tight sm:text-[4.4rem]">İştah,<br />ekranda başlar.</h1>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-bone-dim">Kaydır. Menünün nasıl canlandığını izle.</p>
              </div>
              <div id="cap-1" className="fable-cap absolute inset-x-5 top-1/2 max-w-xl -translate-y-1/2 opacity-0 sm:inset-x-8">
                <h2 className="font-fable text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">Önce koku yok,<br /><span className="text-ember">görüntü var.</span></h2>
                <p className="mt-4 max-w-md text-lg text-bone-dim">Video ve AR, iştahı fotoğraftan önce açar.</p>
              </div>
              <div id="cap-2" className="fable-cap absolute inset-x-5 top-1/2 ml-auto max-w-xl -translate-y-1/2 text-right opacity-0 sm:inset-x-8">
                <h2 className="ml-auto font-fable text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">Masaya gelmeden,<br />masanda.</h2>
                <p className="ml-auto mt-4 max-w-md text-lg text-bone-dim">AR ile gerçek boyut. Uygulama yok, tarayıcı yeter.</p>
              </div>
            </div>
          </div>
        </section>

        {/* GÜVEN ŞERİDİ */}
        <section className="border-y border-bone/5 bg-pine-900/50 py-6" aria-label="Eagle Menu kullanan mekanlar">
          <div className="overflow-hidden">
            <div className="fable-ticker flex w-max items-center gap-14 px-7">
              <TickerRow />
              <TickerRow hidden />
            </div>
          </div>
        </section>

        {/* BENTO */}
        <section id="neler" className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
          <h2 className="reveal max-w-2xl font-fable text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">Fotoğraf gösterme devri bitti.</h2>
          <p className="reveal mt-4 max-w-lg text-lg leading-relaxed text-bone-dim">Müşteri artık izliyor, döndürüyor, masasında görüyor.</p>

          <div className="mt-14 grid gap-4 sm:grid-cols-6">
            <article className="reveal group relative overflow-hidden rounded-[20px] sm:col-span-4">
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video src="/landing/video/ar-web.mp4" poster="/landing/img/ar-poster.jpg" autoPlay muted loop playsInline data-autoplay className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" aria-label="Buğusu tüten bir yemek tabağının etrafında yavaşça dönen kamera" />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-950/95 via-pine-950/30 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-0 p-7">
                <h3 className="font-fable text-2xl font-bold">AR ile masada gerçek boyut</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-bone/75">Müşteri kamerayı masaya doğrultur, tatlınız gerçek boyutuyla belirir. Uygulama indirmek yok.</p>
              </div>
            </article>

            <article className="reveal flex flex-col justify-between rounded-[20px] bg-gradient-to-br from-ember to-[#c23a15] p-7 sm:col-span-2">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0c110d" strokeWidth="2" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="#0c110d" stroke="none" /></svg>
              <div>
                <h3 className="font-fable text-xl font-bold text-pine-950">Videolu ürünler</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-pine-950/75">Hazırlanış videosu iştahı menüde açar. Ürün adının yanında oynar.</p>
              </div>
            </article>

            <article className="reveal rounded-[20px] border border-bone/8 bg-pine-900 p-7 sm:col-span-2">
              <h3 className="font-fable text-xl font-bold">Saydam analitik</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-dim">Hangi ürün bakılıyor, müşterin hangi dili konuşuyor. Şişirme yok.</p>
              <div className="mt-6 flex h-16 items-end gap-1.5" role="img" aria-label="Örnek haftalık tarama grafiği">
                {[34, 52, 41, 66, 88, 73, 58].map((h, i) => (
                  <span key={i} className={`w-full rounded-sm ${h === 88 ? "bg-ember" : "bg-bone/15"}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </article>

            <article className="reveal rounded-[20px] border border-bone/8 bg-pine-900 p-7 sm:col-span-2">
              <p className="font-fable text-2xl font-bold leading-tight">Merhaba.<br /><span className="text-bone-dim">Hello.</span><br /><span className="text-bone/40">مرحبا.</span></p>
              <h3 className="mt-5 font-fable text-xl font-bold">10 dilde tek tıkla</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-dim">AI çevirisi. Turist masada kendi dilinde okur.</p>
            </article>

            <article className="reveal relative overflow-hidden rounded-[20px] bg-pine-700 p-7 sm:col-span-2">
              <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-ember/25 blur-3xl" aria-hidden="true" />
              <span className="rounded-full bg-ember px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-pine-950">Yeni</span>
              <h3 className="mt-4 font-fable text-xl font-bold">QR açılış ekranı</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone/70">QR okutulunca önce tanıtım videonuz oynar, sonra menü açılır. Marka deneyimi kapıda başlar.</p>
            </article>
          </div>
        </section>

        {/* STICKY-STACK */}
        <section id="kurulum" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <h2 className="reveal max-w-2xl font-fable text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">Üç hamlede sahne senin.</h2>
          <div className="relative mt-14">
            {[
              { n: 1, t: "Menünü aktar", d: "Basılı menünün fotoğrafını çek. Yapay zeka ürünleri, fiyatları, kategorileri kendisi çıkarır.", img: "motion-scan", bg: "border border-bone/10 bg-pine-900", dim: "text-bone-dim" },
              { n: 2, t: "Temanı giy", d: "Yalı, Kordon 22, Çini. Markana uyanı seç, logonu ekle.", img: "motion-theme", bg: "border border-bone/10 bg-pine-700", dim: "text-bone/70" },
              { n: 3, t: "QR'ı masaya koy", d: "Fiyat değişti mi? Panelden düzelt, her masada anında güncel.", img: "motion-qr", bg: "bg-gradient-to-br from-ember to-[#c23a15]", dim: "text-pine-950/75", dark: true },
            ].map((s, i) => (
              <div key={s.n} className={`stack-card sticky top-24 ${i > 0 ? "mt-6" : ""}`}>
                <article className={`grid gap-8 overflow-hidden rounded-[20px] md:grid-cols-2 ${s.bg}`}>
                  <div className="flex flex-col justify-center p-8 md:p-9">
                    <span className={`grid h-11 w-11 place-items-center rounded-full font-fable text-base font-bold ${s.dark ? "bg-pine-950 text-ember" : "bg-ember text-pine-950"}`}>{s.n}</span>
                    <h3 className={`mt-5 font-fable text-2xl font-bold sm:text-3xl ${s.dark ? "text-pine-950" : ""}`}>{s.t}</h3>
                    <p className={`mt-3 max-w-sm leading-relaxed ${s.dark ? "font-medium" : ""} ${s.dim}`}>{s.d}</p>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/landing/img/${s.img}.jpg`} alt={s.t} className="h-64 w-full object-cover md:h-full" />
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* TEMA VİTRİNİ */}
        <section id="temalar" className="border-y border-bone/5 bg-pine-900/40 py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="reveal max-w-2xl">
              <h2 className="font-fable text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">Menünüz, markanız gibi görünür.</h2>
              <p className="mt-4 text-lg leading-relaxed text-bone-dim">İşletmene özel hazır temalar. Her mekan tipine bir dil.</p>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[
                { img: "theme-yali", bg: "bg-[#f7f7f4]", title: "Yalı", tc: "text-[#16303f]", dc: "text-[#16303f]/60", ac: "text-[#1f6f8b]", d: "Ege badanası, deniz mavisi, zeytin. Sahil mekanları için." },
                { img: "theme-kordon", bg: "bg-[#0d1512]", title: "Kordon 22", tc: "text-[#d8c9a3]", dc: "text-[#7d8a7f]", ac: "text-[#d8c9a3]", d: "Art-deco supper club. Zümrüt ve şampanya. Gece mekanları için." },
                { img: "theme-cini", bg: "bg-[#f6f5ef]", title: "Çini", tc: "text-[#14418f]", dc: "text-[#1a2333]/60", ac: "text-[#14418f]", d: "İznik kobaltı, çağdaş grotesk. Yeni nesil lokantalar için." },
              ].map((t) => (
                <div key={t.title} className={`reveal group overflow-hidden rounded-[20px] border border-bone/8 ${t.bg}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/landing/img/${t.img}.jpg`} alt={`${t.title} teması`} className="h-44 w-full object-cover" />
                  <div className="p-6">
                    <h3 className={`font-fable text-xl font-bold ${t.tc}`}>{t.title}</h3>
                    <p className={`mt-1.5 text-sm leading-relaxed ${t.dc}`}>{t.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAYAÇLAR */}
        <section className="py-24">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-5 text-center sm:grid-cols-3 sm:px-8">
            <div className="reveal">
              <p className="font-fable text-5xl font-extrabold tabular-nums text-ember"><span className="fable-count" data-to="15">0</span> dk</p>
              <p className="mt-2 text-sm text-bone-dim">kurulumdan yayına</p>
            </div>
            <div className="reveal">
              <p className="font-fable text-5xl font-extrabold tabular-nums text-ember"><span className="fable-count" data-to="10">0</span> dil</p>
              <p className="mt-2 text-sm text-bone-dim">tek tıkla AI çeviri</p>
            </div>
            <div className="reveal">
              <p className="font-fable text-5xl font-extrabold tabular-nums text-ember">%<span className="fable-count" data-to="0">0</span></p>
              <p className="mt-2 text-sm text-bone-dim">komisyon. Evet, sıfır.</p>
            </div>
          </div>
        </section>

        {/* FİYAT */}
        <section id="fiyat" className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
          <h2 className="reveal font-fable text-4xl font-bold tracking-tight sm:text-5xl">Bir servis tabağından ucuz.</h2>
          <p className="reveal mt-4 max-w-md text-lg text-bone-dim">Yıllık ödemede 2 ay hediye. İstediğin an iptal.</p>
          <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="reveal relative overflow-hidden rounded-[20px] border border-ember/40 bg-pine-900 p-9">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ember/15 blur-3xl" aria-hidden="true" />
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-fable text-2xl font-bold text-ember">Pro</h3>
                <p><span className="font-fable text-5xl font-extrabold tabular-nums">₺{tiers.pro}</span><span className="text-sm text-bone-dim">/ay</span></p>
              </div>
              <p className="mt-2 text-sm text-bone-dim">Satışı büyütmek isteyen işletmeler için.</p>
              <ul className="mt-7 grid gap-3 text-sm sm:grid-cols-2">
                {["Videolu ürünler", "QR açılış ekranı", "AI çeviri, 10 dil", "Kampanya ve servis saatleri", "Gelişmiş analitik", "Tüm premium temalar"].map((f) => (
                  <li key={f} className="flex gap-2.5">{check}{f}</li>
                ))}
              </ul>
              <Link href="/register" className="mt-8 block cursor-pointer rounded-full bg-ember py-3.5 text-center text-sm font-bold text-pine-950 transition-colors hover:bg-ember-deep">Ücretsiz Başla</Link>
            </article>
            <div className="grid gap-5">
              <article className="reveal rounded-[20px] border border-bone/8 bg-pine-900 p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-fable text-lg font-bold">Standart</h3>
                  <p><span className="font-fable text-3xl font-extrabold tabular-nums">₺{tiers.standart}</span><span className="text-xs text-bone-dim">/ay</span></p>
                </div>
                <p className="mt-1.5 text-sm text-bone-dim">Sınırsız ürün, QR kod, temel temalar, alerjen filtresi.</p>
              </article>
              <article className="reveal rounded-[20px] border border-bone/8 bg-pine-900 p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-fable text-lg font-bold">Max</h3>
                  <p><span className="font-fable text-3xl font-extrabold tabular-nums">₺{tiers.max}</span><span className="text-xs text-bone-dim">/ay</span></p>
                </div>
                <p className="mt-1.5 text-sm text-bone-dim">Pro'nun tamamı, artı AR/3D ürünler ve fotoğraftan AI menü aktarma.</p>
              </article>
            </div>
          </div>
        </section>

        {/* SON ÇAĞRI */}
        <section className="px-5 pb-28 sm:px-8">
          <div className="reveal relative mx-auto max-w-7xl overflow-hidden rounded-[20px] bg-gradient-to-br from-pine-700 to-pine-900 px-8 py-20 text-center">
            <div className="pointer-events-none absolute left-1/2 top-0 h-52 w-[480px] -translate-x-1/2 rounded-full bg-ember/20 blur-[110px]" aria-hidden="true" />
            <h2 className="relative mx-auto max-w-2xl font-fable text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">Rakibin hâlâ PDF gösteriyor.</h2>
            <p className="relative mx-auto mt-4 max-w-md text-lg text-bone-dim">Sen bugün masaya koy.</p>
            <Link href="/register" className="relative mt-9 inline-block cursor-pointer rounded-full bg-ember px-8 py-4 text-sm font-bold text-pine-950 shadow-[0_10px_40px_rgba(255,90,46,0.35)] transition-all hover:bg-ember-deep active:scale-[0.98]">Ücretsiz Başla</Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-bone/5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">{brandMark}<span className="font-fable text-base font-bold">Eagle Menu</span></div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-bone-dim" aria-label="Alt gezinme">
            <a className="transition-colors hover:text-bone" href="#neler">Neler yapar</a>
            <a className="transition-colors hover:text-bone" href="#temalar">Temalar</a>
            <a className="transition-colors hover:text-bone" href="#fiyat">Fiyat</a>
            <Link className="transition-colors hover:text-bone" href="/login">İşletme Girişi</Link>
          </nav>
          <p className="text-xs text-bone-dim/60">© 2026 Eagle Menu</p>
        </div>
      </footer>
    </div>
  );
}
