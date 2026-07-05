import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: Role;
    businessId?: string | null;
  }

  interface Session {
    loginAt?: number; // oturum açılış zamanı (ms) — admin oturum süresi kontrolü
    user: {
      id: string;
      role: Role;
      businessId?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    businessId?: string | null;
    loginAt?: number;
  }
}
