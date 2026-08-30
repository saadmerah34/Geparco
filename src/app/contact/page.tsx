import { store, storeHours } from "@/lib/store-config";
import { getI18n } from "@/lib/i18n/server";
import { TruckBackdrop } from "@/components/TruckBackdrop";
import { ContactForm } from "./ContactForm";

export async function generateMetadata() {
  const { dict } = await getI18n();
  return { title: dict.contact.metaTitle };
}

export default async function ContactPage() {
  const { dict, locale } = await getI18n();
  const t = dict.contact;
  const telHref = `tel:${store.supportPhone.replace(/[^\d+]/g, "")}`;

  return (
    <div>
      {/* Header band with the delivery-truck motif. */}
      <section className="relative overflow-hidden border-b border-border bg-sky-soft">
        <TruckBackdrop className="pointer-events-none absolute -bottom-8 -right-12 z-0 hidden w-[42rem] max-w-none text-sky/15 sm:block" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-xl text-muted">{t.intro}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_20rem]">
        <ContactForm />

        <aside className="h-max rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-bold text-ink">{t.orCall}</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                {dict.service.labelAddress}
              </dt>
              <dd className="mt-1 text-foreground">{store.address}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                {dict.checkout.phone}
              </dt>
              <dd className="mt-1">
                <a href={telHref} className="text-primary hover:underline">
                  {store.supportPhone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">
                {dict.checkout.email}
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${store.supportEmail}`}
                  className="text-primary hover:underline"
                >
                  {store.supportEmail}
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted">
            {t.hoursNote.replace("{hours}", storeHours(locale))}
          </p>
        </aside>
      </section>
    </div>
  );
}
