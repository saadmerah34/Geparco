"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { store } from "@/lib/store-config";

const EMPTY = { name: "", company: "", phone: "", email: "", message: "" };

export function ContactForm() {
  const { dict, locale } = useI18n();
  const t = dict.contact;

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept-Language": locale },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setError(t.errorGeneric);
        setStatus("idle");
        return;
      }
      setStatus("done");
      setForm(EMPTY);
    } catch {
      setError(t.errorNetwork);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8">
        <p className="text-4xl">✅</p>
        <h2 className="mt-3 text-xl font-bold text-ink">{t.successTitle}</h2>
        <p className="mt-2 text-muted">
          {t.successBody.replace("{phone}", store.supportPhone)}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-background"
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <h2 className="text-lg font-bold text-ink">{t.formTitle}</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label={t.name}
          required
          requiredLabel={t.required}
          value={form.name}
          onChange={(v) => update("name", v)}
          autoComplete="name"
        />
        <Field
          label={t.company}
          hint={t.companyOptional}
          value={form.company}
          onChange={(v) => update("company", v)}
          autoComplete="organization"
        />
        <Field
          label={t.phone}
          type="tel"
          required
          requiredLabel={t.required}
          value={form.phone}
          onChange={(v) => update("phone", v)}
          autoComplete="tel"
        />
        <Field
          label={t.email}
          type="email"
          hint={t.emailOptional}
          value={form.email}
          onChange={(v) => update("email", v)}
          autoComplete="email"
        />
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium">
          {t.message} <span className="text-danger">*</span>
        </span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder={t.messagePlaceholder}
          className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>

      {error && (
        <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 w-full rounded-xl bg-ink px-5 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {status === "sending" ? t.submitting : t.submit}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  requiredLabel,
  hint,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  requiredLabel?: string;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">
        {label}{" "}
        {required ? (
          <span className="text-danger">*</span>
        ) : hint ? (
          <span className="font-normal text-muted">({hint})</span>
        ) : null}
        {required && requiredLabel && (
          <span className="sr-only"> {requiredLabel}</span>
        )}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
