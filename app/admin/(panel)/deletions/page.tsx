import { prisma } from "@/lib/prisma";
import DeletionRequestActions from "@/components/admin/DeletionRequestActions";

export const metadata = { title: "Hesap Silme İstekleri — Admin" };

function fmt(ts: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(ts);
}

export default async function AdminDeletionsPage() {
  const requests = await prisma.accountDeletionRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      business: {
        select: {
          name: true,
          slug: true,
          plan: true,
          users: { select: { email: true }, take: 1 },
          _count: { select: { products: true } },
        },
      },
    },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Hesap Silme İstekleri</h1>
      <p className="mt-2 text-ink/60">
        İşletmelerin gönderdiği silme talepleri. Onaylarsan işletme ve tüm verileri (görseller dahil) kalıcı silinir.
      </p>

      {requests.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50">
          Bekleyen silme isteği yok.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-ink/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-ink">{r.business.name}</p>
                  <p className="mt-0.5 text-sm text-ink/60">
                    {r.business.users[0]?.email ?? "—"} · /{r.business.slug} · {r.business.plan} · {r.business._count.products} ürün
                  </p>
                  <p className="mt-1 text-xs text-ink/45">Talep: {fmt(r.createdAt)}</p>
                  {r.reason && (
                    <p className="mt-2 rounded-lg bg-ink/5 px-3 py-2 text-sm text-ink/70">
                      <span className="font-medium">Gerekçe:</span> {r.reason}
                    </p>
                  )}
                </div>
                <DeletionRequestActions requestId={r.id} businessName={r.business.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
