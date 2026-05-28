"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { slugify } from "@/lib/slug";

type RegisterResult =
  | { success: true }
  | { success: false; error: string };

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
