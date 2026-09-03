"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/client";
import { formatMoney } from "@/lib/money";
import type { PublicProduct } from "@/lib/types";

export function ProductCard({ product }: { product: PublicProduct }) {
  const { add, lines, setQuantity } = useCart();
  const { dict, locale } = useI18n();
  const line = lines.find((l) => l.productId === product.id);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      unit: product.unit,
      emoji: product.emoji,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1000);
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-surface overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative flex items-center justify-center aspect-4/3 bg-background text-6xl select-none">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span aria-hidden>{product.emoji}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-medium leading-tight">{product.name}</h3>
        <p className="text-sm text-muted line-clamp-2">{product.description}</p>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <span className="font-semibold">
              {formatMoney(product.priceCents, locale)}
            </span>
            <span className="text-xs text-muted">
              {" "}
              {dict.product.perUnit(product.unit)}
            </span>
          </div>

          {!product.inStock ? (
            <span className="text-xs font-medium text-danger">
              {dict.product.outOfStock}
            </span>
          ) : line ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={dict.product.decrease(product.name)}
                onClick={() => setQuantity(product.id, line.quantity - 1)}
                className="h-8 w-8 rounded-lg border border-border text-lg leading-none hover:bg-background"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold tabular-nums">
                {line.quantity}
              </span>
              <button
                type="button"
                aria-label={dict.product.increase(product.name)}
                onClick={() => setQuantity(product.id, line.quantity + 1)}
                className="h-8 w-8 rounded-lg border border-border text-lg leading-none hover:bg-background"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover transition-colors"
            >
              {justAdded ? dict.product.added : dict.product.add}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
