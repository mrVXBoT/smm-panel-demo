import type { Service } from '../types/models';

export const INITIAL_SERVICES: Service[] = [
  // Telegram Growth
  {
    id: 'srv_tg_subscribers_hq',
    categoryId: 'cat_tg_growth',
    name: 'Telegram Real HQ Subscribers [Non-Drop]',
    description:
      'High quality channel members with gradual simulated delivery and 30-day refill guarantee.',
    platform: 'telegram',
    pricePerThousandCents: 140, // $1.40 per 1k
    minQty: 100,
    maxQty: 50000,
    status: 'active',
    estimatedDeliveryLabel: '10–30 min start • 5k/day',
    features: ['Non-drop guaranteed', 'Safe simulated speed', 'Public & private channels'],
  },
  {
    id: 'srv_tg_views_instant',
    categoryId: 'cat_tg_growth',
    name: 'Telegram Post Views [Instant Auto]',
    description: 'Instant views on the latest 5 or 10 posts with natural read simulation.',
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
    description: 'Balanced organic emoji distribution for posts and announcements.',
    platform: 'telegram',
    pricePerThousandCents: 45, // $0.45 per 1k
    minQty: 50,
    maxQty: 25000,
    status: 'active',
    estimatedDeliveryLabel: '5–15 min start',
    features: ['Random positive mix', 'No channel admin needed'],
  },

  // Telegram Stars
  {
    id: 'srv_tg_stars_50',
    categoryId: 'cat_tg_stars',
    name: '50 Telegram Stars Gift Pack',
    description: 'Direct simulated transfer to any bot or recipient username.',
    platform: 'telegram_stars',
    fixedPriceCents: 110, // $1.10
    minQty: 1,
    maxQty: 10,
    status: 'active',
    estimatedDeliveryLabel: 'Instant simulation',
    features: ['Instant delivery simulation', 'Bot & mini-app ready'],
  },
  {
    id: 'srv_tg_stars_500',
    categoryId: 'cat_tg_stars',
    name: '500 Telegram Stars Gift Pack',
    description: 'Bulk bundle for bot creators and digital product payments.',
    platform: 'telegram_stars',
    fixedPriceCents: 980, // $9.80
    minQty: 1,
    maxQty: 5,
    status: 'active',
    estimatedDeliveryLabel: 'Instant simulation',
    features: ['Tier discount', 'No recipient authorization needed'],
  },

  // Telegram Premium
  {
    id: 'srv_tg_premium_3m',
    categoryId: 'cat_tg_premium',
    name: 'Telegram Premium — 3 Months Gift Code',
    description: 'Simulated 3-month subscription activation via gift code link.',
    platform: 'telegram_premium',
    fixedPriceCents: 1199, // $11.99
    minQty: 1,
    maxQty: 5,
    status: 'active',
    estimatedDeliveryLabel: '1–5 minutes',
    features: ['No password required', 'Official gift code simulation'],
  },
  {
    id: 'srv_tg_premium_12m',
    categoryId: 'cat_tg_premium',
    name: 'Telegram Premium — 12 Months Annual Pass',
    description: 'Simulated 1-year pass with full badge and 4GB cloud features unlocked.',
    platform: 'telegram_premium',
    fixedPriceCents: 2899, // $28.99
    minQty: 1,
    maxQty: 2,
    status: 'active',
    estimatedDeliveryLabel: '1–5 minutes',
    features: ['Best value', 'Instant test code generation'],
  },

  // Fictional Virtual Numbers
  {
    id: 'srv_num_usa_fictional',
    categoryId: 'cat_virtual_numbers',
    name: 'US Fictional Demo Number (+1 555-...)',
    description: 'Simulated 15-minute disposable phone number for demo validation flows.',
    platform: 'virtual_numbers',
    fixedPriceCents: 85, // $0.85
    minQty: 1,
    maxQty: 1,
    status: 'active',
    estimatedDeliveryLabel: 'Instant allocation',
    features: ['Fictional test carrier', 'Simulated SMS reader in UI', 'No real phone number'],
  },
  {
    id: 'srv_num_uk_fictional',
    categoryId: 'cat_virtual_numbers',
    name: 'UK Fictional Demo Number (+44 7700-...)',
    description: 'Simulated UK test line with fictional OTP generator for UI testing.',
    platform: 'virtual_numbers',
    fixedPriceCents: 95, // $0.95
    minQty: 1,
    maxQty: 1,
    status: 'active',
    estimatedDeliveryLabel: 'Instant allocation',
    features: ['Fictional test carrier', '15 min simulated lease'],
  },

  // Instagram
  {
    id: 'srv_ig_followers_fast',
    categoryId: 'cat_instagram',
    name: 'Instagram High-Speed Followers [Simulated]',
    description: 'Simulated profile growth with realistic profile pictures and bio data.',
    platform: 'instagram',
    pricePerThousandCents: 290, // $2.90 per 1k
    minQty: 100,
    maxQty: 25000,
    status: 'active',
    estimatedDeliveryLabel: '15–60 min start',
    features: ['Realistic profiles', 'Gradual delivery'],
  },

  // YouTube
  {
    id: 'srv_yt_views_retention',
    categoryId: 'cat_youtube',
    name: 'YouTube High Retention Views [Simulated]',
    description: 'Simulated organic search and suggested video viewer retention.',
    platform: 'youtube',
    pricePerThousandCents: 380, // $3.80 per 1k
    minQty: 500,
    maxQty: 100000,
    status: 'active',
    estimatedDeliveryLabel: '1–2 hours start',
    features: ['2–4 min watch time simulation', 'Safe speed'],
  },

  // TikTok
  {
    id: 'srv_tt_views_viral',
    categoryId: 'cat_tiktok',
    name: 'TikTok For-You Page Boost Views [Simulated]',
    description: 'Simulated high-velocity algorithmic view pushes for fresh videos.',
    platform: 'tiktok',
    pricePerThousandCents: 80, // $0.80 per 1k
    minQty: 1000,
    maxQty: 500000,
    status: 'active',
    estimatedDeliveryLabel: '5–10 min start',
    features: ['Instant start', 'FYP distribution simulation'],
  },
];
