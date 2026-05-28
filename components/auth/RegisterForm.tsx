"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerBusiness } from "@/lib/actions/auth";
import { registerSchema } from "@/lib/validations/auth";
import { TextField, PasswordField } from "./fields";
import SubmitButton from "./SubmitButton";

type FieldErrors = Partial<Record<"businessName" | "email" | "password", string>>;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const input = {
      businessName: String(form.get("businessName") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const parsed = registerSchema.safeParse(input);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        businessName: flat.businessName?.[0],
        email: flat.email?.[0],
        password: flat.password?.[0],
      });
      return;
    }

    setPending(true);
    const result = await registerBusiness(parsed.data);
    if (!result.success) {
      setError(result.error);
      setPending(false);
      return;
    }

    // kayıt başarılı → otomatik giriş
    const res = await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirect: false,
    });
    if (!res || res.error) {
      // kayıt oldu ama otomatik giriş olmadıysa login'e yönlendir
      router.push("/login");
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
        label="İşletme adı"
        name="businessName"
        autoComplete="organization"
        placeholder="Örnek Cafe"
        required
        error={fieldErrors.businessName}
      />
      <TextField
        label="E-posta"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="ornek@isletme.com"
        required
        error={fieldErrors.email}
      />
      <PasswordField
        label="Şifre"
        name="password"
        autoComplete="new-password"
        placeholder="En az 8 karakter"
        required
        error={fieldErrors.password}
      />
      <SubmitButton pending={pending}>Ücretsiz Hesap Oluştur</SubmitButton>
    </form>
  );
}
