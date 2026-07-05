import { prisma } from "@/lib/prisma";

export const metadata = { title: "Denetim Kaydı — Admin" };

// action kodlarını okunur etikete çevir
const ACTION_LABELS: Record<string, string> = {
  "business.status": "İşletme durumu",
  "business.type": "İşletme türü",
  "business.plan": "Plan değişikliği",
  "business.quota": "Medya kotası",
  "business.themeAccess": "Tema erişimi",
  "business.delete": "İşletme silme",
  "business.deleteRequest": "Silme isteği",
  "business.deleteReject": "Silme reddi",
  "plan.limit": "Plan limiti",
  "plan.features": "Plan özellikleri",
  "cron.cleanup": "R2 temizlik",
};

function fmt(ts: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(ts);
}

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { ts: "desc" },
    take: 200,
  });

  const actorIds = [...new Set(logs.map((l) => l.actorId).filter(Boolean) as string[])];
  const actors = actorIds.length
    ? await prisma.user.findMany({ where: { id: { in: actorIds } }, select: { id: true, email: true } })
    : [];
  const actorEmail = new Map(actors.map((a) => [a.id, a.email]));

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Denetim Kaydı</h1>
      <p className="mt-2 text-ink/60">Son 200 yönetici işlemi. Kim, ne zaman, neyi değiştirdi.</p>

      {logs.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/50">
          Henüz kayıt yok.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-semibold">Zaman</th>
                <th className="px-4 py-3 font-semibold">Yönetici</th>
                <th className="px-4 py-3 font-semibold">İşlem</th>
                <th className="px-4 py-3 font-semibold">Hedef</th>
                <th className="px-4 py-3 font-semibold">Ayrıntı</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-ink/5 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-ink/70">{fmt(l.ts)}</td>
                  <td className="px-4 py-3 text-ink/80">{l.actorId ? actorEmail.get(l.actorId) ?? "—" : "sistem"}</td>
                  <td className="px-4 py-3 font-medium text-ink">{ACTION_LABELS[l.action] ?? l.action}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {l.targetType}
                    {l.targetId ? <span className="text-ink/40"> · {l.targetId.slice(0, 8)}</span> : null}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink/50">
                    {Object.keys(l.meta as object).length ? JSON.stringify(l.meta) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
