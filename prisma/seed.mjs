import { PrismaClient } from "@prisma/client";
import { products } from "./products.mjs";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${products.length} products...`);
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
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
        active: true,
      },
      create: {
        slug: p.slug,
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
      },
    });
  }
  // Remove catalog products that are no longer in the list, unless an existing
  // order references them (those stay so order history keeps its item names).
  const keep = new Set(products.map((p) => p.slug));
  const stale = await prisma.product.findMany({
    where: { slug: { notIn: [...keep] } },
    include: { _count: { select: { orderItems: true } } },
  });
  const deletable = stale.filter((p) => p._count.orderItems === 0).map((p) => p.id);
  if (deletable.length) {
    await prisma.product.deleteMany({ where: { id: { in: deletable } } });
    console.log(`Removed ${deletable.length} discontinued product(s).`);
  }
  const orphanedButReferenced = stale.length - deletable.length;
  if (orphanedButReferenced > 0) {
    await prisma.product.updateMany({
      where: { slug: { notIn: [...keep] } },
      data: { active: false },
    });
    console.log(
      `Deactivated ${orphanedButReferenced} discontinued product(s) still linked to orders.`,
    );
  }

  const count = await prisma.product.count({ where: { active: true } });
  console.log(`Done. ${count} active products in catalog.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
