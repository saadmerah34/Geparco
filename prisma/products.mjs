// Sample catalog for Geparco Inc. — Poissons & fruits de mer / Fish & Seafood.
// Prices are in Canadian cents (CAD). Placeholder prices — replace this list with
// Geparco's real price sheet, then run `npm run db:seed`.
// Each item carries English (name/description/unit) and French (nameFr/descriptionFr/unitFr).

export const categories = [
  "Fresh Fish",
  "Shellfish",
  "Crab & Lobster",
  "Smoked & Cured",
  "Frozen",
  "Prepared & Ready",
  "Pantry",
];

// English category -> French label (used for the shop filter pills).
export const categoryLabelsFr = {
  "Fresh Fish": "Poissons frais",
  Shellfish: "Fruits de mer",
  "Crab & Lobster": "Crabe et homard",
  "Smoked & Cured": "Fumés et salaisons",
  Frozen: "Surgelés",
  "Prepared & Ready": "Prêt-à-manger",
  Pantry: "Épicerie",
};

export const products = [
  // Fresh Fish
  { slug: "atlantic-salmon-fillet", name: "Atlantic Salmon Fillet", nameFr: "Filet de saumon de l'Atlantique", description: "Fresh skin-on salmon fillet, boneless. Sold by weight.", descriptionFr: "Filet de saumon frais avec peau, sans arêtes. Vendu au poids.", priceCents: 2299, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🐟", stock: 60 },
  { slug: "red-snapper-whole", name: "Whole Red Snapper", nameFr: "Vivaneau rouge entier", description: "Whole red snapper, scaled and gutted. Great grilled or baked.", descriptionFr: "Vivaneau rouge entier, écaillé et vidé. Excellent grillé ou au four.", priceCents: 1699, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🐠", stock: 40 },
  { slug: "atlantic-cod-loin", name: "Atlantic Cod Loin", nameFr: "Longe de morue de l'Atlantique", description: "Thick-cut cod loin, skinless and boneless.", descriptionFr: "Longe de morue épaisse, sans peau ni arêtes.", priceCents: 1899, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🐟", stock: 50 },
  { slug: "rainbow-trout", name: "Rainbow Trout", nameFr: "Truite arc-en-ciel", description: "Whole butterflied rainbow trout, pin-boned.", descriptionFr: "Truite arc-en-ciel entière ouverte en portefeuille, désarêtée.", priceCents: 1299, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🐟", stock: 45 },
  { slug: "haddock-fillet", name: "Haddock Fillet", nameFr: "Filet d'aiglefin", description: "Fresh haddock fillet, skinless. Classic for fish & chips.", descriptionFr: "Filet d'aiglefin frais, sans peau. Le classique du fish and chips.", priceCents: 1599, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🐟", stock: 40 },
  { slug: "yellowfin-tuna-steak", name: "Yellowfin Tuna Steak", nameFr: "Steak de thon à nageoires jaunes", description: "Sushi-grade yellowfin tuna steaks, deep red.", descriptionFr: "Steaks de thon à nageoires jaunes qualité sushi, rouge profond.", priceCents: 3299, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🍣", stock: 25 },
  { slug: "sea-bass-fillet", name: "Sea Bass Fillet", nameFr: "Filet de bar", description: "Delicate white sea bass fillet, skin-on.", descriptionFr: "Filet de bar délicat à chair blanche, avec peau.", priceCents: 2599, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🐟", stock: 30 },
  { slug: "mackerel-whole", name: "Whole Mackerel", nameFr: "Maquereau entier", description: "Fresh Atlantic mackerel, cleaned. Rich and oily.", descriptionFr: "Maquereau de l'Atlantique frais, nettoyé. Chair riche et grasse.", priceCents: 899, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🐟", stock: 50 },
  { slug: "tilapia-fillet", name: "Tilapia Fillet", nameFr: "Filet de tilapia", description: "Mild, lean tilapia fillets, boneless and skinless.", descriptionFr: "Filets de tilapia maigres au goût doux, sans peau ni arêtes.", priceCents: 999, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🐟", stock: 70 },
  { slug: "halibut-steak", name: "Halibut Steak", nameFr: "Darne de flétan", description: "Firm, meaty halibut steaks cut bone-in.", descriptionFr: "Darnes de flétan fermes et charnues, avec os.", priceCents: 3599, unit: "lb", unitFr: "lb", category: "Fresh Fish", emoji: "🐟", stock: 20 },

  // Shellfish
  { slug: "black-tiger-shrimp", name: "Black Tiger Shrimp 16/20", nameFr: "Crevettes tigrées 16/20", description: "Large raw shell-on tiger shrimp, deveined.", descriptionFr: "Grosses crevettes tigrées crues en carapace, déveinées.", priceCents: 1899, unit: "lb", unitFr: "lb", category: "Shellfish", emoji: "🦐", stock: 80 },
  { slug: "cooked-salad-shrimp", name: "Cooked Salad Shrimp", nameFr: "Petites crevettes cuites", description: "Small peeled cooked shrimp, ready to eat.", descriptionFr: "Petites crevettes cuites et décortiquées, prêtes à manger.", priceCents: 1299, unit: "lb", unitFr: "lb", category: "Shellfish", emoji: "🦐", stock: 90 },
  { slug: "pei-mussels", name: "P.E.I. Mussels", nameFr: "Moules de l'Î.-P.-É.", description: "Live rope-cultured mussels, 2 lb mesh bag.", descriptionFr: "Moules vivantes d'élevage sur corde, sac filet de 2 lb.", priceCents: 799, unit: "2 lb bag", unitFr: "sac de 2 lb", category: "Shellfish", emoji: "🦪", stock: 60 },
  { slug: "littleneck-clams", name: "Littleneck Clams", nameFr: "Palourdes littleneck", description: "Live hard-shell clams, 2 lb bag. Purge before cooking.", descriptionFr: "Palourdes vivantes à coquille dure, sac de 2 lb. Dégorger avant cuisson.", priceCents: 1099, unit: "2 lb bag", unitFr: "sac de 2 lb", category: "Shellfish", emoji: "🦪", stock: 40 },
  { slug: "sea-scallops", name: "Sea Scallops U/10", nameFr: "Pétoncles géants U/10", description: "Dry-pack jumbo sea scallops, no phosphates.", descriptionFr: "Gros pétoncles géants emballés à sec, sans phosphates.", priceCents: 3799, unit: "lb", unitFr: "lb", category: "Shellfish", emoji: "🐚", stock: 35 },
  { slug: "oysters-dozen", name: "Fresh Oysters (12)", nameFr: "Huîtres fraîches (12)", description: "East-coast oysters, shucked to order. Sold by the dozen.", descriptionFr: "Huîtres de la côte est, écaillées sur commande. Vendues à la douzaine.", priceCents: 2499, unit: "dozen", unitFr: "douzaine", category: "Shellfish", emoji: "🦪", stock: 30 },
  { slug: "calamari-rings", name: "Squid Rings & Tentacles", nameFr: "Anneaux et tentacules de calmar", description: "Cleaned squid, cut into rings. Fresh, never frozen.", descriptionFr: "Calmar nettoyé, coupé en anneaux. Frais, jamais congelé.", priceCents: 1199, unit: "lb", unitFr: "lb", category: "Shellfish", emoji: "🦑", stock: 45 },
  { slug: "octopus-spanish", name: "Spanish Octopus", nameFr: "Poulpe d'Espagne", description: "Whole cleaned octopus, ideal for braising or grilling.", descriptionFr: "Poulpe entier nettoyé, idéal braisé ou grillé.", priceCents: 2199, unit: "lb", unitFr: "lb", category: "Shellfish", emoji: "🐙", stock: 20 },

  // Crab & Lobster
  { slug: "live-lobster", name: "Live Atlantic Lobster", nameFr: "Homard vivant de l'Atlantique", description: "Hard-shell live lobster, 1 – 1.25 lb. Priced each.", descriptionFr: "Homard vivant à carapace dure, 1 à 1,25 lb. Prix à l'unité.", priceCents: 2199, unit: "each", unitFr: "unité", category: "Crab & Lobster", emoji: "🦞", stock: 40 },
  { slug: "lobster-tails", name: "Lobster Tails (2)", nameFr: "Queues de homard (2)", description: "Cold-water lobster tails, 4 – 5 oz, pack of 2.", descriptionFr: "Queues de homard d'eau froide, 4 à 5 oz, paquet de 2.", priceCents: 3299, unit: "2 pack", unitFr: "paquet de 2", category: "Crab & Lobster", emoji: "🦞", stock: 30 },
  { slug: "snow-crab-clusters", name: "Snow Crab Clusters", nameFr: "Sections de crabe des neiges", description: "Cooked & frozen snow crab leg clusters. Just heat.", descriptionFr: "Sections de pattes de crabe des neiges cuites et surgelées. Réchauffer.", priceCents: 2499, unit: "lb", unitFr: "lb", category: "Crab & Lobster", emoji: "🦀", stock: 50 },
  { slug: "dungeness-crab", name: "Whole Dungeness Crab", nameFr: "Crabe dormeur entier", description: "Cooked whole Dungeness crab, cleaned. Priced each.", descriptionFr: "Crabe dormeur entier cuit et nettoyé. Prix à l'unité.", priceCents: 2899, unit: "each", unitFr: "unité", category: "Crab & Lobster", emoji: "🦀", stock: 18 },
  { slug: "lump-crab-meat", name: "Lump Crab Meat", nameFr: "Chair de crabe en morceaux", description: "Pasteurized lump crab meat, 8 oz tub.", descriptionFr: "Chair de crabe en morceaux pasteurisée, contenant de 8 oz.", priceCents: 1999, unit: "8 oz", unitFr: "8 oz", category: "Crab & Lobster", emoji: "🦀", stock: 40 },

  // Smoked & Cured
  { slug: "smoked-salmon", name: "Cold-Smoked Salmon", nameFr: "Saumon fumé à froid", description: "Sliced Nova-style cold-smoked salmon, 200 g.", descriptionFr: "Saumon fumé à froid tranché, style Nova, 200 g.", priceCents: 1499, unit: "200 g", unitFr: "200 g", category: "Smoked & Cured", emoji: "🍥", stock: 55 },
  { slug: "smoked-trout", name: "Hot-Smoked Trout Fillet", nameFr: "Filet de truite fumée à chaud", description: "Flaky peppered hot-smoked trout, 150 g.", descriptionFr: "Truite fumée à chaud poivrée, chair floconneuse, 150 g.", priceCents: 1299, unit: "150 g", unitFr: "150 g", category: "Smoked & Cured", emoji: "🐟", stock: 40 },
  { slug: "smoked-mackerel", name: "Smoked Mackerel Fillets", nameFr: "Filets de maquereau fumé", description: "Whole smoked mackerel fillets, vacuum-sealed pair.", descriptionFr: "Filets entiers de maquereau fumé, paire sous vide.", priceCents: 999, unit: "2 fillets", unitFr: "2 filets", category: "Smoked & Cured", emoji: "🐟", stock: 45 },
  { slug: "salt-cod", name: "Salt Cod (Bacalao)", nameFr: "Morue salée (bacalao)", description: "Boneless salt-dried cod. Soak 24 h before use.", descriptionFr: "Morue salée et séchée sans arêtes. Faire tremper 24 h avant usage.", priceCents: 1799, unit: "lb", unitFr: "lb", category: "Smoked & Cured", emoji: "🐟", stock: 30 },
  { slug: "herring-marinated", name: "Marinated Herring", nameFr: "Hareng mariné", description: "Wine-marinated herring fillets, 250 g jar.", descriptionFr: "Filets de hareng marinés au vin, pot de 250 g.", priceCents: 799, unit: "250 g", unitFr: "250 g", category: "Smoked & Cured", emoji: "🫙", stock: 50 },

  // Frozen
  { slug: "frozen-shrimp-ring", name: "Cooked Shrimp Ring", nameFr: "Couronne de crevettes cuites", description: "Cooked shrimp platter with cocktail sauce, 340 g.", descriptionFr: "Plateau de crevettes cuites avec sauce cocktail, 340 g.", priceCents: 1299, unit: "340 g", unitFr: "340 g", category: "Frozen", emoji: "🦐", stock: 70 },
  { slug: "frozen-salmon-portions", name: "Frozen Salmon Portions", nameFr: "Portions de saumon surgelées", description: "Individually wrapped 6 oz salmon portions, 4-pack.", descriptionFr: "Portions de saumon de 6 oz emballées individuellement, paquet de 4.", priceCents: 2199, unit: "4 pack", unitFr: "paquet de 4", category: "Frozen", emoji: "🐟", stock: 60 },
  { slug: "frozen-basa-fillets", name: "Frozen Basa Fillets", nameFr: "Filets de basa surgelés", description: "Skinless basa fillets, 1 kg bag.", descriptionFr: "Filets de basa sans peau, sac de 1 kg.", priceCents: 1399, unit: "1 kg bag", unitFr: "sac de 1 kg", category: "Frozen", emoji: "🐟", stock: 80 },
  { slug: "breaded-fish-sticks", name: "Breaded Fish Sticks", nameFr: "Bâtonnets de poisson panés", description: "Crispy breaded cod sticks, 700 g box.", descriptionFr: "Bâtonnets de morue panés croustillants, boîte de 700 g.", priceCents: 1099, unit: "700 g", unitFr: "700 g", category: "Frozen", emoji: "🐟", stock: 65 },
  { slug: "frozen-seafood-mix", name: "Seafood Medley", nameFr: "Mélange de fruits de mer", description: "Frozen mix of shrimp, squid, mussels & scallops, 400 g.", descriptionFr: "Mélange surgelé de crevettes, calmar, moules et pétoncles, 400 g.", priceCents: 1199, unit: "400 g", unitFr: "400 g", category: "Frozen", emoji: "🍲", stock: 55 },
  { slug: "frozen-crab-cakes", name: "Maryland-Style Crab Cakes", nameFr: "Croquettes de crabe à la Maryland", description: "Frozen crab cakes, 4 × 90 g.", descriptionFr: "Croquettes de crabe surgelées, 4 × 90 g.", priceCents: 1699, unit: "4 pack", unitFr: "paquet de 4", category: "Frozen", emoji: "🦀", stock: 40 },

  // Prepared & Ready
  { slug: "seafood-chowder", name: "Seafood Chowder", nameFr: "Chaudrée de fruits de mer", description: "House chowder with fish, shrimp & potato, 700 ml.", descriptionFr: "Chaudrée maison au poisson, crevettes et pommes de terre, 700 ml.", priceCents: 1299, unit: "700 ml", unitFr: "700 ml", category: "Prepared & Ready", emoji: "🥣", stock: 30 },
  { slug: "fish-cakes-fresh", name: "Cod & Potato Fish Cakes", nameFr: "Galettes de morue et pomme de terre", description: "Fresh hand-formed fish cakes, pack of 4.", descriptionFr: "Galettes de poisson façonnées à la main, paquet de 4.", priceCents: 999, unit: "4 pack", unitFr: "paquet de 4", category: "Prepared & Ready", emoji: "🥮", stock: 35 },
  { slug: "salmon-burgers", name: "Salmon Burgers", nameFr: "Burgers de saumon", description: "Fresh salmon patties with herbs, pack of 4.", descriptionFr: "Galettes de saumon frais aux herbes, paquet de 4.", priceCents: 1399, unit: "4 pack", unitFr: "paquet de 4", category: "Prepared & Ready", emoji: "🍔", stock: 30 },
  { slug: "ceviche-cup", name: "Shrimp & Fish Ceviche", nameFr: "Ceviche de crevettes et poisson", description: "Citrus-cured ceviche, ready to eat, 250 g.", descriptionFr: "Ceviche mariné aux agrumes, prêt à manger, 250 g.", priceCents: 1199, unit: "250 g", unitFr: "250 g", category: "Prepared & Ready", emoji: "🍋", stock: 25 },
  { slug: "sushi-platter", name: "Assorted Sushi Platter", nameFr: "Plateau de sushis assortis", description: "Chef's selection nigiri & maki, 20 pieces.", descriptionFr: "Sélection du chef de nigiris et makis, 20 morceaux.", priceCents: 2499, unit: "20 pc", unitFr: "20 mcx", category: "Prepared & Ready", emoji: "🍣", stock: 15 },

  // Pantry
  { slug: "tinned-sardines", name: "Sardines in Olive Oil", nameFr: "Sardines à l'huile d'olive", description: "Wild-caught sardines in extra-virgin olive oil, 120 g.", descriptionFr: "Sardines sauvages à l'huile d'olive extra vierge, 120 g.", priceCents: 449, unit: "120 g", unitFr: "120 g", category: "Pantry", emoji: "🥫", stock: 120 },
  { slug: "canned-tuna", name: "Solid White Tuna", nameFr: "Thon blanc entier", description: "Albacore tuna packed in water, 170 g.", descriptionFr: "Thon germon dans l'eau, 170 g.", priceCents: 399, unit: "170 g", unitFr: "170 g", category: "Pantry", emoji: "🥫", stock: 150 },
  { slug: "fish-stock", name: "Fish Stock", nameFr: "Fumet de poisson", description: "Concentrated fish fumet, 1 L carton.", descriptionFr: "Fumet de poisson concentré, carton de 1 L.", priceCents: 599, unit: "1 L", unitFr: "1 L", category: "Pantry", emoji: "🍲", stock: 60 },
  { slug: "cocktail-sauce", name: "Seafood Cocktail Sauce", nameFr: "Sauce cocktail pour fruits de mer", description: "Zesty horseradish cocktail sauce, 350 ml.", descriptionFr: "Sauce cocktail relevée au raifort, 350 ml.", priceCents: 549, unit: "350 ml", unitFr: "350 ml", category: "Pantry", emoji: "🍶", stock: 80 },
  { slug: "cajun-seasoning", name: "Cajun Seafood Rub", nameFr: "Épices cajun pour fruits de mer", description: "Bold Cajun spice blend for fish & shellfish, 120 g.", descriptionFr: "Mélange d'épices cajun corsé pour poissons et fruits de mer, 120 g.", priceCents: 699, unit: "120 g", unitFr: "120 g", category: "Pantry", emoji: "🧂", stock: 70 },
  { slug: "nori-sheets", name: "Roasted Nori Sheets", nameFr: "Feuilles de nori grillées", description: "Sushi-grade roasted seaweed, 10 full sheets.", descriptionFr: "Algues grillées qualité sushi, 10 feuilles entières.", priceCents: 649, unit: "10 sheets", unitFr: "10 feuilles", category: "Pantry", emoji: "🍙", stock: 90 },
];
