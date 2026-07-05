"use client";

import { useState, type FormEvent } from "react";
import { requestPasswordReset } from "@/lib/actions/auth";
import { TextField } from "./fields";
import SubmitButton from "./SubmitButton";

export default function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(e.currentTarget);
    const res = await requestPasswordReset(String(form.get("email")));
    setPending(false);
    if (res.success) setSent(true);
    else setError(res.error);
  }

  if (sent) {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800">
        Eğer bu e-posta kayıtlıysa, şifre sıfırlama bağlantısı gönderildi. Gelen kutunu (ve spam klasörünü) kontrol et.
        Bağlantı 1 saat geçerlidir.
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
      <TextField
        label="E-posta"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="ornek@isletme.com"
        required
      />
      <SubmitButton pending={pending}>Sıfırlama bağlantısı gönder</SubmitButton>
    </form>
  );
}
