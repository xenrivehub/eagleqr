import type { Metadata } from "next";
import { getSeoSettings } from "@/lib/queries/seo";
import { getPricingConfig } from "@/lib/queries/home";
import MotionLanding from "@/components/site/MotionLanding";

// Build sırasında (Docker — DB yok) prerender edilmesin; SEO + fiyat DB'den istek anında.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    title: seo.homeTitle,
    description: seo.homeDescription,
    keywords: seo.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    alternates: { canonical: "/" },
    openGraph: { title: seo.homeTitle, description: seo.homeDescription, type: "website", url: "/" },
  };
}

const fmt = (n: number) => n.toLocaleString("tr-TR");

export default async function Home() {
  const pricing = await getPricingConfig();
  const tArr = pricing.tiers ?? [];
  const find = (key: string) => tArr.find((x) => x.name.toLowerCase().includes(key));
  const tiers = {
    standart: fmt(find("standart")?.yearlyMonthly ?? 299),
    pro: fmt(find("pro")?.yearlyMonthly ?? 699),
    max: fmt(find("max")?.yearlyMonthly ?? 1899),
  };
  return <MotionLanding tiers={tiers} />;
}
