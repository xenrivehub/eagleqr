import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Yeni Şifre — Eagle Menu",
  robots: { index: false },
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <AuthShell
      title="Yeni şifre belirle"
      subtitle="Hesabın için yeni bir şifre oluştur."
      footer={
        <Link href="/login" className="font-semibold text-brand-dark hover:underline">
          Giriş sayfasına dön
        </Link>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
