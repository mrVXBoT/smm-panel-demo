import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Star,
  Crown,
  Send,
  Clock,
  TrendingUp,
  Lock,
  Users,
  MousePointerClick,
  PackageCheck,
  HeartHandshake,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { formatCents } from '../../core/utils/currency';
import { SmoothScroll } from '../../components/animation/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);

  const starsServices = INITIAL_SERVICES.filter((s) => s.platform === 'telegram_stars');
  const premiumServices = INITIAL_SERVICES.filter((s) => s.platform === 'telegram_premium');
  const growthServices = INITIAL_SERVICES.filter((s) => s.platform === 'telegram');

  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.stat-number', {
        textContent: 0,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroll>
      <div
        className="relative flex-1 flex flex-col overflow-hidden text-slate-100"
        style={{ background: '#0B1120' }}
      >
        {/* Background Glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-sky-400/8 blur-[80px]" />
          <div className="absolute bottom-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
          <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-cyan-500/6 blur-[100px]" />
        </div>

        {/* ───── SECTION 1 — Hero ───── */}
        <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-8 tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Official Telegram Growth &amp; Digital Assets Store
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.1]"
            >
              Supercharge Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                Telegram Channel
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed"
            >
              Professional growth services for creators, brands, and channel owners. Automated
              delivery, non-drop guarantee.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-4 mt-10"
            >
              <Link to="/app">
                <Button
                  size="lg"
                  className="gap-2 text-base px-8 py-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start Growing</span>
                </Button>
              </Link>
              <Link to="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 px-8 py-6 rounded-xl border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-600 text-slate-100 cursor-pointer font-semibold transition-all duration-200"
                >
                  <span>View Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium"
            >
              {[
                { icon: <Users className="w-4 h-4 text-cyan-400" />, label: '50K+ Orders Served' },
                {
                  icon: <Shield className="w-4 h-4 text-emerald-400" />,
                  label: 'Non-Drop Guarantee',
                },
                { icon: <Clock className="w-4 h-4 text-indigo-400" />, label: '24/7 Automated' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-slate-400">
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ───── SECTION 2 — Service Category Cards ───── */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="mb-10 text-center"
          >
            <motion.span
              variants={fadeInUp}
              className="text-xs font-bold uppercase tracking-widest text-cyan-400"
            >
              Direct Offerings
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-4xl font-extrabold text-white mt-2"
            >
              Popular Telegram Solutions
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-slate-400 mt-3 text-base max-w-xl mx-auto"
            >
              Premium services with instant automated delivery and guaranteed quality.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Stars Card */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 group flex flex-col h-full cursor-default">
                <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-yellow-500" />
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-6 h-6 fill-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Telegram Stars</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      Gift stars for bot creators, digital merchandise payments, and Telegram
                      mini-app features.
                    </p>
                    <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                      {starsServices.map((srv) => (
                        <div
                          key={srv.id}
                          className="flex items-center justify-between text-xs py-1 text-slate-300"
                        >
                          <span className="font-medium truncate pr-2">{srv.name}</span>
                          <span className="font-mono font-bold text-amber-400 shrink-0">
                            {formatCents(srv.fixedPriceCents ?? 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/60">
                    <Link to="/app/order/new">
                      <Button className="w-full rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 cursor-pointer font-semibold transition-colors duration-200">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Card */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 group flex flex-col h-full cursor-default">
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Crown className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Telegram Premium</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      Official gift subscription codes. Fast link delivery, double limits, and 4GB
                      cloud uploading.
                    </p>
                    <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                      {premiumServices.map((srv) => (
                        <div
                          key={srv.id}
                          className="flex items-center justify-between text-xs py-1 text-slate-300"
                        >
                          <span className="font-medium truncate pr-2">{srv.name}</span>
                          <span className="font-mono font-bold text-indigo-400 shrink-0">
                            {formatCents(srv.fixedPriceCents ?? 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/60">
                    <Link to="/app/order/new">
                      <Button className="w-full rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 cursor-pointer font-semibold transition-colors duration-200">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Growth Card */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group flex flex-col h-full cursor-default">
                <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Send className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Channel Growth</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      Non-drop channel subscribers, automated post views, and authentic emoji
                      reactions.
                    </p>
                    <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                      {growthServices.map((srv) => (
                        <div
                          key={srv.id}
                          className="flex items-center justify-between text-xs py-1 text-slate-300"
                        >
                          <span className="font-medium truncate pr-2">{srv.name}</span>
                          <span className="font-mono font-bold text-cyan-400 shrink-0">
                            ${((srv.pricePerThousandCents ?? 0) / 100).toFixed(2)}/1k
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/60">
                    <Link to="/app/order/new">
                      <Button className="w-full rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 cursor-pointer font-semibold transition-colors duration-200">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* ───── SECTION 3 — How It Works ───── */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.span
              variants={fadeInUp}
              className="text-xs font-bold uppercase tracking-widest text-cyan-400"
            >
              Simple Process
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-4xl font-extrabold text-white mt-2"
            >
              How It Works
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Dashed connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px border-t-2 border-dashed border-slate-700/60 z-0" />

            {[
              {
                step: '01',
                icon: <MousePointerClick className="w-6 h-6" />,
                title: 'Choose Service',
                desc: 'Browse our catalog and select the Telegram service that fits your goals — Stars, Premium, or Growth.',
                color: 'cyan',
              },
              {
                step: '02',
                icon: <Send className="w-6 h-6" />,
                title: 'Enter Channel / Username',
                desc: 'Provide your public channel link or Telegram username. No passwords or admin access required.',
                color: 'indigo',
              },
              {
                step: '03',
                icon: <PackageCheck className="w-6 h-6" />,
                title: 'Instant Delivery',
                desc: 'Your order enters our automated queue and starts delivering within minutes. Track it live.',
                color: 'emerald',
              },
            ].map(({ step, icon, title, desc, color }) => (
              <motion.div
                key={step}
                variants={fadeInUp}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-${color}-500/10 border border-${color}-500/30 flex items-center justify-center text-${color}-400 mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-300 flex items-center justify-center">
                    {step}
                  </span>
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ───── SECTION 4 — Why NovaSMM ───── */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 sm:p-12 backdrop-blur-md">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-10"
            >
              <motion.span
                variants={fadeInUp}
                className="text-xs font-bold uppercase tracking-widest text-cyan-400"
              >
                Why Choose Us
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-2xl sm:text-4xl font-extrabold text-white mt-2"
              >
                Why NovaSMM
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-slate-400 mt-3 text-base max-w-xl mx-auto"
              >
                Built specifically for Telegram with speed, reliability, and security at the core.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              {[
                {
                  icon: <Zap className="w-5 h-5" />,
                  color: 'cyan',
                  title: 'Instant Delivery',
                  desc: 'Orders enter our automated execution queue within minutes. No manual delays.',
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  color: 'indigo',
                  title: 'Non-Drop Guarantee',
                  desc: 'Refill coverage on all subscriber services. What you order, you keep.',
                },
                {
                  icon: <Lock className="w-5 h-5" />,
                  color: 'emerald',
                  title: 'Secure & Private',
                  desc: 'Only public channel links or usernames required. Zero credential exposure.',
                },
                {
                  icon: <HeartHandshake className="w-5 h-5" />,
                  color: 'purple',
                  title: '24/7 Support',
                  desc: 'Our team is available around the clock to assist with orders and inquiries.',
                },
              ].map(({ icon, color, title, desc }) => (
                <motion.div key={title} variants={fadeInUp} className="flex gap-4 group">
                  <div
                    className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-${color}-400 shrink-0 group-hover:scale-110 transition-transform duration-200`}
                  >
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{title}</h4>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ───── SECTION 5 — Stats Bar ───── */}
        <section
          ref={statsRef}
          className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/80 to-slate-900/60 backdrop-blur-md p-8 sm:p-12 shadow-xl shadow-cyan-500/5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { number: '50,000+', label: 'Orders Served', color: 'text-cyan-400' },
                { number: '99.8%', label: 'Success Rate', color: 'text-cyan-400' },
                { number: '< 5 Min', label: 'Start Time', color: 'text-cyan-400' },
              ].map(({ number, label, color }) => (
                <motion.div
                  key={label}
                  variants={fadeInUp}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className={`stat-number text-4xl sm:text-5xl font-black font-mono ${color}`}
                  >
                    {number}
                  </span>
                  <span className="text-sm text-slate-400 font-medium uppercase tracking-widest">
                    {label}
                  </span>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-1" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ───── CTA Strip ───── */}
        <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-5xl font-extrabold text-white"
            >
              Ready to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                Grow?
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-slate-400 text-base max-w-lg mx-auto"
            >
              Join thousands of creators and brands using NovaSMM to scale their Telegram presence.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/app">
                <Button
                  size="lg"
                  className="gap-2 px-10 py-6 text-base rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-cyan-500/20 cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Growing</span>
                </Button>
              </Link>
              <Link to="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 px-8 py-6 rounded-xl border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100 font-semibold cursor-pointer"
                >
                  <span>View Pricing</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ───── Discreet Footer Note ───── */}
        <div className="relative z-10 border-t border-slate-900 py-5 px-4 text-center">
          <span className="text-[11px] text-slate-600">
            NovaSMM is a demonstration platform. All services are simulated for sales presentation
            purposes.
          </span>
        </div>
      </div>
    </SmoothScroll>
  );
}
