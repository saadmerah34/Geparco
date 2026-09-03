import { prisma } from "@/lib/prisma";
import { StoreBrowser } from "@/components/StoreBrowser";
import { Landing } from "@/components/Landing";
import { getI18n } from "@/lib/i18n/server";
import { categoryLabel, localizeProduct } from "@/lib/catalog";
import type { PublicProduct } from "@/lib/types";

// Products featured on the "Today at the counter" board, by slug. Any that
// aren't in the catalog are skipped; the board falls back to the first few.
const FEATURED_SLUGS = [
  "atlantic-salmon-fillet",
  "live-lobster",
  "snow-crab-clusters",
  "sea-scallops",
];

// The page reads the visitor's locale cookie, so it renders per request.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { locale, dict } = await getI18n();

  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const publicProducts: PublicProduct[] = products.map((p) => {
    const l = localizeProduct(p, locale);
    return {
      id: p.id,
      slug: p.slug,
      name: l.name,
      description: l.description,
      priceCents: p.priceCents,
      unit: l.unit,
      category: p.category,
      categoryLabel: categoryLabel(p.category, locale),
      emoji: p.emoji,
      imageUrl: p.imageUrl,
      inStock: p.stock > 0,
    };
  });

  if (publicProducts.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">{dict.emptyCatalog.title}</h1>
        <p className="mt-2 text-muted">{dict.emptyCatalog.body}</p>
      </div>
    );
  }

  const bySlug = new Map(publicProducts.map((p) => [p.slug, p]));
  const featured = FEATURED_SLUGS.map((s) => bySlug.get(s)).filter(
    (p): p is PublicProduct => Boolean(p),
  );
  const highlights = (featured.length >= 4 ? featured : publicProducts)
    .slice(0, 4)
    .map((p) => ({
      name: p.name,
      priceCents: p.priceCents,
      unit: p.unit,
      emoji: p.emoji,
    }));

  return (
    <>
      <Landing highlights={highlights} dict={dict} locale={locale} />
      <div id="shop" className="scroll-mt-20">
        <StoreBrowser products={publicProducts} />
      </div>
    </>
  );
}
