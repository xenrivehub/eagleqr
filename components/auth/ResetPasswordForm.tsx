"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/actions/auth";
import { PasswordField } from "./fields";
import SubmitButton from "./SubmitButton";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    const confirm = String(form.get("confirm"));
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setPending(true);
    const res = await resetPassword(token, password);
    setPending(false);
    if (res.success) {
      setDone(true);
      setTimeout(() => router.push("/login"), 1800);
    } else {
      setError(res.error);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800">
        Şifren güncellendi. Giriş sayfasına yönlendiriliyorsun…
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}
      <PasswordField label="Yeni şifre" name="password" autoComplete="new-password" placeholder="En az 8 karakter" required />
      <PasswordField label="Yeni şifre (tekrar)" name="confirm" autoComplete="new-password" placeholder="••••••••" required />
      <SubmitButton pending={pending}>Şifreyi güncelle</SubmitButton>
    </form>
  );
}
