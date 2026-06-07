import { notFound } from "next/navigation";
import { getPageForEdit } from "@/lib/queries/pages";
import PageEditor from "@/components/admin/PageEditor";

type Params = { params: Promise<{ id: string }> };

export default async function EditPagePage({ params }: Params) {
  const { id } = await params;
  const page = await getPageForEdit(id);
  if (!page) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8">
      <PageEditor
        id={page.id}
        initial={{
          title: page.title,
          slug: page.slug,
          seoTitle: page.seoTitle ?? "",
          seoDescription: page.seoDescription ?? "",
          status: page.status,
          blocks: page.blocks,
        }}
      />
    </div>
  );
}
