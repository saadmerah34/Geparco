import type { Locale } from "./config";

// The English dictionary is the canonical shape; `fr` must match it.
const en = {
  nav: {
    shop: "Shop",
    cart: "Cart",
    contact: "Contact",
    language: "Language",
  },
  contact: {
    metaTitle: "Wholesale & contact",
    eyebrow: "Wholesale & contact",
    title: "Talk to the counter",
    intro:
      "Restaurant, grocer, caterer, or a large home order — tell us what you need and we'll call you back with pricing and lead times. Usually the same business day.",
    formTitle: "Send an enquiry",
    name: "Name",
    company: "Business name",
    companyOptional: "optional",
    phone: "Phone number",
    email: "Email",
    emailOptional: "optional",
    message: "What do you need?",
    messagePlaceholder:
      "Products, quantities, how often, delivery or pickup, target date…",
    submit: "Send enquiry",
    submitting: "Sending…",
    successTitle: "Thanks — we've got it",
    successBody:
      "We'll be in touch by phone shortly. For anything urgent, call {phone}.",
    sendAnother: "Send another enquiry",
    errorGeneric: "Something went wrong. Please try again or call us.",
    errorNetwork: "Network error. Please try again.",
    required: "required",
    orCall: "Or reach us directly",
    hoursNote: "Phone lines: {hours}",
  },
  hero: {
    eyebrow: "Fish & seafood · Montréal",
    headline: "Montréal's fish counter,",
    headlineHighlight: "ordered online",
    lede: "Geparco has supplied the city's kitchens with fish and seafood for years — fresh and frozen, whole fish to prepared plates. Now you can order the same counter from your phone.",
    chips: [
      "Next-day delivery in Montréal",
      "Fresh & frozen",
      "Pickup in Anjou",
    ],
    orderNow: "Order now",
    wholesale: "Wholesale enquiries",
    tagWholesale: "Wholesale + retail",
    tagCut: "Cut to order",
    imageAlt:
      "Geparco delivery truck at the Montréal harbour, with fresh fish and seafood on ice and Geparco shipping boxes",
  },
  board: {
    title: "Today at the counter",
    freshIn: "fresh in",
    seeEverything: "See everything",
  },
  departments: {
    eyebrow: "What we carry",
    title: "Seven departments, one delivery",
    shopEverything: "Shop everything",
    everythingTitle: "Everything from the counter",
    everythingCta: "Start an order",
  },
  steps: {
    title: "Ordering, the easy way",
    items: [
      {
        title: "Browse the counter online",
        body: "Every department, with prices that reflect what's on ice today.",
      },
      {
        title: "Choose delivery or pickup",
        body: "Delivery across Greater Montréal, or collect at our Anjou counter.",
      },
      {
        title: "We pack it fresh",
        body: "Cut, weighed, and boxed cold the day your order goes out.",
      },
    ],
  },
  service: {
    eyebrow: "Where we deliver",
    title: "Across Greater Montréal, next day",
    body: "Restaurants and home cooks on the island and the near suburbs get next-day delivery. Prefer to choose it yourself? The counter in Anjou is open six days a week for pickup and wholesale orders.",
    call: (phone: string) => `Call the counter — ${phone}`,
    counterTitle: "The Anjou counter",
    labelAddress: "Address",
    labelHours: "Hours",
    labelPickup: "Pickup",
    pickupValue: "Ready-to-collect orders, no minimum",
  },
  closing: {
    title: "Not sure where to start?",
    body: "Build a cart from the counter, or call and we'll put the order together with you.",
    orderNow: "Order now",
  },
  shop: {
    title: "Shop fish & seafood",
    searchPlaceholder: "Search products…",
    all: "All",
    noResults: (query: string) => `No products match “${query}”.`,
  },
  product: {
    add: "Add",
    added: "Added ✓",
    outOfStock: "Out of stock",
    perUnit: (unit: string) => `/ ${unit}`,
    decrease: (name: string) => `Decrease ${name}`,
    increase: (name: string) => `Increase ${name}`,
    remove: (name: string) => `Remove ${name}`,
  },
  cart: {
    title: "Your cart",
    loading: "Loading cart…",
    emptyTitle: "Your cart is empty",
    emptyBody: "Add some fish & seafood to get started.",
    browseStore: "Browse the store",
    clear: "Clear cart",
    subtotal: "Subtotal",
    feeNote: (threshold: string) =>
      `Delivery fee and taxes are calculated at checkout. Orders over ${threshold} get free delivery.`,
    minNote: (min: string, missing: string) =>
      `Minimum order is ${min}. Add ${missing} more to check out.`,
    checkout: "Proceed to checkout",
  },
  checkout: {
    title: "Checkout",
    nothingTitle: "Nothing to check out",
    methodLegend: "How would you like to get your order?",
    delivery: "Delivery",
    pickup: "Store pickup",
    detailsLegend: "Your details",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    address: "Delivery address",
    addressPlaceholder: "Street, city, postal code",
    notes: "Order notes (optional)",
    notesPlaceholder: "Gate code, substitutions, etc.",
    summary: "Order summary",
    subtotal: "Subtotal",
    deliveryRow: "Delivery",
    pickupRow: "Pickup",
    free: "Free",
    total: "Total",
    placeOrder: (total: string) => `Place order · ${total}`,
    processing: "Processing…",
    nextStep: "You'll confirm payment on the next step.",
    minWarning: (min: string) => `Minimum order is ${min}.`,
    errorGeneric: "Something went wrong. Please try again.",
    errorNetwork: "Network error. Please try again.",
  },
  success: {
    metaTitle: "Order confirmed",
    confirmedTitle: "Order confirmed!",
    receivedTitle: "Order received",
    paidBody: (firstName: string, email: string) =>
      `Thanks, ${firstName}! We've emailed a receipt to ${email}.`,
    pendingBody:
      "We're waiting for payment to be confirmed. This page will update once it clears.",
    orderNo: (id: string) => `Order #${id}`,
    deliveringTo: "Delivering to",
    pickupAt: "Pickup at store",
    subtotal: "Subtotal",
    delivery: "Delivery",
    pickup: "Pickup",
    free: "Free",
    total: "Total",
    continue: "Continue shopping",
    notFoundTitle: "Order not found",
  },
  footer: {
    tagline:
      "Fish & seafood — fresh and frozen, wholesale and retail, Montréal.",
    visitContact: "Visit & contact",
    orderNow: "Order now",
    contactLink: "Wholesale & contact",
    rights: (year: number, name: string) =>
      `© ${year} ${name} All rights reserved.`,
  },
  emptyCatalog: {
    title: "No products yet",
    body: "Run the seed command to load the sample catalogue.",
  },
};

export type Dictionary = typeof en;

const fr: Dictionary = {
  nav: {
    shop: "Boutique",
    cart: "Panier",
    contact: "Contact",
    language: "Langue",
  },
  contact: {
    metaTitle: "Gros et contact",
    eyebrow: "Gros et contact",
    title: "Parlez au comptoir",
    intro:
      "Restaurant, épicier, traiteur ou grosse commande maison — dites-nous ce qu'il vous faut et on vous rappelle avec les prix et les délais. Habituellement le jour même.",
    formTitle: "Envoyer une demande",
    name: "Nom",
    company: "Nom de l'entreprise",
    companyOptional: "facultatif",
    phone: "Numéro de téléphone",
    email: "Courriel",
    emailOptional: "facultatif",
    message: "Que vous faut-il?",
    messagePlaceholder:
      "Produits, quantités, fréquence, livraison ou cueillette, date visée…",
    submit: "Envoyer la demande",
    submitting: "Envoi…",
    successTitle: "Merci — c'est reçu",
    successBody:
      "On vous rappelle sous peu. Pour une urgence, appelez le {phone}.",
    sendAnother: "Envoyer une autre demande",
    errorGeneric: "Une erreur est survenue. Réessayez ou appelez-nous.",
    errorNetwork: "Erreur réseau. Veuillez réessayer.",
    required: "requis",
    orCall: "Ou joignez-nous directement",
    hoursNote: "Lignes téléphoniques : {hours}",
  },
  hero: {
    eyebrow: "Poissons & fruits de mer · Montréal",
    headline: "Le comptoir de poissons de Montréal,",
    headlineHighlight: "commandé en ligne",
    lede: "Geparco approvisionne les cuisines de la ville en poissons et fruits de mer depuis des années — frais et surgelés, du poisson entier aux plats préparés. Commandez maintenant depuis votre téléphone.",
    chips: [
      "Livraison le lendemain à Montréal",
      "Frais et surgelé",
      "Cueillette à Anjou",
    ],
    orderNow: "Commander",
    wholesale: "Demandes en gros",
    tagWholesale: "Gros et détail",
    tagCut: "Coupé sur mesure",
    imageAlt:
      "Camion de livraison Geparco au port de Montréal, avec poissons et fruits de mer frais sur glace et boîtes d'expédition Geparco",
  },
  board: {
    title: "Aujourd'hui au comptoir",
    freshIn: "arrivage",
    seeEverything: "Voir tout",
  },
  departments: {
    eyebrow: "Ce qu'on offre",
    title: "Sept rayons, une seule livraison",
    shopEverything: "Tout magasiner",
    everythingTitle: "Tout le comptoir",
    everythingCta: "Commencer une commande",
  },
  steps: {
    title: "Commander, tout simplement",
    items: [
      {
        title: "Magasinez le comptoir en ligne",
        body: "Tous les rayons, avec des prix qui reflètent l'arrivage du jour.",
      },
      {
        title: "Choisissez livraison ou cueillette",
        body: "Livraison dans le Grand Montréal, ou cueillette à notre comptoir d'Anjou.",
      },
      {
        title: "On l'emballe frais",
        body: "Coupé, pesé et emballé au froid le jour de l'expédition.",
      },
    ],
  },
  service: {
    eyebrow: "Où l'on livre",
    title: "Partout dans le Grand Montréal, le lendemain",
    body: "Les restaurants et les cuisiniers à la maison sur l'île et en proche banlieue sont livrés le lendemain. Vous préférez choisir vous-même? Le comptoir d'Anjou est ouvert six jours sur sept pour la cueillette et les commandes en gros.",
    call: (phone: string) => `Appelez le comptoir — ${phone}`,
    counterTitle: "Le comptoir d'Anjou",
    labelAddress: "Adresse",
    labelHours: "Heures",
    labelPickup: "Cueillette",
    pickupValue: "Commandes prêtes à emporter, sans minimum",
  },
  closing: {
    title: "Vous ne savez pas par où commencer?",
    body: "Composez votre panier au comptoir, ou appelez-nous et on montera la commande avec vous.",
    orderNow: "Commander",
  },
  shop: {
    title: "Magasiner poissons et fruits de mer",
    searchPlaceholder: "Rechercher un produit…",
    all: "Tous",
    noResults: (query: string) => `Aucun produit ne correspond à « ${query} ».`,
  },
  product: {
    add: "Ajouter",
    added: "Ajouté ✓",
    outOfStock: "Rupture de stock",
    perUnit: (unit: string) => `/ ${unit}`,
    decrease: (name: string) => `Réduire ${name}`,
    increase: (name: string) => `Augmenter ${name}`,
    remove: (name: string) => `Retirer ${name}`,
  },
  cart: {
    title: "Votre panier",
    loading: "Chargement du panier…",
    emptyTitle: "Votre panier est vide",
    emptyBody: "Ajoutez des poissons et fruits de mer pour commencer.",
    browseStore: "Parcourir la boutique",
    clear: "Vider le panier",
    subtotal: "Sous-total",
    feeNote: (threshold: string) =>
      `Les frais de livraison et les taxes sont calculés au paiement. Livraison gratuite pour les commandes de plus de ${threshold}.`,
    minNote: (min: string, missing: string) =>
      `La commande minimale est de ${min}. Ajoutez ${missing} pour passer au paiement.`,
    checkout: "Passer au paiement",
  },
  checkout: {
    title: "Paiement",
    nothingTitle: "Rien à payer",
    methodLegend: "Comment souhaitez-vous recevoir votre commande?",
    delivery: "Livraison",
    pickup: "Cueillette en magasin",
    detailsLegend: "Vos coordonnées",
    fullName: "Nom complet",
    email: "Courriel",
    phone: "Téléphone",
    address: "Adresse de livraison",
    addressPlaceholder: "Rue, ville, code postal",
    notes: "Notes de commande (facultatif)",
    notesPlaceholder: "Code d'accès, substitutions, etc.",
    summary: "Résumé de la commande",
    subtotal: "Sous-total",
    deliveryRow: "Livraison",
    pickupRow: "Cueillette",
    free: "Gratuite",
    total: "Total",
    placeOrder: (total: string) => `Passer la commande · ${total}`,
    processing: "Traitement…",
    nextStep: "Vous confirmerez le paiement à l'étape suivante.",
    minWarning: (min: string) => `La commande minimale est de ${min}.`,
    errorGeneric: "Une erreur est survenue. Veuillez réessayer.",
    errorNetwork: "Erreur réseau. Veuillez réessayer.",
  },
  success: {
    metaTitle: "Commande confirmée",
    confirmedTitle: "Commande confirmée!",
    receivedTitle: "Commande reçue",
    paidBody: (firstName: string, email: string) =>
      `Merci, ${firstName}! Nous avons envoyé un reçu à ${email}.`,
    pendingBody:
      "Nous attendons la confirmation du paiement. Cette page se mettra à jour dès qu'il sera traité.",
    orderNo: (id: string) => `Commande nº ${id}`,
    deliveringTo: "Livraison à",
    pickupAt: "Cueillette au comptoir",
    subtotal: "Sous-total",
    delivery: "Livraison",
    pickup: "Cueillette",
    free: "Gratuite",
    total: "Total",
    continue: "Continuer les achats",
    notFoundTitle: "Commande introuvable",
  },
  footer: {
    tagline:
      "Poissons et fruits de mer — frais et surgelés, gros et détail, Montréal.",
    visitContact: "Visite et contact",
    orderNow: "Commander",
    contactLink: "Gros et contact",
    rights: (year: number, name: string) =>
      `© ${year} ${name} Tous droits réservés.`,
  },
  emptyCatalog: {
    title: "Aucun produit pour l'instant",
    body: "Lancez la commande de peuplement pour charger le catalogue exemple.",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
