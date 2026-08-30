import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";
import {
  isAuthed,
  logout,
  setOrderStatus,
  setEnquiryStatus,
} from "./actions";
import { AdminLogin } from "./AdminLogin";

export const metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED"] as const;
const ENQUIRY_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;

const badgeClass: Record<string, string> = {
  PENDING: "bg-accent/15 text-accent",
  PAID: "bg-primary/15 text-primary",
  FULFILLED: "bg-primary/15 text-primary",
  CANCELLED: "bg-danger/10 text-danger",
  NEW: "bg-accent/15 text-accent",
  CONTACTED: "bg-primary/15 text-primary",
  CLOSED: "bg-background text-muted",
};

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  if (!(await isAuthed())) {
    return <AdminLogin />;
  }

  const params = await searchParams;
  const view = params.view === "enquiries" ? "enquiries" : "orders";
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
        </div>
        <form action={logout}>
          <button className="text-sm text-muted hover:text-danger">
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-6">
        {view === "orders" ? (
          <OrdersView filter={typeof params.status === "string" ? params.status : undefined} />
        ) : (
          <EnquiriesView />
        )}
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
