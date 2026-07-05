"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { TextField, PasswordField } from "./fields";
import SubmitButton from "./SubmitButton";

export default function LoginForm() {
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

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      <TextField
        label="E-posta"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="ornek@isletme.com"
        required
      />
      <div>
        <PasswordField
          label="Şifre"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
        <div className="mt-1.5 text-right">
          <Link href="/forgot-password" className="text-xs font-medium text-brand-dark hover:underline">
            Şifremi unuttum?
          </Link>
        </div>
      </div>
      <SubmitButton pending={pending}>Giriş Yap</SubmitButton>
    </form>
  );
}
