import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      title="İşletme Girişi"
      subtitle="Menünüzü yönetmek için hesabınıza giriş yapın."
      footer={
        <>
          Hesabınız yok mu?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-dark hover:underline"
          >
            Ücretsiz kayıt olun
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
