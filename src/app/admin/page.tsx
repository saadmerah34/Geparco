import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";
import {
  isAuthed,
  logout,
  setOrderStatus,
  setEnquiryStatus,
  createProduct,
  updateProduct,
  toggleProductActive,
} from "./actions";
import { AdminLogin } from "./AdminLogin";
import { ImageUpload } from "./ImageUpload";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED"] as const;
const ENQUIRY_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;

const CANONICAL_CATEGORIES = [
  "Fresh Fish",
  "Shellfish",
  "Crab & Lobster",
  "Smoked & Cured",
  "Frozen",
  "Prepared & Ready",
  "Pantry",
];

const badgeClass: Record<string, string> = {
  PENDING: "bg-accent/15 text-accent",
  PAID: "bg-primary/15 text-primary",
  FULFILLED: "bg-primary/15 text-primary",
  CANCELLED: "bg-danger/10 text-danger",
  NEW: "bg-accent/15 text-accent",
  CONTACTED: "bg-primary/15 text-primary",
  CLOSED: "bg-background text-muted",
};

type View = "orders" | "enquiries" | "products";

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  if (!(await isAuthed())) {
    return <AdminLogin />;
  }

  const params = await searchParams;
  const view: View =
    params.view === "enquiries"
      ? "enquiries"
      : params.view === "products"
        ? "products"
        : "orders";
  const newEnquiries = await prisma.enquiry.count({ where: { status: "NEW" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm">
          <Tab label="Orders" href="/admin" active={view === "orders"} />
          <Tab
            label="Enquiries"
            href="/admin?view=enquiries"
            active={view === "enquiries"}
            badge={newEnquiries || undefined}
          />
          <Tab
            label="Products"
            href="/admin?view=products"
            active={view === "products"}
          />
        </div>
        <form action={logout}>
          <button className="text-sm text-muted hover:text-danger">
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-6">
        {view === "orders" && (
          <OrdersView
            filter={typeof params.status === "string" ? params.status : undefined}
          />
        )}
        {view === "enquiries" && <EnquiriesView />}
        {view === "products" && <ProductsView />}
      </div>
    </div>
  );
}

async function OrdersView({ filter }: { filter?: string }) {
  const active =
    filter && STATUSES.includes(filter as never) ? filter : undefined;

  const [orders, grouped] = await Promise.all([
    prisma.order.findMany({
      where: active ? { status: active } : undefined,
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 100,
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { totalCents: true },
    }),
  ]);

  const revenue = grouped
    .filter((g) => g.status === "PAID" || g.status === "FULFILLED")
    .reduce((sum, g) => sum + (g._sum.totalCents ?? 0), 0);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Paid revenue" value={formatMoney(revenue)} />
        {STATUSES.map((s) => {
          const g = grouped.find((x) => x.status === s);
          return <Stat key={s} label={s} value={String(g?._count._all ?? 0)} />;
        })}
      </div>

      <div className="mt-4 flex gap-2 text-sm">
        <FilterLink label="All" href="/admin" active={!active} />
        {STATUSES.map((s) => (
          <FilterLink
            key={s}
            label={s}
            href={`/admin?status=${s}`}
            active={active === s}
          />
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-12 text-center text-muted">No orders here yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-surface text-left text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Fulfilment</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Set</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {orders.map((o) => (
                <tr key={o.id} className="align-top">
                  <td className="px-4 py-3">
                    <div className="font-mono">
                      #{o.id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-xs text-muted">
                      {o.createdAt.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{o.customerName}</div>
                    <div className="text-xs text-muted">{o.customerEmail}</div>
                    <div className="text-xs text-muted">{o.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <ul className="space-y-0.5">
                      {o.items.map((it) => (
                        <li key={it.id}>
                          {it.quantity}× {it.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3">
                    <div className="capitalize">{o.deliveryMethod}</div>
                    {o.address && (
                      <div className="text-xs text-muted">{o.address}</div>
                    )}
                    {o.notes && (
                      <div className="text-xs italic text-muted">
                        “{o.notes}”
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatMoney(o.totalCents)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        badgeClass[o.status] ?? "bg-background"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {STATUSES.filter((s) => s !== o.status).map((s) => (
                        <form key={s} action={setOrderStatus}>
                          <input type="hidden" name="id" value={o.id} />
                          <input type="hidden" name="status" value={s} />
                          <button className="rounded-md border border-border px-2 py-1 text-xs hover:bg-background">
                            {s}
                          </button>
                        </form>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

async function EnquiriesView() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  if (enquiries.length === 0) {
    return <p className="mt-12 text-center text-muted">No enquiries yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-surface text-left text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Received</th>
            <th className="px-4 py-3 font-medium">From</th>
            <th className="px-4 py-3 font-medium">Message</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Set</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface">
          {enquiries.map((e) => (
            <tr key={e.id} className="align-top">
              <td className="px-4 py-3 text-xs text-muted">
                {e.createdAt.toLocaleString()}
                <div className="mt-1 uppercase">{e.locale}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{e.name}</div>
                {e.company && (
                  <div className="text-xs text-muted">{e.company}</div>
                )}
                <div className="text-xs text-muted">
                  <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`}>{e.phone}</a>
                </div>
                {e.email && (
                  <div className="text-xs text-muted">
                    <a href={`mailto:${e.email}`}>{e.email}</a>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 max-w-sm whitespace-pre-wrap text-muted">
                {e.message}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    badgeClass[e.status] ?? "bg-background"
                  }`}
                >
                  {e.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {ENQUIRY_STATUSES.filter((s) => s !== e.status).map((s) => (
                    <form key={s} action={setEnquiryStatus}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="status" value={s} />
                      <button className="rounded-md border border-border px-2 py-1 text-xs hover:bg-background">
                        {s}
                      </button>
                    </form>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function ProductsView() {
  const products = await prisma.product.findMany({
    orderBy: [{ active: "desc" }, { category: "asc" }, { name: "asc" }],
  });
  const categories = Array.from(
    new Set([...CANONICAL_CATEGORIES, ...products.map((p) => p.category)]),
  );

  return (
    <div className="space-y-6">
      {/* Add product */}
      <details className="rounded-2xl border border-border bg-surface">
        <summary className="cursor-pointer list-none px-5 py-4 font-semibold">
          + Add a product
        </summary>
        <form action={createProduct} className="border-t border-border p-5">
          <ProductFields categories={categories} />
          <button className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg hover:bg-primary-hover">
            Add product
          </button>
        </form>
      </details>

      {/* Existing products */}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right">Stock</th>
              <th className="px-4 py-3 font-medium">Shown</th>
              <th className="px-4 py-3 font-medium">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {products.map((p) => (
              <tr key={p.id} className={p.active ? "" : "opacity-55"}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <span aria-hidden className="text-lg">
                        {p.emoji}
                      </span>
                    )}
                    <div>
                      <div className="font-medium">{p.name}</div>
                      {p.nameFr && (
                        <div className="text-xs text-muted">{p.nameFr}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{p.category}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {formatMoney(p.priceCents)}
                  <span className="text-xs text-muted"> / {p.unit}</span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{p.stock}</td>
                <td className="px-4 py-3">
                  <form action={toggleProductActive}>
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="active"
                      value={p.active ? "false" : "true"}
                    />
                    <button
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        p.active
                          ? "bg-primary/15 text-primary"
                          : "bg-background text-muted"
                      }`}
                    >
                      {p.active ? "Visible" : "Hidden"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <details>
                    <summary className="cursor-pointer list-none rounded-md border border-border px-2 py-1 text-xs hover:bg-background">
                      Edit
                    </summary>
                    <form
                      action={updateProduct}
                      className="mt-3 w-[min(90vw,32rem)] rounded-xl border border-border p-4"
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <ProductFields categories={categories} product={p} />
                      <button className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-fg hover:bg-primary-hover">
                        Save changes
                      </button>
                    </form>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductFields({
  categories,
  product,
}: {
  categories: string[];
  product?: {
    name: string;
    nameFr: string;
    description: string;
    descriptionFr: string;
    priceCents: number;
    unit: string;
    unitFr: string;
    category: string;
    emoji: string;
    stock: number;
    imageUrl: string;
  };
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <ImageUpload defaultUrl={product?.imageUrl} />

      <Field label="Name (English)" name="name" defaultValue={product?.name} required />
      <Field label="Nom (français)" name="nameFr" defaultValue={product?.nameFr} />

      <label className="block sm:col-span-2">
        <span className="text-xs font-medium text-muted">
          Description (English) <span className="text-danger">*</span>
        </span>
        <textarea
          name="description"
          required
          rows={2}
          defaultValue={product?.description}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-xs font-medium text-muted">Description (français)</span>
        <textarea
          name="descriptionFr"
          rows={2}
          defaultValue={product?.descriptionFr}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </label>

      <Field
        label="Price (e.g. 12.99)"
        name="price"
        type="number"
        step="0.01"
        min="0"
        defaultValue={product ? (product.priceCents / 100).toFixed(2) : undefined}
        required
      />
      <Field
        label="Stock (quantity)"
        name="stock"
        type="number"
        min="0"
        defaultValue={product ? String(product.stock) : "100"}
      />
      <Field
        label="Unit (English, e.g. lb / each)"
        name="unit"
        defaultValue={product?.unit}
        required
      />
      <Field
        label="Unité (français, e.g. lb / unité)"
        name="unitFr"
        defaultValue={product?.unitFr}
      />

      <label className="block">
        <span className="text-xs font-medium text-muted">Category</span>
        <select
          name="category"
          defaultValue={product?.category ?? categories[0]}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <Field
        label="Emoji"
        name="emoji"
        defaultValue={product?.emoji ?? "🐟"}
        maxLength={8}
      />
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  step,
  min,
  maxLength,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  step?: string;
  min?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        step={step}
        min={min}
        maxLength={maxLength}
        className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Tab({
  label,
  href,
  active,
  badge,
}: {
  label: string;
  href: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <a
      href={href}
      className={`rounded-lg px-3 py-2 font-medium ${
        active ? "bg-primary text-primary-fg" : "text-muted hover:bg-background"
      }`}
    >
      {label}
      {badge ? (
        <span className="ml-1.5 rounded-full bg-accent px-1.5 text-xs text-white">
          {badge}
        </span>
      ) : null}
    </a>
  );
}

function FilterLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`rounded-full border px-3 py-1 ${
        active
          ? "border-primary bg-primary text-primary-fg"
          : "border-border bg-surface hover:bg-background"
      }`}
    >
      {label}
    </a>
  );
}
