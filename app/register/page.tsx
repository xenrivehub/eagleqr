import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Ücretsiz Başlayın"
      subtitle="İşletme hesabınızı oluşturun, 15 dakikada yayında olun."
      footer={
        <>
          Zaten hesabınız var mı?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-dark hover:underline"
          >
            Giriş yapın
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
