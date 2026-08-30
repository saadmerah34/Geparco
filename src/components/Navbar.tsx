"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/client";
import { LocaleToggle } from "@/components/LocaleToggle";

export function Navbar() {
  const { count, ready } = useCart();
  const { dict } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span aria-hidden className="text-2xl">🐟</span>
          <span className="tracking-tight">
            Geparco
            <span className="hidden sm:inline font-normal text-muted">
              {" "}· Poissons &amp; fruits de mer
            </span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 sm:gap-2 text-sm">
          <LocaleToggle />
          <Link
            href="/#shop"
            className="px-3 py-2 rounded-lg hover:bg-background transition-colors"
          >
            {dict.nav.shop}
          </Link>
          <Link
            href="/contact"
            className="hidden sm:inline-block px-3 py-2 rounded-lg hover:bg-background transition-colors"
          >
            {dict.nav.contact}
          </Link>
          <Link
            href="/cart"
            className="relative px-3 py-2 rounded-lg hover:bg-background transition-colors font-medium"
          >
            {dict.nav.cart}
            {ready && count > 0 && (
              <span className="ml-1 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-fg">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
