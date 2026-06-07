import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Ürün",
    links: [
      { href: "#ozellikler", label: "Özellikler" },
      { href: "#fiyatlandirma", label: "Fiyatlandırma" },
      { href: "#nasil-calisir", label: "Nasıl Çalışır" },
      { href: "#sss", label: "SSS" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
      { href: "/gizlilik", label: "Gizlilik Politikası" },
      { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Image
                src="/eagle-logo.webp"
                alt="Eagle Menu"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span className="font-display text-base font-bold text-ink">Eagle Menu</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
              Restoran ve kafeler için AR/3D, videolu ve çok dilli akıllı dijital
              menü platformu.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/60 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-ink/10 pt-6 text-sm text-ink/50">
          © {new Date().getFullYear()} Eagle Menu. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
