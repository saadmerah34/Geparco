import Link from "next/link";
import { store, storeHours } from "@/lib/store-config";
import { getI18n } from "@/lib/i18n/server";

export async function SiteFooter() {
  const { dict, locale } = await getI18n();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-semibold">
              <span aria-hidden className="text-xl">
                🐟
              </span>
              {store.legalName}
            </div>
            <p className="mt-2 text-sm text-muted">{dict.footer.tagline}</p>
            <div className="mt-4 flex gap-3">
              <a
                href={store.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Geparco · Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5H16.7V4.6c-.29-.04-1.3-.12-2.47-.12-2.44 0-4.11 1.49-4.11 4.22v2.36H7.4V14h2.72v8h3.38z" />
                </svg>
              </a>
              <a
                href={store.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Geparco · TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path d="M16.5 2h-3v13.2a2.7 2.7 0 1 1-2.7-2.7c.28 0 .55.04.8.12V9.5a5.9 5.9 0 0 0-.8-.06A5.75 5.75 0 1 0 16.5 15.2V8.9a7.2 7.2 0 0 0 4.2 1.35V7.2a4.35 4.35 0 0 1-4.2-4.2V2z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-sm text-muted">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground">
              {dict.footer.visitContact}
            </p>
            <p className="mt-3">{store.address}</p>
            <p className="mt-1">{storeHours(locale)}</p>
            <p className="mt-1">
              <a
                href={`tel:${store.supportPhone.replace(/[^\d+]/g, "")}`}
                className="hover:text-primary"
              >
                {store.supportPhone}
              </a>{" "}
              &middot;{" "}
              <a
                href={`mailto:${store.supportEmail}`}
                className="hover:text-primary"
              >
                {store.supportEmail}
              </a>
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/#shop" className="font-semibold hover:text-primary">
                {dict.footer.orderNow} &rarr;
              </Link>
              <Link
                href="/contact"
                className="font-semibold hover:text-primary"
              >
                {dict.footer.contactLink} &rarr;
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-xs text-muted">
          {dict.footer.rights(new Date().getFullYear(), store.legalName)}
        </p>
      </div>
    </footer>
  );
}
