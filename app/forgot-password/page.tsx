import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Şifremi Unuttum — Eagle Menu",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Şifreni sıfırla"
      subtitle="Kayıtlı e-postanı gir, sıfırlama bağlantısı gönderelim."
      footer={
        <>
          Şifreni hatırladın mı?{" "}
          <Link href="/login" className="font-semibold text-brand-dark hover:underline">
            Giriş yap
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
