import type { Metadata } from "next";
import { getSeoSettings } from "@/lib/queries/seo";
import { getHomeSections, getPricingConfig } from "@/lib/queries/home";
import SiteNav from "@/components/site/SiteNav";
import Footer from "@/components/site/Footer";
import HomeRenderer from "@/components/site/HomeRenderer";

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

export default async function Home() {
  const [sections, pricing] = await Promise.all([getHomeSections(), getPricingConfig()]);
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <HomeRenderer sections={sections} pricing={pricing} />
      </main>
      <Footer />
    </>
  );
}
