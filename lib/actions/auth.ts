"use server";

import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  type RegisterInput,
} from "@/lib/validations/auth";
import { slugify } from "@/lib/slug";
import { rateLimit, ipFromRequest } from "@/lib/rate-limit";
import { sendEmail, renderPasswordResetEmail } from "@/lib/email";

type RegisterResult =
  | { success: true }
  | { success: false; error: string };

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "isletme";
  let slug = base;
  let n = 1;
  while (await prisma.business.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function registerBusiness(
  input: RegisterInput,
): Promise<RegisterResult> {
  // Sahte hesap spam'ini sınırla — IP başına saatte 5 kayıt denemesi
  const ip = ipFromRequest({ headers: await headers() });
  if (!rateLimit(`register:${ip}`, 5, 60 * 60_000).ok) {
    return { success: false, error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." };
  }

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Girilen bilgiler geçersiz." };
  }

  const { businessName, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Bu e-posta zaten kayıtlı." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const slug = await uniqueSlug(businessName);

  await prisma.business.create({
    data: {
      name: businessName,
      slug,
      users: {
        create: {
          email,
          passwordHash,
          role: "BUSINESS_OWNER",
        },
      },
    },
  });

  return { success: true };
}

// ---------------------------------------------------------------------------
// Şifre sıfırlama
// ---------------------------------------------------------------------------

// Uygulama origin'i: önce env, yoksa istek header'ından (proxy arkası dahil).
function appOrigin(h: Headers): string {
  const env = (process.env.NEXTAUTH_URL || process.env.AUTH_URL || "").replace(/\/+$/, "");
  if (env) return env;
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : "";
}

// Şifremi unuttum — mail'e sıfırlama bağlantısı gönderir.
// Güvenlik: e-posta kayıtlı olsa da olmasa da AYNI yanıtı döndürür (enumeration önleme).
export async function requestPasswordReset(email: string): Promise<RegisterResult> {
  const h = await headers();
  const ip = ipFromRequest({ headers: h });
  if (!rateLimit(`pwreset:${ip}`, 5, 60 * 60_000).ok) {
    return { success: false, error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." };
  }

  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) return { success: false, error: "Geçerli bir e-posta girin." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    // Eski aktif token'ları iptal et, yenisini üret
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + 60 * 60_000), // 1 saat
      },
    });
    const resetUrl = `${appOrigin(h)}/reset-password/${token}`;
    const { subject, html } = renderPasswordResetEmail(resetUrl);
    await sendEmail({ to: user.email, subject, html });
  }

  // Her durumda başarı — bilgi sızdırma
  return { success: true };
}

// Token ile yeni şifre belirle.
export async function resetPassword(token: string, password: string): Promise<RegisterResult> {
  const parsed = resetPasswordSchema.safeParse({ token, password });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Geçersiz istek." };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: sha256(parsed.data.token) },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { success: false, error: "Bağlantı geçersiz veya süresi dolmuş. Lütfen yeniden isteyin." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    // Aynı kullanıcının diğer açık token'larını da geçersiz kıl
    prisma.passwordResetToken.deleteMany({ where: { userId: record.userId, usedAt: null } }),
  ]);

  return { success: true };
}

// Giriş yapmış kullanıcının şifresini değiştir (mevcut şifreyle doğrulama).
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<RegisterResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Oturum bulunamadı." };

  const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Geçersiz istek." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { success: false, error: "Kullanıcı bulunamadı." };

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { success: false, error: "Mevcut şifre hatalı." };

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return { success: true };
}
