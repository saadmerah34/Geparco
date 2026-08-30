"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/lib/i18n/client";
import type { PublicProduct } from "@/lib/types";

const ALL = "__all__";

export function StoreBrowser({ products }: { products: PublicProduct[] }) {
  const { dict } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  // Category key -> localised label, in a stable order.
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) {
      if (!map.has(p.category)) map.set(p.category, p.categoryLabel);
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [products, query, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">{dict.shop.title}</h1>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.shop.searchPlaceholder}
          className="w-full sm:w-72 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {[[ALL, dict.shop.all] as const, ...categories].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(key)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
              category === key
                ? "border-primary bg-primary text-primary-fg"
                : "border-border bg-surface hover:bg-background"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted">
          {dict.shop.noResults(query)}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
