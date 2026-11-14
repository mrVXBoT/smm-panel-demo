import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Star,
  Crown,
  PhoneCall,
  Send,
  CreditCard,
  Flame,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MascotCharacter } from '../../components/mascot/MascotCharacter';
import { FloatingSocialTokens } from '../../components/mascot/FloatingElements';
import { INITIAL_CATEGORIES } from '../../core/fixtures/categories';
import { DEMO_CREDENTIALS } from '../../core/fixtures/demoUser';

export function HomePage() {
  return (
    <div className="relative flex-1 flex flex-col overflow-hidden">
      <FloatingSocialTokens />

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <Badge variant="accent" className="mb-6 px-4 py-1.5 gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-spin" />
          <span>Interactive SMM Simulation Suite • Pre-loaded with $87.00 Demo Funds</span>
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Next-Gen Social Growth{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-sky-300 to-brand-accent">
            Storefront Experience
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
          Explore Telegram Stars, Telegram Premium, fictional Virtual Numbers, and algorithmic
          growth channels in a safe, fully-interactive simulated environment.
        </p>

        {/* Mascot Centerpiece */}
        <div className="my-8 relative">
          <MascotCharacter size="lg" mood="idle" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link to="/app">
            <Button
              size="lg"
              className="gap-2.5 text-base px-8 py-6 rounded-2xl shadow-xl shadow-brand-primary/25"
            >
              <Zap className="w-5 h-5 text-slate-950" />
              <span>Launch Customer Demo ($87.00)</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="secondary" size="lg" className="px-7 py-6 rounded-2xl">
              Explore Services
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="px-6 py-6 rounded-2xl text-slate-300">
              Demo Login
            </Button>
          </Link>
        </div>

        {/* Credentials Callout Card */}
        <div className="mt-12 p-4 rounded-2xl bg-brand-surface-dark/90 border border-slate-700/80 max-w-lg w-full text-left shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-primary" />
              Instant Demo Access Credentials
            </span>
            <span className="text-amber-400 font-mono text-[11px] bg-amber-400/10 px-2 py-0.5 rounded">
              Ready to Test
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 text-xs">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 font-medium">Customer Persona ($87.00)</div>
              <div className="text-white font-mono mt-1 font-semibold">
                {DEMO_CREDENTIALS.customer.username}
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Pass: {DEMO_CREDENTIALS.customer.password}
              </div>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 font-medium">Admin Persona</div>
              <div className="text-white font-mono mt-1 font-semibold">
                {DEMO_CREDENTIALS.admin.username}
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Pass: {DEMO_CREDENTIALS.admin.password}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Grid */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">
            Simulated Service Categories
          </h2>
          <p className="mt-2 text-slate-400 text-center max-w-xl text-sm">
            Everything you need to test social storefront workflows, virtual numbers, and simulated
            payments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_CATEGORIES.map((cat) => (
            <Card
              key={cat.id}
              className="hover:border-brand-primary/50 transition-all hover:-translate-y-1 group"
            >
              <CardContent className="p-6 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                      {cat.slug === 'telegram' && <Send className="w-5 h-5" />}
                      {cat.slug === 'telegram_stars' && <Star className="w-5 h-5 text-amber-400" />}
                      {cat.slug === 'telegram_premium' && (
                        <Crown className="w-5 h-5 text-purple-400" />
                      )}
                      {cat.slug === 'virtual_numbers' && (
                        <PhoneCall className="w-5 h-5 text-emerald-400" />
                      )}
                      {![
                        'telegram',
                        'telegram_stars',
                        'telegram_premium',
                        'virtual_numbers',
                      ].includes(cat.slug) && <Flame className="w-5 h-5 text-brand-accent" />}
                    </div>
                    {cat.badge && (
                      <Badge variant="default" className="text-[10px]">
                        {cat.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-brand-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{cat.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-brand-primary font-semibold">
                  <span>Explore category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Simulated Checkout Feature Spotlight */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-surface-dark via-slate-900 to-brand-elevated-dark border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <Badge variant="secondary" className="mb-4">
              Simulated Checkout Architecture
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Safe & Compliant Visa & Mastercard Top-Up Flow
            </h3>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Experience the one-click simulated payment selector with idempotency keys and
              append-only ledger accounting. Clearly labeled demo behavior without any real credit
              cards, CVVs, or gateway integrations.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/app/wallet">
                <Button className="gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Test "Pay by Visa or Mastercard"</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
