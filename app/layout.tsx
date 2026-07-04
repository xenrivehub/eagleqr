import type { Metadata, Viewport } from "next";
import { Playfair_Display, Karla, Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#f5b70c",
};

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
});

const karla = Karla({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

// Fable landing markası — display + gövde
const bricolage = Bricolage_Grotesque({
  variable: "--font-fable",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

const figtree = Figtree({
  variable: "--font-fable-body",
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
      className={`${playfair.variable} ${karla.variable} ${bricolage.variable} ${figtree.variable} h-full antialiased`}
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
