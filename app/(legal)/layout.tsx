import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <article
          className="mx-auto max-w-3xl px-5 py-16 sm:px-8
            [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-ink
            [&_h2]:font-display [&_h2]:mt-10 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink
            [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-ink/70
            [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_li]:text-ink/70
            [&_a]:font-medium [&_a]:text-brand-dark [&_a]:underline"
        >
          {children}
        </article>
      </main>
      <Footer />
    </>
  );
}
