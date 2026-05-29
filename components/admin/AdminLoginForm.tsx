"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, getSession } from "next-auth/react";
import { TextField, PasswordField } from "@/components/auth/fields";
import SubmitButton from "@/components/auth/SubmitButton";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });

    if (!res || res.error) {
      setError("E-posta veya şifre hatalı.");
      setPending(false);
      return;
    }

    const session = await getSession();
    if (session?.user?.role !== "SUPER_ADMIN") {
      await signOut({ redirect: false });
      setError("Bu alana erişim yetkiniz yok.");
      setPending(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}
      <TextField label="E-posta" name="email" type="email" autoComplete="email" placeholder="admin@eagleqr.com" required />
      <PasswordField label="Şifre" name="password" autoComplete="current-password" placeholder="••••••••" required />
      <SubmitButton pending={pending}>Yönetici Girişi</SubmitButton>
    </form>
  );
}
