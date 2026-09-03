/** Plain product shape passed from server components to the client, already
 *  resolved to the active locale. */
export type PublicProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  unit: string;
  /** Stable English category key, used for filtering. */
  category: string;
  /** Localised category label, used for display. */
  categoryLabel: string;
  emoji: string;
  /** Product photo URL, or "" to fall back to the emoji. */
  imageUrl: string;
  inStock: boolean;
};
