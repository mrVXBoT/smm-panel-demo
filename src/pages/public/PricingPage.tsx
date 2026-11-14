import { Link } from 'react-router-dom';
import { Check, Zap, ArrowRight, ShieldCheck, Crown, Star, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
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
      icon: Star,
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
      icon: Send,
      features: [
        'HQ Non-drop channel subscribers',
        'Telegram Premium 3-month gift passes',
        'Gradual simulated safe delivery (5k/day)',
        '30-day automatic refill protection',
        'High-retention post views',
        'Direct tracking in client dashboard',
      ],
      cta: 'Order Channel Pro',
      href: '/app/order/new',
      highlight: true,
    },
    {
      name: 'Annual VIP Pass',
      price: '$28.99',
      period: 'Full 1-year pass',
      description: 'Comprehensive Telegram Premium subscription with maximum channel perks.',
      badge: 'Best Value',
      icon: Crown,
      features: [
        '12 Months official Telegram Premium gift link',
        'Double channel limits & 4GB upload size',
        'Exclusive animated emoji & profile badges',
        'Priority queue execution',
        'Dedicated client support queue',
      ],
      cta: 'Get Annual VIP',
      href: '/app/premium',
      highlight: false,
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge
          variant="outline"
          className="mb-4 px-3 py-1 text-xs border-sky-500/30 bg-sky-500/10 text-sky-400"
        >
          Transparent Pricing
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Flexible Pricing for Every Telegram Goal
        </h1>
        <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
          No subscriptions or hidden fees. Fund your account and purchase exactly the Telegram
          growth and digital gifts you need.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <Card
              key={tier.name}
              className={`relative rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                tier.highlight
                  ? 'border-brand-primary/60 bg-gradient-to-b from-brand-surface-dark to-slate-900 shadow-2xl shadow-brand-primary/15 md:-translate-y-2'
                  : 'border-slate-800 bg-brand-surface-dark/80 hover:border-slate-700'
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-primary via-sky-300 to-brand-accent" />
              )}

              <CardContent className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge
                      variant={tier.highlight ? 'default' : 'secondary'}
                      className="text-[10px] font-bold"
                    >
                      {tier.badge}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-[36px] leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="mt-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-xs text-slate-400">{tier.period}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-3 text-xs text-slate-300">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <Link to={tier.href}>
                    <Button
                      variant={tier.highlight ? 'default' : 'outline'}
                      size="lg"
                      className={`w-full py-5 rounded-xl text-xs font-bold gap-2 cursor-pointer ${
                        tier.highlight
                          ? 'shadow-lg shadow-brand-primary/25'
                          : 'border-slate-700 text-slate-200 hover:text-white'
                      }`}
                    >
                      <span>{tier.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="mt-16 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-6">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Full Privacy Guarantee</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Never share passwords or bot administrative privileges.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Automated Processing</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Immediate order pick-up with real-time status updates.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
