import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

// Edge-safe yapılandırma (middleware bunu kullanır — prisma/bcrypt import etmez)
export const authConfig = {
  trustHost: true, // Railway/proxy arkasında host doğrulaması için gerekli
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const path = nextUrl.pathname;

      if (path.startsWith("/admin") || path.startsWith("/dashboard")) {
        return !!user; // rol kontrolü /admin layout'ta yapılır
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.businessId = user.businessId ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
        session.user.businessId = (token.businessId as string | null) ?? null;
      }
      return session;
    },
  },
  providers: [], // gerçek provider auth.ts'te eklenir
} satisfies NextAuthConfig;
