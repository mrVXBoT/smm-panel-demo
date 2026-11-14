import { Link } from 'react-router-dom';
import { Check, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export function PricingPage() {
  const tiers = [
    {
      name: 'Starter Tester',
      price: '$0.00',
      period: 'Instant Demo',
      description:
        'Ideal for inspecting UI flows, component states, and simulated order lifecycles.',
      badge: 'Sandbox',
      features: [
        'Pre-loaded $87.00 customer balance',
        'Telegram Stars & Premium simulated codes',
        'Fictional disposable numbers',
        'Simulated Visa / Mastercard checkout',
        'Reset to initial state anytime',
      ],
      cta: 'Explore Customer Portal',
      href: '/app',
      highlight: false,
    },
    {
      name: 'Growth Showcase',
      price: '$87.00',
      period: 'Pre-Funded Seed',
      description:
        'The standard sales demo package highlighting customer engagement & high-velocity ordering.',
      badge: 'Default Persona',
      features: [
        'Includes everything in Starter Tester',
        'High-retention Telegram subscribers & views',
        'Interactive order status transitions',
        'Append-only wallet ledger simulation',
        'Light & Dark theme switching',
        'Dynamic order pricing calculations',
      ],
      cta: 'Open Pre-Funded Demo',
      href: '/app/order/new',
      highlight: true,
    },
    {
      name: 'Operator Admin',
      price: 'Demo Role',
      period: 'Full Privileges',
      description:
        'Full simulation of backend operations, order dispatching, user management, and service toggling.',
      badge: 'Operator Mode',
      features: [
        'Live stats & revenue calculations',
        'Service maintenance & paused toggling',
        'Order status lifecycle manipulation',
        'Simulated payment attempt ledger',
        'Support ticket queue inspection',
      ],
      cta: 'Open Admin Console',
      href: '/admin',
      highlight: false,
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="accent" className="mb-3">
          Simulated Pricing Model
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Transparent Rates & Pre-Funded Personas
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base">
          All balances, rates, and Visa/Mastercard payments are sandbox simulations designed for
          sales demonstrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col justify-between transition-all ${
              tier.highlight
                ? 'border-brand-primary/60 bg-gradient-to-b from-brand-surface-dark to-slate-900 shadow-2xl shadow-brand-primary/10 relative scale-105'
                : 'hover:border-slate-700'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-slate-950 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                Client Demo Profile
              </div>
            )}
            <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-lg text-white">{tier.name}</span>
                  <Badge variant={tier.highlight ? 'default' : 'secondary'} className="text-[10px]">
                    {tier.badge}
                  </Badge>
                </div>

                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {tier.price}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">/ {tier.period}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">{tier.description}</p>

                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  {tier.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link to={tier.href}>
                  <Button
                    variant={tier.highlight ? 'default' : 'secondary'}
                    className="w-full gap-2 text-xs py-5 rounded-xl font-bold"
                  >
                    {tier.highlight ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
