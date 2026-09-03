import { PrismaClient } from "@prisma/client";
import { products } from "./products.mjs";

// Loads the sample catalogue. Pure upsert (matched by slug): it adds or updates
// the sample products and never deletes anything, so it's safe to run alongside
// products you've added from the /admin dashboard. Use `npm run db:reset` for a
// clean wipe-and-reseed.

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${products.length} sample products...`);
  for (const p of products) {
    const fields = {
      name: p.name,
      description: p.description,
      nameFr: p.nameFr ?? "",
      descriptionFr: p.descriptionFr ?? "",
      unitFr: p.unitFr ?? "",
      priceCents: p.priceCents,
      unit: p.unit,
      category: p.category,
      emoji: p.emoji,
      stock: p.stock ?? 100,
    };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: fields,
      create: { slug: p.slug, ...fields },
    });
  }
  const count = await prisma.product.count();
  console.log(`Done. ${count} products in catalogue.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
