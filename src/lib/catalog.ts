import type { Locale } from "./i18n/config";

/** English category key -> French label. Keys match `Product.category` in the DB. */
const categoryFr: Record<string, string> = {
  "Fresh Fish": "Poissons frais",
  Shellfish: "Fruits de mer",
  "Crab & Lobster": "Crabe et homard",
  "Smoked & Cured": "Fumés et salaisons",
  Frozen: "Surgelés",
  "Prepared & Ready": "Prêt-à-manger",
  Pantry: "Épicerie",
};

export function categoryLabel(key: string, locale: Locale): string {
  if (locale === "fr") return categoryFr[key] ?? key;
  return key;
}

type Localizable = {
  name: string;
  description: string;
  unit: string;
  nameFr: string;
  descriptionFr: string;
  unitFr: string;
};

/** Pick the localised name/description/unit, falling back to English. */
export function localizeProduct(p: Localizable, locale: Locale) {
  if (locale === "fr") {
    return {
      name: p.nameFr || p.name,
      description: p.descriptionFr || p.description,
      unit: p.unitFr || p.unit,
    };
  }
  return { name: p.name, description: p.description, unit: p.unit };
}
