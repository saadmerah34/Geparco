import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { formatMoney } from "@/lib/money";
import { store } from "@/lib/store-config";
import { getI18n } from "@/lib/i18n/server";
import { ClearCartOnMount } from "./ClearCartOnMount";

export async function generateMetadata() {
  const { dict } = await getI18n();
  return { title: dict.success.metaTitle };
}

export default async function OrderSuccessPage({
  searchParams,
}: PageProps<"/order/success">) {
  const { locale, dict } = await getI18n();
  const t = dict.success;

  const params = await searchParams;
  const orderId = typeof params.order === "string" ? params.order : undefined;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : undefined;

  if (!orderId) notFound();

  let order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  // Fallback for local testing without a configured webhook: confirm payment
  // straight from the Stripe session.
  if (order.status === "PENDING" && sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        order = await prisma.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
          include: { items: true },
        });
      }
    } catch {
      // Ignore — the webhook will reconcile it.
    }
  }

  const paid = order.status === "PAID";
  const isDelivery = order.deliveryMethod === "delivery";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <ClearCartOnMount />
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="text-5xl">{paid ? "✅" : "🕓"}</p>
        <h1 className="mt-4 text-2xl font-semibold">
          {paid ? t.confirmedTitle : t.receivedTitle}
        </h1>
        <p className="mt-2 text-muted">
          {paid
            ? t.paidBody(order.customerName.split(" ")[0], order.customerEmail)
            : t.pendingBody}
        </p>
        <p className="mt-1 text-sm text-muted">
          {t.orderNo(order.id.slice(-8).toUpperCase())}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-medium">
          {isDelivery ? t.deliveringTo : t.pickupAt}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isDelivery ? order.address : store.address}
        </p>

        <ul className="mt-4 divide-y divide-border border-y border-border">
          {order.items.map((it) => (
            <li key={it.id} className="flex justify-between py-3 text-sm">
              <span>
                {it.name} × {it.quantity}
              </span>
              <span className="tabular-nums">
                {formatMoney(it.priceCents * it.quantity, locale)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between text-muted">
            <span>{t.subtotal}</span>
            <span className="tabular-nums">
              {formatMoney(order.subtotalCents, locale)}
            </span>
          </div>
          <div className="flex justify-between text-muted">
            <span>{isDelivery ? t.delivery : t.pickup}</span>
            <span className="tabular-nums">
              {order.deliveryFeeCents === 0
                ? t.free
                : formatMoney(order.deliveryFeeCents, locale)}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>{t.total}</span>
            <span className="tabular-nums">
              {formatMoney(order.totalCents, locale)}
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/#shop"
        className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-medium text-primary-fg hover:bg-primary-hover"
      >
        {t.continue}
      </Link>
    </div>
  );
}
