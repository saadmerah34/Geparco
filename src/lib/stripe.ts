import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY?.trim();

/**
 * A Stripe client, or null when no secret key is configured. When null the app
 * runs in DEMO mode: checkout skips Stripe and marks orders paid immediately.
 */
export const stripe = key ? new Stripe(key) : null;

export const isDemoMode = !stripe;
