import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Clock, CheckCheck } from 'lucide-react';
import { BrandGlyph } from '../../components/brand/BrandGlyph';
import { Button } from '../../components/ui/button';
import { NovaMascot, type MascotMood } from '../../components/mascot/NovaMascot';
import { FeaturedSolutions } from '../../features/catalog/components/FeaturedSolutions';
import { HowItWorks, WhyNova } from '../../features/home/components/LandingStory';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export function HomePage() {
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden bg-brand-bg-dark text-brand-text-dark">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-sky-400/8 blur-[80px]" />
        <div className="absolute bottom-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-cyan-500/6 blur-[100px]" />
      </div>

      {/* ───── SECTION 1 — Hero ───── */}
      <section className="relative z-10 pt-12 pb-14 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.15fr_1fr] items-center gap-8 lg:gap-6 text-center lg:text-start">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center lg:items-start"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <span className="nova-intro-badge">
              <BrandGlyph kind="nova" />
              Telegram services, reimagined
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight text-brand-text-dark max-w-5xl leading-[1.1]"
          >
            Supercharge Your{' '}
            <span className="hero-heading-accent text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              Telegram Channel
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg sm:text-xl text-brand-secondary max-w-2xl leading-relaxed"
          >
            Explore Stars, Premium and channel growth in one clear workspace. Preview the journey
            with Nova, from first click to completion.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-10"
          >
            <Link to="/app">
              <Button
                size="lg"
                className="gap-2 text-base px-8 py-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <BrandGlyph kind="launch" className="brand-glyph-action" />
                <span>Start Growing</span>
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 px-8 py-6 rounded-xl border-brand-border bg-brand-surface-dark/80 hover:bg-brand-elevated-dark hover:border-brand-border-strong text-brand-text-dark cursor-pointer font-semibold transition-all duration-200"
              >
                <span>View Services</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs sm:text-sm font-medium"
          >
            {[
              {
                icon: <CheckCheck className="w-4 h-4 text-brand-primary" />,
                label: 'Clear order tracking',
              },
              {
                icon: <Shield className="w-4 h-4 text-brand-success" />,
                label: 'No Telegram password',
              },
              {
                icon: <Clock className="w-4 h-4 text-brand-accent" />,
                label: 'Upfront pricing',
              },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-brand-muted-dark">
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <NovaMascot mood={mascotMood} interactive />
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
            className="text-xs font-bold uppercase tracking-widest text-brand-primary"
          >
            Direct Offerings
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-4xl font-extrabold text-brand-text-dark mt-2"
          >
            Popular Telegram Solutions
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-brand-muted-dark mt-3 text-base max-w-xl mx-auto"
          >
            Three ways to explore Telegram. Transparent pricing, all in one place.
          </motion.p>
        </motion.div>

        <FeaturedSolutions onMoodChange={setMascotMood} />
      </section>

      <HowItWorks />
      <WhyNova />

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
            className="text-3xl sm:text-5xl font-extrabold text-brand-text-dark"
          >
            Ready to{' '}
            <span className="hero-heading-accent text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              Grow?
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-brand-muted-dark text-base max-w-lg mx-auto"
          >
            Find your service, explore the panel and explore the complete order journey.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/app">
              <Button
                size="lg"
                className="gap-2 px-10 py-6 text-base rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-on-accent font-bold shadow-lg shadow-cyan-500/20 cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <BrandGlyph kind="launch" className="brand-glyph-action" />
                <span>Start Growing</span>
              </Button>
            </Link>
            <Link to="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 px-8 py-6 rounded-xl border-brand-border bg-transparent hover:bg-brand-elevated-dark text-brand-text-dark font-semibold cursor-pointer"
              >
                <span>View Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
