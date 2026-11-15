import { Link } from 'react-router-dom';
import { Check, ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { CardPattern, BrandGlyph } from '../../components/brand/BrandGlyph';
import { PricingAssurances } from '../../features/catalog/components/PricingAssurances';
import './PricingPage.css';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function PricingPage() {
  const tiers = [
    {
      name: 'Starter Growth',
      price: '$1.10',
      period: 'Starting from',
      description: 'Ideal for new channels, bots, and creators testing engagement and gifts.',
      badge: 'Starter',
      kind: 'stars' as const,
      color: 'var(--gold-ink)',
      rgb: '251,191,36',
      artwork: '/images/solution-stars.png',
      features: [
        '50 Telegram Stars direct gift pack',
        'Telegram post views from $0.15/1k',
        'Positive emoji reactions (👍🔥❤️)',
        'Automated fulfillment queue',
        'Zero account credentials required',
      ],
      cta: 'Explore Stars & Views',
      href: '/app/stars',
      highlight: false,
    },
    {
      name: 'Channel Pro',
      price: '$1.40',
      period: 'Per 1,000 members',
      description: 'The premier package for active channels, media communities, and public groups.',
      badge: 'Most Popular',
      kind: 'growth' as const,
      color: 'var(--cyan-ink)',
      rgb: '56,217,239',
      artwork: '/images/solution-growth.png',
      features: [
        'HQ Non-drop channel subscribers',
        'Telegram Premium 3-month gift passes',
        'Gradual delivery preview (5k/day)',
        '30-day automatic refill protection',
        'High-retention post views',
        'Direct tracking in client dashboard',
      ],
      cta: 'Order Channel Pro',
      href: '/app/growth?service=srv_tg_subscribers_hq',
      highlight: true,
    },
    {
      name: 'Annual VIP Pass',
      price: '$28.99',
      period: 'Full 1-year pass',
      description: 'Comprehensive Telegram Premium subscription with maximum channel perks.',
      badge: 'Best Value',
      kind: 'premium' as const,
      color: 'var(--violet-ink)',
      rgb: '184,154,255',
      artwork: '/images/solution-premium.png',
      features: [
        '12 Months official Telegram Premium gift link',
        'Double channel limits & 4GB upload size',
        'Exclusive animated emoji & profile badges',
        'Priority queue execution',
        'Dedicated client support queue',
      ],
      cta: 'Get Annual VIP',
      href: '/app/premium?service=srv_tg_premium_12m',
      highlight: false,
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge
          variant="outline"
          className="mb-4 px-3 py-1 text-xs border-sky-500/30 bg-sky-500/10 text-brand-primary"
        >
          <span className="inline-flex items-center gap-2">
            <BrandGlyph kind="nova" className="brand-glyph-small" /> Transparent Pricing
          </span>
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-text-dark tracking-tight">
          Flexible Pricing for Every Telegram Goal
        </h1>
        <p className="mt-4 text-brand-secondary text-sm sm:text-base leading-relaxed">
          Compare service prices, explore the details and choose your next step.
        </p>
      </div>

      <div className="pricing-collection">
        {tiers.map((tier, index) => (
          <Card
            key={tier.name}
            className={`pricing-plan ${tier.highlight ? 'pricing-plan-featured' : ''}`}
            style={{ '--plan-color': tier.color, '--plan-rgb': tier.rgb } as CSSProperties}
          >
            <CardPattern variant={tier.kind} />
            <div className="pricing-plan-halo" aria-hidden="true" />
            <CardContent className="pricing-plan-body">
              <div className="pricing-plan-top">
                <span className="pricing-plan-index">NOVA / 0{index + 1}</span>
                <span className="pricing-plan-badge">{tier.badge}</span>
              </div>
              <div className="pricing-plan-art">
                <img src={tier.artwork} alt="" width="120" height="120" loading="lazy" />
                <span className="pricing-plan-art-line" aria-hidden="true" />
              </div>
              <div className="pricing-plan-title">
                <h2>{tier.name}</h2>
                <p>{tier.description}</p>
              </div>
              <div className="pricing-plan-price">
                <span>SERVICE RATE</span>
                <div>
                  <strong>{tier.price}</strong>
                  <small>{tier.period}</small>
                </div>
              </div>
              <ul className="pricing-plan-features">
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <Check size={14} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link className="pricing-plan-cta" to={tier.href}>
                <span>{tier.cta}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <PricingAssurances />
    </div>
  );
}
