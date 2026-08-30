// Store-wide settings for Geparco Inc.
// Public business details (Montréal fish & seafood distributor). The catalog in
// prisma/products.mjs is still sample data — swap it for the real price list.

import type { Locale } from "./i18n/config";

export const store = {
  name: "Geparco",
  legalName: "Geparco Inc.",
  tagline: "Poissons & fruits de mer — fresh & frozen fish and seafood, Montréal",
  supportEmail: "info@geparco.com",
  supportPhone: "(514) 352-4444",
  address: "7350 boul. Henri-Bourassa Est, Anjou, Montréal, QC H1E 1P2",
  hours: "Monday – Saturday, 9am – 5pm",
  hoursFr: "Lundi – samedi, 9 h – 17 h",
  deliveryAreas: "Delivery across Greater Montréal; pickup at our Anjou counter",

  social: {
    facebook: "https://www.facebook.com/geparco",
    tiktok: "https://www.tiktok.com/@geparco.inc",
  },

  /** Flat delivery fee in cents (CAD). */
  deliveryFeeCents: 995,
  /** Orders at or above this subtotal (in cents) ship free. */
  freeDeliveryThresholdCents: 15000,
  /** Minimum subtotal (in cents) required to check out. */
  minOrderCents: 3000,
} as const;

export function deliveryFeeFor(subtotalCents: number, method: "delivery" | "pickup") {
  if (method === "pickup") return 0;
  if (subtotalCents >= store.freeDeliveryThresholdCents) return 0;
  return store.deliveryFeeCents;
}

/** Opening hours in the given locale. */
export function storeHours(locale: Locale): string {
  return locale === "fr" ? store.hoursFr : store.hours;
}
