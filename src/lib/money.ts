import { intlLocale, defaultLocale, type Locale } from "./i18n/config";

const currency = (process.env.STORE_CURRENCY ?? "cad").toUpperCase();

const formatters: Partial<Record<Locale, Intl.NumberFormat>> = {};

function formatterFor(locale: Locale): Intl.NumberFormat {
  return (formatters[locale] ??= new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency,
  }));
}

/**
 * Format an integer number of cents as a currency string.
 * e.g. formatMoney(2299, "en") -> "$22.99"; formatMoney(2299, "fr") -> "22,99 $"
 */
export function formatMoney(cents: number, locale: Locale = defaultLocale): string {
  return formatterFor(locale).format(cents / 100);
}

export const CURRENCY = currency;
