import { prisma } from "@/lib/prisma";
import BusinessTable, { type BusinessRow } from "@/components/admin/BusinessTable";

export default async function AdminBusinessesPage() {
  const businesses = await prisma.business.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      users: {
        where: { role: "BUSINESS_OWNER" },
        select: { email: true },
        take: 1,
      },
      _count: { select: { products: true } },
    },
  });

  const rows: BusinessRow[] = businesses.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    status: b.status,
    type: b.type,
    ownerEmail: b.users[0]?.email ?? null,
    productCount: b._count.products,
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">İşletmeler</h1>
      <p className="mt-2 text-ink/60">
        İşletmeleri yönetin — durum (onay/askı) ve tür (tekil/zincir) ayarlayın.
      </p>
      <div className="mt-8">
        <BusinessTable businesses={rows} />
      </div>
    </div>
  );
}
