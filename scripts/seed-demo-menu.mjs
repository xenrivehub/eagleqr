import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SLUG = "test-cafe-onur";

const demo = [
  {
    category: "Kahve",
    products: [
      { name: "Single Origin Espresso", description: "Etiyopya Yirgacheffe — yasemin, bergamot ve siyah çikolata notaları.", price: 65, calories: 5, prepMinutes: 3, isFeatured: true, allergens: [] },
      { name: "Flat White", description: "Çift shot ristretto ve buharda pişirilmiş mikro köpük süt ile.", price: 85, calories: 120, prepMinutes: 4, isPopular: true, allergens: ["milk"] },
      { name: "Cappuccino Classico", description: "Eşit oranlarda espresso, süt ve kadife köpük.", price: 80, calories: 110, prepMinutes: 4, allergens: ["milk"] },
    ],
  },
  {
    category: "Soğuk",
    products: [
      { name: "Cold Brew 18h", description: "On sekiz saat demlenmiş, tatlı ve yumuşak içimli soğuk kahve.", price: 95, calories: 15, prepMinutes: 1, isNew: true, allergens: [] },
    ],
  },
  {
    category: "Kahvaltı",
    products: [
      { name: "Avokado Toast", description: "Ekşi maya ekmek üzerinde avokado, kaçak yumurta, kekik ve zeytinyağı.", price: 145, calories: 420, prepMinutes: 10, isFeatured: true, allergens: ["gluten", "eggs"] },
      { name: "Tereyağlı Croissant", description: "Fransız tereyağı ile kat kat açılmış, ev yapımı ahududu reçeli ile.", price: 70, calories: 320, prepMinutes: 2, allergens: ["gluten", "milk"] },
    ],
  },
  {
    category: "Tatlı",
    products: [
      { name: "Çikolata Fondan", description: "Akışkan merkezli sıcak çikolata keki, sade vanilyalı dondurma ile.", price: 120, calories: 480, prepMinutes: 12, isFeatured: true, allergens: ["gluten", "eggs", "milk"] },
      { name: "Frenk Üzümü Cheesecake", description: "New York usulü, ev yapımı frenk üzümü kompostosu ile.", price: 110, calories: 390, prepMinutes: 5, isPopular: true, allergens: ["gluten", "milk", "eggs"] },
    ],
  },
];

async function main() {
  const business = await prisma.business.findUnique({ where: { slug: SLUG } });
  if (!business) throw new Error(`Business not found: ${SLUG}`);

  let menu = await prisma.menu.findFirst({
    where: { businessId: business.id },
    orderBy: { createdAt: "asc" },
  });
  if (!menu) {
    menu = await prisma.menu.create({
      data: { businessId: business.id, name: "Ana Menü", schedule: "ALL_DAY" },
    });
  }

  const allergens = await prisma.allergen.findMany();
  const allergenByCode = new Map(allergens.map((a) => [a.code, a.id]));

  let created = 0;
  let order = 0;
  for (const group of demo) {
    let category = await prisma.category.findFirst({
      where: { menuId: menu.id, name: group.category },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { menuId: menu.id, name: group.category, sortOrder: order },
      });
    }
    order += 1;

    for (const p of group.products) {
      const exists = await prisma.product.findFirst({
        where: { businessId: business.id, name: p.name },
      });
      if (exists) continue;

      await prisma.product.create({
        data: {
          categoryId: category.id,
          businessId: business.id,
          name: p.name,
          description: p.description,
          price: p.price,
          calories: p.calories ?? null,
          prepMinutes: p.prepMinutes ?? null,
          isFeatured: p.isFeatured ?? false,
          isNew: p.isNew ?? false,
          isPopular: p.isPopular ?? false,
          allergens: {
            create: (p.allergens ?? [])
              .map((code) => allergenByCode.get(code))
              .filter(Boolean)
              .map((allergenId) => ({ allergenId })),
          },
        },
      });
      created += 1;
    }
  }

  console.log(`Demo menu seeded. Created ${created} new product(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
