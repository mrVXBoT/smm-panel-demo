import type { ServiceCategory } from '../types/models';

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat_tg_stars',
    name: 'Telegram Stars',
    slug: 'telegram_stars',
    description: 'Direct top-ups and gift packs for bots, mini apps, and digital content.',
    icon: 'Sparkles',
    displayOrder: 1,
    badge: 'Popular',
  },
  {
    id: 'cat_tg_premium',
    name: 'Telegram Premium',
    slug: 'telegram_premium',
    description: 'Official gift subscription passes (3, 6, 12 months) delivered directly.',
    icon: 'Crown',
    displayOrder: 2,
    badge: 'Best Value',
  },
  {
    id: 'cat_tg_growth',
    name: 'Telegram Channel Growth',
    slug: 'telegram',
    description: 'High-retention subscribers, post views, positive reactions, and channel boosts.',
    icon: 'Send',
    displayOrder: 3,
  },
];
