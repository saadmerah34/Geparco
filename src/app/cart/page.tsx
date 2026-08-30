"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/client";
import { formatMoney } from "@/lib/money";
import { store } from "@/lib/store-config";

export default function CartPage() {
  const { lines, subtotalCents, setQuantity, remove, clear, ready } = useCart();
  const { dict, locale } = useI18n();
  const t = dict.cart;

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-muted">{t.loading}</div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="mt-4 text-2xl font-semibold">{t.emptyTitle}</h1>
        <p className="mt-2 text-muted">{t.emptyBody}</p>
        <Link
          href="/#shop"
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-medium text-primary-fg hover:bg-primary-hover"
        >
          {t.browseStore}
        </Link>
      </div>
    );
  }

  const belowMinimum = subtotalCents < store.minOrderCents;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-muted hover:text-danger"
        >
          {t.clear}
        </button>
      </div>

      <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
        {lines.map((l) => (
          <li key={l.productId} className="flex items-center gap-4 p-4">
            <span aria-hidden className="text-3xl">
              {l.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{l.name}</p>
              <p className="text-sm text-muted">
                {formatMoney(l.priceCents, locale)} {dict.product.perUnit(l.unit)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={dict.product.decrease(l.name)}
                onClick={() => setQuantity(l.productId, l.quantity - 1)}
                className="h-8 w-8 rounded-lg border border-border text-lg leading-none hover:bg-background"
              >
                −
              </button>
              <input
                type="number"
                min={0}
                value={l.quantity}
                onChange={(e) =>
                  setQuantity(
                    l.productId,
                    Math.max(0, Number(e.target.value) || 0),
                  )
                }
                className="w-12 rounded-lg border border-border bg-surface px-2 py-1 text-center text-sm"
              />
              <button
                type="button"
                aria-label={dict.product.increase(l.name)}
                onClick={() => setQuantity(l.productId, l.quantity + 1)}
                className="h-8 w-8 rounded-lg border border-border text-lg leading-none hover:bg-background"
              >
                +
              </button>
            </div>

            <div className="w-24 text-right font-semibold tabular-nums">
              {formatMoney(l.priceCents * l.quantity, locale)}
            </div>

            <button
              type="button"
              aria-label={dict.product.remove(l.name)}
              onClick={() => remove(l.productId)}
              className="text-muted hover:text-danger"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <div className="flex justify-between text-sm text-muted">
          <span>{t.subtotal}</span>
          <span className="tabular-nums text-foreground">
            {formatMoney(subtotalCents, locale)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {t.feeNote(formatMoney(store.freeDeliveryThresholdCents, locale))}
        </p>

        {belowMinimum && (
          <p className="mt-3 rounded-lg bg-accent/10 px-3 py-2 text-sm text-foreground">
            {t.minNote(
              formatMoney(store.minOrderCents, locale),
              formatMoney(store.minOrderCents - subtotalCents, locale),
            )}
          </p>
        )}

        <Link
          href="/checkout"
          aria-disabled={belowMinimum}
          className={`mt-4 block rounded-xl px-5 py-3 text-center font-medium text-primary-fg ${
            belowMinimum
              ? "pointer-events-none bg-primary/40"
              : "bg-primary hover:bg-primary-hover"
          }`}
        >
          {t.checkout}
        </Link>
      </div>
    </div>
  );
}
