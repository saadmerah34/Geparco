export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";
export const LOCALE_COOKIE = "geparco_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "fr" || value === "en";
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** Locale to use with Intl.NumberFormat / Intl.DateTimeFormat. */
export const intlLocale: Record<Locale, string> = {
  fr: "fr-CA",
  en: "en-CA",
};
