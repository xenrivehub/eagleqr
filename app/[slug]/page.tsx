import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPageBySlug, ensureLegalPages } from "@/lib/queries/pages";
import { LEGAL_SLUGS } from "@/lib/legal-defaults";
import SiteNav from "@/components/site/SiteNav";
import Footer from "@/components/site/Footer";
import PageRenderer from "@/components/pages/PageRenderer";

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Sayfa" };
  const published = page.status === "PUBLISHED";
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    alternates: { canonical: `/${slug}` },
    robots: published ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function DynamicPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { preview } = await searchParams;
  let page = await getPageBySlug(slug);
  // Yasal sayfalar henüz oluşmadıysa otomatik oluştur (footer linkleri her zaman çalışsın)
  if (!page && LEGAL_SLUGS.includes(slug)) {
    await ensureLegalPages();
    page = await getPageBySlug(slug);
  }
  if (!page) notFound();

  // Taslak sayfayı sadece admin önizleme modunda görebilir
  if (page.status !== "PUBLISHED") {
    const isPreview = preview === "1";
    const session = isPreview ? await auth() : null;
    if (!isPreview || session?.user?.role !== "SUPER_ADMIN") notFound();
  }

  return (
    <>
      <SiteNav />
      {page.status !== "PUBLISHED" && (
        <div className="bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-900">
          Önizleme — bu sayfa henüz yayında değil (taslak).
        </div>
      )}
      <main className="flex-1">
        <PageRenderer blocks={page.blocks} />
      </main>
      <Footer />
    </>
  );
}
