import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

export const registerSchema = z.object({
  businessName: z
    .string()
    .min(2, "İşletme adı en az 2 karakter olmalı")
    .max(80, "İşletme adı çok uzun"),
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı")
    .max(72, "Şifre en fazla 72 karakter olabilir"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
