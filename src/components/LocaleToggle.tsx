"use client";

import { useI18n } from "@/lib/i18n/client";
import { locales } from "@/lib/i18n/config";

export function LocaleToggle() {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div
      role="group"
      aria-label={dict.nav.language}
      className="flex items-center rounded-lg border border-border text-xs font-semibold"
    >
      {locales.map((l, i) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`px-2.5 py-1.5 uppercase transition-colors ${
            i === 0 ? "rounded-l-lg" : "rounded-r-lg"
          } ${
            locale === l
              ? "bg-primary text-primary-fg"
              : "text-muted hover:bg-background"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
