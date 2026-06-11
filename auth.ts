import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "./lib/prisma";
import { loginSchema } from "./lib/validations/auth";
import { rateLimit, ipFromRequest } from "./lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, request) {
        // Brute-force / credential-stuffing koruması — IP başına 10 deneme/dk
        const ip = ipFromRequest(request as unknown as { headers: Headers });
        if (!rateLimit(`login:${ip}`, 10, 60_000).ok) return null;

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          businessId: user.businessId,
        };
      },
    }),
  ],
});
