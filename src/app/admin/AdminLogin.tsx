"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function AdminLogin() {
  const [state, formAction, pending] = useActionState(login, null as
    | { error: string }
    | null);

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-semibold">Staff sign in</h1>
      <p className="mt-1 text-sm text-muted">
        Enter the admin password to view orders.
      </p>
      <form action={formAction} className="mt-6 space-y-3">
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="Password"
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        {state?.error && (
          <p className="text-sm text-danger">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-primary px-5 py-3 font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-50"
        >
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
