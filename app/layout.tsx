import type { Metadata } from "next";
import { Playfair_Display, Karla } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
});

const karla = Karla({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eaglemenu.com"),
  title: "Eagle Menu — Restoranlar için akıllı dijital menü",
  description:
    "QR kodla açılan, AR/3D ve videolu ürünler, çok dilli ve alerjen filtreli dijital menü platformu. 15 dakikada kurun, anında yayınlayın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${karla.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-cream text-ink"
      >
        {children}
      </body>
    </html>
  );
}
