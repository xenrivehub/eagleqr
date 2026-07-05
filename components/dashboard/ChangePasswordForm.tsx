"use client";

import { useState, type FormEvent } from "react";
import { changePassword } from "@/lib/actions/auth";
import { PasswordField } from "@/components/auth/fields";
import SubmitButton from "@/components/auth/SubmitButton";

export default function ChangePasswordForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const form = e.currentTarget;
    const data = new FormData(form);
    const current = String(data.get("currentPassword"));
    const next = String(data.get("newPassword"));
    const confirm = String(data.get("confirm"));
    if (next !== confirm) {
      setError("Yeni şifreler eşleşmiyor.");
      return;
    }
    setPending(true);
    const res = await changePassword(current, next);
    setPending(false);
    if (res.success) {
      setOk(true);
      form.reset();
    } else {
      setError(res.error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4" noValidate>
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}
      {ok && (
        <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm text-green-800">
          Şifren güncellendi.
        </div>
      )}
      <PasswordField label="Mevcut şifre" name="currentPassword" autoComplete="current-password" placeholder="••••••••" required />
      <PasswordField label="Yeni şifre" name="newPassword" autoComplete="new-password" placeholder="En az 8 karakter" required />
      <PasswordField label="Yeni şifre (tekrar)" name="confirm" autoComplete="new-password" placeholder="••••••••" required />
      <SubmitButton pending={pending}>Şifreyi Güncelle</SubmitButton>
    </form>
  );
}
