import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";
import DeleteAccountSection from "@/components/dashboard/DeleteAccountSection";

export const metadata = { title: "Hesap & Güvenlik — Eagle Menu" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");

  const pending = await prisma.accountDeletionRequest.findFirst({
    where: { businessId: session.user.businessId, status: "PENDING" },
    select: { id: true },
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
      <h1 className="font-display text-2xl font-bold text-ink">Hesap &amp; Güvenlik</h1>
      <p className="mt-2 text-ink/60">Giriş bilgilerini ve hesap güvenliğini yönet.</p>

      <section className="mt-8 rounded-2xl border border-ink/10 bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Şifre değiştir</h2>
        <p className="mb-5 mt-1 text-sm text-ink/60">
          Giriş e-postan: <span className="font-medium text-ink">{session.user.email}</span>
        </p>
        <ChangePasswordForm />
      </section>

      <section className="mt-6 rounded-2xl border border-red-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-red-700">Hesabı sil</h2>
        <div className="mt-4">
          <DeleteAccountSection hasPending={!!pending} />
        </div>
      </section>
    </div>
  );
}
