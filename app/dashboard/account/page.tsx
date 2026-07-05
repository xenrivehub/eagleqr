import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";

export const metadata = { title: "Hesap & Güvenlik — Eagle Menu" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.businessId) redirect("/login");

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
    </div>
  );
}
