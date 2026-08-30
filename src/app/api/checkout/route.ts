import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe, isDemoMode } from "@/lib/stripe";
import { CURRENCY, formatMoney } from "@/lib/money";
import { store, deliveryFeeFor } from "@/lib/store-config";
import { normalizeLocale, type Locale } from "@/lib/i18n/config";
import { localizeProduct } from "@/lib/catalog";

const ERRORS = {
  en: {
    badJson: "Invalid request.",
    badForm: "Please check the form and try again.",
    address: "A delivery address is required for delivery orders.",
    unavailable: "One or more items are no longer available.",
    minimum: (amount: string) => `Minimum order is ${amount}.`,
  },
  fr: {
    badJson: "Requête invalide.",
    badForm: "Veuillez vérifier le formulaire et réessayer.",
    address: "Une adresse de livraison est requise pour les commandes en livraison.",
    unavailable: "Un ou plusieurs articles ne sont plus disponibles.",
    minimum: (amount: string) => `La commande minimale est de ${amount}.`,
  },
} satisfies Record<Locale, unknown>;

const DELIVERY_FEE_LABEL: Record<Locale, string> = {
  en: "Delivery fee",
  fr: "Frais de livraison",
};

const bodySchema = z.object({
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(5).max(40),
    address: z.string().trim().max(400).optional().default(""),
    notes: z.string().trim().max(600).optional().default(""),
  }),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(99),
      }),
    )
    .min(1),
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export async function POST(request: Request) {
  const locale = normalizeLocale(request.headers.get("accept-language"));
  const e = ERRORS[locale];

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: e.badJson }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: e.badForm }, { status: 400 });
  }
  const { customer, deliveryMethod, items } = parsed.data;

  if (deliveryMethod === "delivery" && customer.address.trim().length < 6) {
    return NextResponse.json({ error: e.address }, { status: 400 });
  }

  // Re-price everything from the database — never trust client-supplied prices.
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, active: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const lineItems: {
    product: (typeof products)[number];
    quantity: number;
    displayName: string;
    displayUnit: string;
  }[] = [];
  for (const i of items) {
    const product = byId.get(i.productId);
    if (!product) {
      return NextResponse.json({ error: e.unavailable }, { status: 409 });
    }
    const l = localizeProduct(product, locale);
    lineItems.push({
      product,
      quantity: i.quantity,
      displayName: l.name,
      displayUnit: l.unit,
    });
  }

  const subtotalCents = lineItems.reduce(
    (sum, li) => sum + li.product.priceCents * li.quantity,
    0,
  );

  if (subtotalCents < store.minOrderCents) {
    return NextResponse.json(
      { error: e.minimum(formatMoney(store.minOrderCents, locale)) },
      { status: 400 },
    );
  }

  const deliveryFeeCents = deliveryFeeFor(subtotalCents, deliveryMethod);
  const totalCents = subtotalCents + deliveryFeeCents;

  const order = await prisma.order.create({
    data: {
      status: "PENDING",
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      deliveryMethod,
      address: deliveryMethod === "delivery" ? customer.address : "",
      notes: customer.notes,
      subtotalCents,
      deliveryFeeCents,
      totalCents,
      items: {
        create: lineItems.map((li) => ({
          productId: li.product.id,
          name: li.displayName,
          priceCents: li.product.priceCents,
          quantity: li.quantity,
        })),
      },
    },
  });

  // DEMO mode: no Stripe key configured. Mark the order paid immediately.
  if (isDemoMode || !stripe) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });
    return NextResponse.json({
      url: `/order/success?order=${order.id}&demo=1`,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: customer.email,
    line_items: [
      ...lineItems.map((li) => ({
        quantity: li.quantity,
        price_data: {
          currency: CURRENCY.toLowerCase(),
          unit_amount: li.product.priceCents,
          product_data: {
            name: li.displayName,
            description: li.displayUnit,
          },
        },
      })),
      ...(deliveryFeeCents > 0
        ? [
            {
              quantity: 1,
              price_data: {
                currency: CURRENCY.toLowerCase(),
                unit_amount: deliveryFeeCents,
                product_data: { name: DELIVERY_FEE_LABEL[locale] },
              },
            },
          ]
        : []),
    ],
    metadata: { orderId: order.id },
    success_url: `${baseUrl}/order/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
