import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { loadMenuForManager } from "@/lib/queries/menu";
import MenuManager from "@/components/dashboard/MenuManager";

type Params = { params: Promise<{ menuId: string }> };

export default async function BranchMenuPage({ params }: Params) {
  const { menuId } = await params;
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");

  const menu = await prisma.menu.findFirst({
    where: { id: menuId, businessId: session.user.businessId },
    select: { id: true, name: true, slug: true },
  });
  if (!menu) notFound();

  const { categories, allergens } = await loadMenuForManager(menu.id);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <div className="mb-6">
        <Link
          href="/dashboard/menu"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
          Şubeler
        </Link>
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-brand-dark">
          Şube menüsü · /m/…/{menu.slug}
        </p>
        <h2 className="font-display text-xl font-bold text-ink">{menu.name}</h2>
      </div>
      <MenuManager menuId={menu.id} categories={categories} allergens={allergens} />
    </div>
  );
}
