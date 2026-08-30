"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/client";
import { formatMoney } from "@/lib/money";
import { store, deliveryFeeFor } from "@/lib/store-config";

type DeliveryMethod = "delivery" | "pickup";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotalCents, ready, clear } = useCart();
  const { dict, locale } = useI18n();
  const t = dict.checkout;

  const [method, setMethod] = useState<DeliveryMethod>("delivery");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFeeCents = deliveryFeeFor(subtotalCents, method);
  const totalCents = subtotalCents + deliveryFeeCents;
  const belowMinimum = subtotalCents < store.minOrderCents;

  if (ready && lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">{t.nothingTitle}</h1>
        <Link
          href="/#shop"
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 font-medium text-primary-fg hover:bg-primary-hover"
        >
          {dict.cart.browseStore}
        </Link>
      </div>
    );
  }

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept-Language": locale },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            notes: form.notes,
          },
          deliveryMethod: method,
          items: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
          })),
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? t.errorGeneric);
        setSubmitting(false);
        return;
      }

      // Demo-mode success URLs are internal; Stripe URLs are absolute.
      if (data.url.startsWith("/")) {
        clear();
        router.push(data.url);
      } else {
        window.location.href = data.url;
      }
    } catch {
      setError(t.errorNetwork);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="rounded-2xl border border-border bg-surface p-5">
            <legend className="px-1 text-sm font-medium text-muted">
              {t.methodLegend}
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {(["delivery", "pickup"] as const).map((m) => (
                <label
                  key={m}
                  className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${
                    method === m
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border hover:bg-background"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m}
                    checked={method === m}
                    onChange={() => setMethod(m)}
                    className="sr-only"
                  />
                  {m === "delivery" ? `🚚 ${t.delivery}` : `🏬 ${t.pickup}`}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <legend className="px-1 text-sm font-medium text-muted">
              {t.detailsLegend}
            </legend>

            <Field
              label={t.fullName}
              value={form.name}
              onChange={(v) => update("name", v)}
              required
              autoComplete="name"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t.email}
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                required
                autoComplete="email"
              />
              <Field
                label={t.phone}
                type="tel"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                required
                autoComplete="tel"
              />
            </div>

            {method === "delivery" && (
              <Field
                label={t.address}
                value={form.address}
                onChange={(v) => update("address", v)}
                required
                autoComplete="street-address"
                placeholder={t.addressPlaceholder}
              />
            )}

            <label className="block">
              <span className="text-sm font-medium">{t.notes}</span>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder={t.notesPlaceholder}
              />
            </label>
          </fieldset>

          {error && (
            <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || belowMinimum || !ready}
            className="w-full rounded-xl bg-primary px-5 py-3.5 font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-50"
          >
            {submitting
              ? t.processing
              : t.placeOrder(formatMoney(totalCents, locale))}
          </button>
          <p className="text-center text-xs text-muted">{t.nextStep}</p>
        </form>

        <aside className="h-max rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-medium">{t.summary}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.productId} className="flex justify-between gap-3">
                <span className="text-muted">
                  {l.emoji} {l.name} × {l.quantity}
                </span>
                <span className="tabular-nums">
                  {formatMoney(l.priceCents * l.quantity, locale)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
            <Row label={t.subtotal} value={formatMoney(subtotalCents, locale)} />
            <Row
              label={method === "pickup" ? t.pickupRow : t.deliveryRow}
              value={
                deliveryFeeCents === 0
                  ? t.free
                  : formatMoney(deliveryFeeCents, locale)
              }
            />
            <Row label={t.total} value={formatMoney(totalCents, locale)} bold />
          </div>
          {belowMinimum && (
            <p className="mt-3 text-xs text-danger">
              {t.minWarning(formatMoney(store.minOrderCents, locale))}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${bold ? "font-semibold text-foreground" : "text-muted"}`}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
