"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

/** Empties the cart once the order-success page is shown. */
export function ClearCartOnMount() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
