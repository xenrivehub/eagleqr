import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Yönetici Girişi — Eagle Menu",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ink px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
            Eagle Menu · Admin
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-cream">
            Yönetici Paneli
          </h1>
          <p className="mt-2 text-sm text-cream/60">
            Yalnızca platform yöneticileri içindir.
          </p>
        </div>
        <div className="mt-8 rounded-2xl border border-cream/10 bg-cream p-6 shadow-xl sm:p-8">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
