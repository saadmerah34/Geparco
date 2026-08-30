import Link from "next/link";
import Image from "next/image";
import { formatMoney } from "@/lib/money";
import { store, storeHours } from "@/lib/store-config";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Highlight = {
  name: string;
  priceCents: number;
  unit: string;
  emoji: string;
};

const telHref = `tel:${store.supportPhone.replace(/[^\d+]/g, "")}`;

const deptMeta = [
  { key: "Fresh Fish", emoji: "🐟" },
  { key: "Shellfish", emoji: "🦐" },
  { key: "Crab & Lobster", emoji: "🦞" },
  { key: "Smoked & Cured", emoji: "🍥" },
  { key: "Frozen", emoji: "🧊" },
  { key: "Prepared & Ready", emoji: "🍢" },
  { key: "Pantry", emoji: "🥫" },
];

const deptCopy: Record<
  string,
  { fr: { name: string; blurb: string }; en: { name: string; blurb: string } }
> = {
  "Fresh Fish": {
    en: { name: "Fresh Fish", blurb: "Salmon, cod, snapper, trout, halibut — whole or filleted to order." },
    fr: { name: "Poissons frais", blurb: "Saumon, morue, vivaneau, truite, flétan — entier ou levé en filets." },
  },
  Shellfish: {
    en: { name: "Shellfish", blurb: "Shrimp, mussels, clams, scallops, squid and octopus." },
    fr: { name: "Fruits de mer", blurb: "Crevettes, moules, palourdes, pétoncles, calmar et poulpe." },
  },
  "Crab & Lobster": {
    en: { name: "Crab & Lobster", blurb: "Live lobster, snow crab clusters, Dungeness, lump crab meat." },
    fr: { name: "Crabe et homard", blurb: "Homard vivant, sections de crabe des neiges, dormeur, chair de crabe." },
  },
  "Smoked & Cured": {
    en: { name: "Smoked & Cured", blurb: "Cold-smoked salmon, smoked trout, salt cod, marinated herring." },
    fr: { name: "Fumés et salaisons", blurb: "Saumon fumé à froid, truite fumée, morue salée, hareng mariné." },
  },
  Frozen: {
    en: { name: "Frozen", blurb: "Portioned fish, seafood medley, crab cakes, shrimp rings." },
    fr: { name: "Surgelés", blurb: "Portions de poisson, mélange de fruits de mer, croquettes, couronnes de crevettes." },
  },
  "Prepared & Ready": {
    en: { name: "Prepared & Ready", blurb: "Seafood chowder, fish cakes, ceviche, sushi platters." },
    fr: { name: "Prêt-à-manger", blurb: "Chaudrée de fruits de mer, galettes de poisson, ceviche, plateaux de sushis." },
  },
  Pantry: {
    en: { name: "Pantry", blurb: "Tinned fish, fish stock, cocktail sauce, nori, spice rubs." },
    fr: { name: "Épicerie", blurb: "Conserves de poisson, fumet, sauce cocktail, nori, mélanges d'épices." },
  },
};

const stepNumbers = ["01", "02", "03"];

export function Landing({
  highlights,
  dict,
  locale,
}: {
  highlights: Highlight[];
  dict: Dictionary;
  locale: Locale;
}) {
  const d = dict;

  return (
    <div className="landing">
      {/* ---- Hero ------------------------------------------------------------
          The brand banner is the hero; we overlay only the two actions. */}
      <section className="relative isolate bg-ink">
        <div className="relative mx-auto aspect-[3/2] w-full max-h-[80vh] max-w-[1600px] sm:aspect-[16/8] lg:aspect-[16/6]">
          <Image
            src="/hero-banner.png"
            alt={d.hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 pb-6 sm:justify-start sm:pb-8">
              <a
                href="#shop"
                className="rounded-xl bg-sky px-7 py-3.5 text-base font-semibold text-ink shadow-lg transition-transform hover:-translate-y-0.5"
              >
                {d.hero.orderNow}
              </a>
              <Link
                href="/contact"
                className="rounded-xl bg-white/10 px-7 py-3.5 text-base font-semibold text-white shadow-lg ring-1 ring-white/50 backdrop-blur transition-colors hover:bg-white/20"
              >
                {d.hero.wholesale}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Today's arrivals ------------------------------------------------ */}
      <section className="border-b border-border bg-sky-soft">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky">
              {d.hero.eyebrow}
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted">{d.hero.lede}</p>
          </div>

          <div data-board className="w-full sm:max-w-sm">
            <a
              href="#shop"
              className="block rounded-2xl bg-white p-6 shadow-[0_18px_50px_-20px_rgba(11,34,51,0.35)] ring-1 ring-ink/10 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-baseline justify-between border-b-2 border-ink/80 pb-2">
                <span className="text-lg font-bold text-ink">
                  {d.board.title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
                  {d.board.freshIn}
                </span>
              </div>
              <ul className="mt-3 divide-y divide-ink/10">
                {highlights.map((h) => (
                  <li
                    key={h.name}
                    className="flex items-center gap-3 py-2.5 text-ink"
                  >
                    <span aria-hidden className="text-xl">
                      {h.emoji}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {h.name}
                    </span>
                    <span className="text-sm font-bold text-accent tabular-nums">
                      {formatMoney(h.priceCents, locale)}
                    </span>
                    <span className="text-[11px] text-ink/50">
                      {d.product.perUnit(h.unit)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-sky">
                {d.board.seeEverything} &rarr;
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* ---- Departments ----------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky">
              {d.departments.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {d.departments.title}
            </h2>
          </div>
          <a
            href="#shop"
            className="text-sm font-semibold text-sky hover:underline"
          >
            {d.departments.shopEverything} &rarr;
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {deptMeta.map((dep) => {
            const copy = deptCopy[dep.key][locale];
            return (
              <a
                key={dep.key}
                href="#shop"
                className="group flex flex-col rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-sky"
              >
                <span
                  aria-hidden
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-soft text-2xl"
                >
                  {dep.emoji}
                </span>
                <h3 className="mt-4 font-bold text-ink">{copy.name}</h3>
                <p className="mt-1 text-sm text-muted">{copy.blurb}</p>
              </a>
            );
          })}
          <a
            href="#shop"
            className="flex flex-col justify-between rounded-2xl bg-ink p-5 text-white transition-transform hover:-translate-y-0.5"
          >
            <span aria-hidden className="text-2xl">
              🧺
            </span>
            <span className="mt-4 font-bold">
              {d.departments.everythingTitle}
              <span className="mt-1 block font-mono text-xs font-normal uppercase tracking-widest text-white/60">
                {d.departments.everythingCta} &rarr;
              </span>
            </span>
          </a>
        </div>
      </section>

      {/* ---- How it works -------------------------------------------------- */}
      <section className="bg-sky-soft">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {d.steps.title}
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            {d.steps.items.map((s, i) => (
              <li key={s.title}>
                <span className="font-mono text-sm font-semibold text-sky">
                  {stepNumbers[i]}
                </span>
                <h3 className="mt-2 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Service area ------------------------------------------------- */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky">
            {d.service.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {d.service.title}
          </h2>
          <p className="mt-4 text-muted">{d.service.body}</p>
          <a
            href={telHref}
            className="mt-5 inline-block font-semibold text-sky hover:underline"
          >
            {d.service.call(store.supportPhone)}
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-bold text-ink">{d.service.counterTitle}</h3>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              [d.service.labelAddress, store.address],
              [d.service.labelHours, storeHours(locale)],
              [d.service.labelPickup, d.service.pickupValue],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-widest text-muted">
                  {k}
                </dt>
                <dd className="text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Closing CTA ------------------------------------------------- */}
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {d.closing.title}
            </h2>
            <p className="mt-2 text-white/70">{d.closing.body}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#shop"
              className="rounded-xl bg-sky px-7 py-3.5 font-semibold text-ink transition-transform hover:-translate-y-0.5"
            >
              {d.closing.orderNow}
            </a>
            <a
              href={telHref}
              className="rounded-xl border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {store.supportPhone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
