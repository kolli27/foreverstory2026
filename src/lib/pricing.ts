/**
 * ForeverStory Pricing Configuration
 * All prices in Euro cents for precision
 */

import type { PricingConfig, PricingPlan, SubscriptionPlan } from '@/types';

// ============================================
// Plan Definitions
// ============================================

export const PLANS: Record<SubscriptionPlan, PricingPlan> = {
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    description: 'Ideal zum Kennenlernen',
    durationMonths: 3,
    priceEuroCents: 4900, // €49
    features: [
      '12 wöchentliche Fragen',
      'Schriftliche Antworten',
      'Sprachaufnahme',
      'Mit Familie teilen',
    ],
    includesBook: false,
  },
  STANDARD: {
    id: 'STANDARD',
    name: 'Standard',
    description: 'Unser beliebtestes Paket',
    durationMonths: 6,
    priceEuroCents: 8900, // €89
    features: [
      '26 wöchentliche Fragen',
      'Schriftliche Antworten',
      'Sprachaufnahme',
      'Fotos hinzufügen',
      'Mit Familie teilen',
      '1 Hardcover-Buch inklusive',
    ],
    includesBook: true,
    bookFormat: 'HARDCOVER_STANDARD',
    popular: true,
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Premium',
    description: 'Die vollständige Lebensgeschichte',
    durationMonths: 12,
    priceEuroCents: 14900, // €149
    features: [
      '52 wöchentliche Fragen',
      'Schriftliche Antworten',
      'Sprachaufnahme',
      'Fotos hinzufügen',
      'Mit Familie teilen',
      '1 Premium-Buch mit Schutzumschlag',
      'Bis zu 5 eigene Fragen',
      'Prioritäts-Support',
    ],
    includesBook: true,
    bookFormat: 'HARDCOVER_PREMIUM',
  },
};

// ============================================
// Book Pricing
// ============================================

export const BOOK_PRICES = {
  HARDCOVER_STANDARD: 3900, // €39
  HARDCOVER_PREMIUM: 5900, // €59
  SOFTCOVER: 2400, // €24
} as const;

// ============================================
// Shipping Costs
// ============================================

export const SHIPPING_COSTS = {
  DE: 490, // Germany: €4.90
  AT: 790, // Austria: €7.90
  CH: 1290, // Switzerland: €12.90 (non-EU)
  EU: 990, // Other EU: €9.90
  WORLD: 1990, // Rest of world: €19.90
} as const;

/**
 * Get shipping cost for a country
 */
export function getShippingCost(countryCode: string): number {
  const code = countryCode.toUpperCase();
  
  if (code === 'DE') return SHIPPING_COSTS.DE;
  if (code === 'AT') return SHIPPING_COSTS.AT;
  if (code === 'CH') return SHIPPING_COSTS.CH;
  
  // EU countries
  const euCountries = [
    'BE', 'BG', 'CZ', 'DK', 'EE', 'IE', 'EL', 'ES', 'FR', 'HR',
    'IT', 'CY', 'LV', 'LT', 'LU', 'HU', 'MT', 'NL', 'PL', 'PT',
    'RO', 'SI', 'SK', 'FI', 'SE',
  ];
  
  if (euCountries.includes(code)) return SHIPPING_COSTS.EU;
  
  return SHIPPING_COSTS.WORLD;
}

// ============================================
// Pricing Calculations
// ============================================

/**
 * Calculate monthly price for display
 */
export function getMonthlyPrice(plan: SubscriptionPlan): number {
  const config = PLANS[plan];
  return Math.round(config.priceEuroCents / config.durationMonths);
}

/**
 * Calculate total for a book order
 */
export function calculateBookOrderTotal(params: {
  format: keyof typeof BOOK_PRICES;
  quantity: number;
  countryCode: string;
}): {
  bookPrice: number;
  shippingPrice: number;
  total: number;
} {
  const bookPrice = BOOK_PRICES[params.format] * params.quantity;
  const shippingPrice = getShippingCost(params.countryCode);
  
  return {
    bookPrice,
    shippingPrice,
    total: bookPrice + shippingPrice,
  };
}

/**
 * Format price in Euro for display
 */
export function formatPrice(cents: number, locale: string = 'de-DE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

/**
 * Get full pricing config for frontend
 */
export function getPricingConfig(): PricingConfig {
  return {
    plans: Object.values(PLANS),
    additionalBooks: {
      hardcoverStandard: BOOK_PRICES.HARDCOVER_STANDARD,
      hardcoverPremium: BOOK_PRICES.HARDCOVER_PREMIUM,
      softcover: BOOK_PRICES.SOFTCOVER,
    },
    shipping: {
      germany: SHIPPING_COSTS.DE,
      austria: SHIPPING_COSTS.AT,
      switzerland: SHIPPING_COSTS.CH,
      eu: SHIPPING_COSTS.EU,
    },
  };
}

// ============================================
// Stripe Price IDs (populated from env)
// ============================================

export const STRIPE_PRICE_IDS: Record<SubscriptionPlan, string> = {
  STARTER: process.env.STRIPE_PRICE_STARTER || '',
  STANDARD: process.env.STRIPE_PRICE_STANDARD || '',
  PREMIUM: process.env.STRIPE_PRICE_PREMIUM || '',
};

/**
 * Get Stripe price ID for a plan
 */
export function getStripePriceId(plan: SubscriptionPlan): string {
  const priceId = STRIPE_PRICE_IDS[plan];
  if (!priceId) {
    throw new Error(`Stripe price ID not configured for plan: ${plan}`);
  }
  return priceId;
}
