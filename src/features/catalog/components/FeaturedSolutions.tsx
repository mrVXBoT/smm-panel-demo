import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { INITIAL_SERVICES } from '../../../core/fixtures/services';
import { formatCents } from '../../../core/utils/currency';
import type { MascotMood } from '../../../components/mascot/NovaMascot';

const solutions = [
  {
    id: 'stars',
    title: 'Telegram Stars',
    kicker: 'A LITTLE STAR POWER',
    badge: 'Creator favorite',
    description: 'Fuel your next idea. Gift Stars for bots, mini apps and digital experiences.',
    features: ['50 & 500 Stars bundles', 'Choose your recipient'],
    image: '/images/solution-stars.png',
    alt: 'Sculpted golden glass stars with polished champagne edges',
    platform: 'telegram_stars',
    accent: 'var(--gold-ink)',
    rgb: '251,191,36',
    action: 'Explore Stars',
    href: '/app/stars',
  },
  {
    id: 'premium',
    title: 'Telegram Premium',
    kicker: 'SOMETHING EXTRAORDINARY',
    badge: 'The perfect gift',
    description: 'Make every detail feel special. Discover a little more of Telegram.',
    features: ['3 & 12 month plans', 'Gift options available'],
    image: '/images/solution-premium.png',
    alt: 'A violet crystal crown floating above a luxury gift box',
    platform: 'telegram_premium',
    accent: 'var(--violet-ink)',
    rgb: '184,154,255',
    action: 'Explore Premium',
    href: '/app/premium',
  },
  {
    id: 'growth',
    title: 'Channel Growth',
    kicker: 'YOUR NEXT BIG CHAPTER',
    badge: 'Built for channels',
    description: 'Build your channel’s next chapter with members, views and reactions.',
    features: ['Members, views & reactions', 'Track your orders'],
    image: '/images/solution-growth.png',
    alt: 'A cyan glass paper plane above a rising sculptural platform',
    platform: 'telegram',
    accent: 'var(--cyan-ink)',
    rgb: '56,217,239',
    action: 'Explore Growth',
    href: '/app/growth',
  },
] as const;

type Solution = (typeof solutions)[number];
function SolutionCard({
  solution,
  index,
  onMoodChange,
}: {
  solution: Solution;
  index: number;
  onMoodChange: (mood: MascotMood) => void;
}) {
  const reducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const services = INITIAL_SERVICES.filter(
    (service) => service.platform === solution.platform && service.status === 'active',
  );
  const prices = services.flatMap((service) =>
    solution.id === 'growth'
      ? service.pricePerThousandCents === undefined
        ? []
        : [service.pricePerThousandCents]
      : service.fixedPriceCents === undefined
        ? []
        : [service.fixedPriceCents],
  );
  const price = prices.length ? Math.min(...prices) : null;
  return (
    <motion.article
      className="solution-card"
      style={
        {
          '--solution-accent': solution.accent,
          '--solution-rgb': solution.rgb,
          '--solution-delay': `${index * -1.3}s`,
        } as CSSProperties
      }
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={reducedMotion ? undefined : { y: -6 }}
      transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : index * 0.09 }}
      onMouseEnter={() => onMoodChange(solution.id)}
      onMouseLeave={() => onMoodChange('idle')}
      onFocusCapture={() => onMoodChange(solution.id)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onMoodChange('idle');
      }}
      aria-labelledby={`solution-${solution.id}`}
      data-motion={reducedMotion ? 'reduced' : 'full'}
    >
      <div className="solution-card-inner">
        <div className="solution-art">
          <div className="solution-art-halo" aria-hidden="true" />
          <div className="solution-art-ring" aria-hidden="true" />
          <span className="solution-badge">{solution.badge}</span>
          <span className="solution-number" aria-hidden="true">
            0{index + 1}
          </span>
          {failed ? (
            <div className="solution-art-fallback">
              <Sparkles size={58} aria-hidden="true" />
              <span>Discover {solution.title}</span>
            </div>
          ) : (
            <img
              src={solution.image}
              alt={solution.alt}
              width="1024"
              height="1024"
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
            />
          )}
          <span className="solution-glint solution-glint-one" aria-hidden="true" />
          <span className="solution-glint solution-glint-two" aria-hidden="true" />
        </div>
        <div className="solution-details">
          <p className="solution-kicker">{solution.kicker}</p>
          <h3 id={`solution-${solution.id}`}>{solution.title}</h3>
          <p className="solution-description">{solution.description}</p>
          <ul className="solution-features">
            {solution.features.map((feature) => (
              <li key={feature}>
                <Check size={13} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="solution-price">
            <div>
              <span className="solution-price-label">Pricing from</span>
              <strong>
                {price === null ? 'Unavailable' : formatCents(price)}
                {solution.id === 'growth' && price !== null && <small> / 1,000</small>}
              </strong>
            </div>
            <span className="solution-price-note">
              {solution.id === 'premium'
                ? 'per subscription'
                : solution.id === 'stars'
                  ? 'per bundle'
                  : 'per service'}
            </span>
          </div>
          <Link className="solution-cta" to={solution.href}>
            {solution.action}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
export function FeaturedSolutions({ onMoodChange }: { onMoodChange: (mood: MascotMood) => void }) {
  return (
    <div className="solutions-grid">
      {solutions.map((solution, index) => (
        <SolutionCard
          key={solution.id}
          solution={solution}
          index={index}
          onMoodChange={onMoodChange}
        />
      ))}
    </div>
  );
}
