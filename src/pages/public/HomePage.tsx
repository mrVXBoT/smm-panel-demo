import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Star,
  Crown,
  Send,
  CheckCircle2,
  Clock,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { formatCents } from '../../core/utils/currency';

export function HomePage() {
  const starsServices = INITIAL_SERVICES.filter((s) => s.platform === 'telegram_stars');
  const premiumServices = INITIAL_SERVICES.filter((s) => s.platform === 'telegram_premium');
  const growthServices = INITIAL_SERVICES.filter((s) => s.platform === 'telegram');

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-sky-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-sky-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[450px] h-[450px] bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <Badge
          variant="outline"
          className="mb-6 px-4 py-1.5 gap-2 text-xs border-sky-500/30 bg-sky-500/10 text-sky-300 rounded-full"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Official Telegram Growth & Digital Assets Store</span>
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
          Supercharge Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">
            Telegram Presence
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
          Automated, high-speed fulfillment for Telegram Stars, official Premium subscriptions, and
          high-retention channel growth.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link to="/services">
            <Button
              size="lg"
              className="gap-2 text-base px-8 py-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-sky-500/25 cursor-pointer"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/app">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 px-8 py-6 rounded-xl border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-100 cursor-pointer font-semibold"
            >
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Go to Customer Panel</span>
            </Button>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-400" />
            <span>Instant Automated Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-400" />
            <span>No Account Passwords Required</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Safe & Confidential</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>24/7 Continuous System</span>
          </div>
        </div>
      </section>

      {/* Featured Service Highlights Showcase */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Direct Offerings
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Popular Telegram Solutions
            </h2>
          </div>
          <Link
            to="/services"
            className="text-sm font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Telegram Stars Card */}
          <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5 group flex flex-col">
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-yellow-500" />
            <CardContent className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Telegram Stars</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Gift stars for bot creators, digital merchandise payments, and Telegram mini-app
                  features.
                </p>

                <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                  {starsServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="flex items-center justify-between text-xs py-1 text-slate-300"
                    >
                      <span className="font-medium truncate pr-2">{srv.name}</span>
                      <span className="font-mono font-bold text-amber-400 shrink-0">
                        {formatCents(srv.fixedPriceCents || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60">
                <Link to="/app/order/new">
                  <Button className="w-full rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 cursor-pointer font-semibold">
                    Order Stars
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Telegram Premium Card */}
          <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group flex flex-col">
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            <CardContent className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Telegram Premium</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Official gift subscription codes. Fast link delivery, double limits, and 4GB cloud
                  uploading.
                </p>

                <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                  {premiumServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="flex items-center justify-between text-xs py-1 text-slate-300"
                    >
                      <span className="font-medium truncate pr-2">{srv.name}</span>
                      <span className="font-mono font-bold text-indigo-400 shrink-0">
                        {formatCents(srv.fixedPriceCents || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60">
                <Link to="/app/order/new">
                  <Button className="w-full rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 cursor-pointer font-semibold">
                    Order Premium
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Telegram Channel Growth Card */}
          <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-sky-500/40 transition-all hover:shadow-xl hover:shadow-sky-500/5 group flex flex-col">
            <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 to-blue-500" />
            <CardContent className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-105 transition-transform">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Channel Growth</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Non-drop channel subscribers, automated post views, and authentic emoji reactions.
                </p>

                <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                  {growthServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="flex items-center justify-between text-xs py-1 text-slate-300"
                    >
                      <span className="font-medium truncate pr-2">{srv.name}</span>
                      <span className="font-mono font-bold text-sky-400 shrink-0">
                        ${((srv.pricePerThousandCents || 0) / 100).toFixed(2)}/1k
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60">
                <Link to="/app/order/new">
                  <Button className="w-full rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 cursor-pointer font-semibold">
                    Order Growth
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 sm:p-12 backdrop-blur-md">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Quality Assurance
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Why Creators & Channels Trust NovaSMM
            </h2>
            <p className="text-slate-400 mt-3 text-base">
              Built specifically for modern Telegram services with speed and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Instant Automated Queue</h4>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Orders enter automated execution within minutes after placement without delays.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Non-Drop Guarantee</h4>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Refill coverage on high-quality member channels with gradual simulated speed.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Zero Account Risk</h4>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Only public channel links or usernames are required. Never share credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discreet Footer Simulation Notice */}
      <footer className="relative z-10 border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <span>NovaSMM Platform • Interactive Sales Demonstration Prototype</span>
      </footer>
    </div>
  );
}
