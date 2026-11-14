import type { Service } from '../types/models';

export const INITIAL_SERVICES: Service[] = [
  // Telegram Stars
  {
    id: 'srv_tg_stars_50',
    categoryId: 'cat_tg_stars',
    name: '50 Telegram Stars Gift Pack',
    description: 'Instant transfer to any bot, channel or recipient username.',
    platform: 'telegram_stars',
    fixedPriceCents: 110, // $1.10
    minQty: 1,
    maxQty: 20,
    status: 'active',
    estimatedDeliveryLabel: 'Instant Delivery',
    features: ['Instant delivery', 'Bot & mini-app ready', 'Safe & secure'],
  },
  {
    id: 'srv_tg_stars_500',
    categoryId: 'cat_tg_stars',
    name: '500 Telegram Stars Gift Pack',
    description: 'Bulk bundle for bot creators and digital product payments.',
    platform: 'telegram_stars',
    fixedPriceCents: 980, // $9.80
    minQty: 1,
    maxQty: 10,
    status: 'active',
    estimatedDeliveryLabel: 'Instant Delivery',
    features: ['Volume tier savings', 'No recipient authorization needed'],
  },

  // Telegram Premium
  {
    id: 'srv_tg_premium_3m',
    categoryId: 'cat_tg_premium',
    name: 'Telegram Premium — 3 Months Subscription',
    description: 'Direct activation pass delivered via gift link to any Telegram username.',
    platform: 'telegram_premium',
    fixedPriceCents: 1199, // $11.99
    minQty: 1,
    maxQty: 5,
    status: 'active',
    estimatedDeliveryLabel: '1–5 minutes',
    features: ['No password required', 'Official gift code link', 'Fast automated delivery'],
  },
  {
    id: 'srv_tg_premium_12m',
    categoryId: 'cat_tg_premium',
    name: 'Telegram Premium — 12 Months Annual Pass',
    description: 'Full 1-year pass with animated emoji, badge and 4GB upload support.',
    platform: 'telegram_premium',
    fixedPriceCents: 2899, // $28.99
    minQty: 1,
    maxQty: 5,
    status: 'active',
    estimatedDeliveryLabel: '1–5 minutes',
    features: ['Best annual value', 'Instant activation code', 'Full Telegram Premium perks'],
  },

  // Telegram Growth
  {
    id: 'srv_tg_subscribers_hq',
    categoryId: 'cat_tg_growth',
    name: 'Telegram HQ Channel Members [Non-Drop]',
    description:
      'High-quality channel members with natural gradual delivery and 30-day refill guarantee.',
    platform: 'telegram',
    pricePerThousandCents: 140, // $1.40 per 1k
    minQty: 100,
    maxQty: 50000,
    status: 'active',
    estimatedDeliveryLabel: '10–30 min start • 5k/day',
    features: ['Non-drop guaranteed', 'Natural delivery speed', 'Public & private channels'],
  },
  {
    id: 'srv_tg_views_instant',
    categoryId: 'cat_tg_growth',
    name: 'Telegram Post Views [Instant Auto]',
    description: 'Fast views on latest posts with natural read-distribution simulation.',
    platform: 'telegram',
    pricePerThousandCents: 15, // $0.15 per 1k
    minQty: 500,
    maxQty: 200000,
    status: 'active',
    estimatedDeliveryLabel: '0–5 min start',
    features: ['Instant start', 'Geo-distributed', 'Multiple posts supported'],
  },
  {
    id: 'srv_tg_reactions_mixed',
    categoryId: 'cat_tg_growth',
    name: 'Telegram Positive Mixed Reactions (👍🔥❤️)',
    description: 'Organic emoji distribution for posts and announcements.',
    platform: 'telegram',
    pricePerThousandCents: 45, // $0.45 per 1k
    minQty: 50,
    maxQty: 25000,
    status: 'active',
    estimatedDeliveryLabel: '5–15 min start',
    features: ['Positive mix', 'No channel admin needed'],
  },
];
