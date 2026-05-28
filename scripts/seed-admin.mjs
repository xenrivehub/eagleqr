import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const EMAIL = "admin@eagleqr.test";
const PASSWORD = "adminpass123";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (existing) {
    await prisma.user.update({
      where: { email: EMAIL },
      data: { role: "SUPER_ADMIN" },
    });
    console.log(`Updated ${EMAIL} -> SUPER_ADMIN`);
  } else {
    const passwordHash = await bcrypt.hash(PASSWORD, 10);
    await prisma.user.create({
      data: { email: EMAIL, passwordHash, role: "SUPER_ADMIN" },
    });
    console.log(`Created SUPER_ADMIN: ${EMAIL} / ${PASSWORD}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
