import { useState, type CSSProperties } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Search, ArrowUpRight, Check, X } from 'lucide-react';
import { INITIAL_SERVICES } from '../../core/fixtures/services';
import { productRoute } from '../../core/utils/productRoutes';
import { formatCents } from '../../core/utils/currency';
import './ServicesPage.css';

const categories = [
  { id: 'all', label: 'All services', tone: 'all' },
  { id: 'cat_tg_stars', label: 'Stars', tone: 'stars' },
  { id: 'cat_tg_premium', label: 'Premium', tone: 'premium' },
  { id: 'cat_tg_growth', label: 'Growth', tone: 'growth' },
] as const;
const presentations: Record<
  string,
  {
    title: string;
    category: string;
    tone: string;
    edition: string;
    description: string;
    features: string[];
    image: string;
    numeral: string;
    unit: string;
  }
> = {
  srv_tg_stars_50: {
    title: '50 Telegram Stars',
    category: 'TELEGRAM STARS',
    tone: 'stars',
    edition: 'The little spark',
    description: 'A little star power for gifts, bots and mini apps.',
    features: ['50 Stars in one bundle', 'Choose your recipient'],
    image: 'stars',
    numeral: '50',
    unit: 'STARS',
  },
  srv_tg_stars_500: {
    title: '500 Telegram Stars',
    category: 'TELEGRAM STARS',
    tone: 'stars',
    edition: 'More room to create',
    description: 'A bigger bundle for your next digital idea.',
    features: ['500 Stars in one bundle', 'Lower price per Star'],
    image: 'stars',
    numeral: '500',
    unit: 'STARS',
  },
  srv_tg_premium_3m: {
    title: 'Premium · 3 months',
    category: 'TELEGRAM PREMIUM',
    tone: 'premium',
    edition: 'A thoughtful gift',
    description: 'Three months of a little extra possibility.',
    features: ['3-month subscription', 'For yourself or a friend'],
    image: 'premium',
    numeral: '03',
    unit: 'MONTHS',
  },
  srv_tg_premium_12m: {
    title: 'Premium · 12 months',
    category: 'TELEGRAM PREMIUM',
    tone: 'premium',
    edition: 'A year of extraordinary',
    description: 'Make their next twelve months feel special.',
    features: ['12-month subscription', 'Better monthly value'],
    image: 'premium',
    numeral: '12',
    unit: 'MONTHS',
  },
  srv_tg_subscribers_hq: {
    title: 'Channel members',
    category: 'CHANNEL GROWTH',
    tone: 'growth',
    edition: 'Build your community',
    description: 'Shape a member campaign around your channel.',
    features: ['From 100 members', 'Choose your quantity'],
    image: 'growth',
    numeral: '+',
    unit: 'MEMBERS',
  },
  srv_tg_views_instant: {
    title: 'Post views',
    category: 'CHANNEL GROWTH',
    tone: 'growth',
    edition: 'Put your ideas in view',
    description: 'Give your next channel post its own campaign.',
    features: ['From 500 views', 'Set your post target'],
    image: 'growth',
    numeral: '↗',
    unit: 'VIEWS',
  },
  srv_tg_reactions_mixed: {
    title: 'Mixed reactions',
    category: 'CHANNEL GROWTH',
    tone: 'growth',
    edition: 'A little more expression',
    description: 'Bring a mix of reactions to your channel posts.',
    features: ['From 50 reactions', 'Positive emoji mix'],
    image: 'growth',
    numeral: '♡',
    unit: 'REACTIONS',
  },
};

export function ServicesPage() {
  const [params] = useSearchParams();
  const requestedCategory = params.get('category');
  const [selectedCategory, setSelectedCategory] = useState(
    categories.some((category) => category.id === requestedCategory) ? requestedCategory! : 'all',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const reducedMotion = useReducedMotion();
  const activeCategory =
    categories.find((category) => category.id === selectedCategory) ?? categories[0];
  const services = INITIAL_SERVICES.filter((service) => service.status === 'active');
  const filtered = services.filter((service) => {
    const presentation = presentations[service.id];
    return (
      (selectedCategory === 'all' || service.categoryId === selectedCategory) &&
      `${service.name} ${service.description} ${presentation?.title ?? ''}`
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );
  });
  const reset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };
  if (requestedCategory === 'cat_tg_growth') return <Navigate to="/app/growth" replace />;
  return (
    <div className={`services-showcase catalog-tone-${activeCategory.tone}`}>
      <section className="catalog-hero" aria-labelledby="catalog-heading">
        <div className="catalog-hero-copy">
          <span className="catalog-eyebrow">THE NOVA COLLECTION / 01</span>
          <h1 id="catalog-heading">
            Find your
            <br />
            next <span>upgrade.</span>
          </h1>
          <p>
            A little sparkle. A thoughtful gift. A new chapter for your channel. Find the Telegram
            service that fits your idea.
          </p>
          <div className="catalog-hero-tags">
            <span>
              <i /> Stars
            </span>
            <span>
              <i /> Premium
            </span>
            <span>
              <i /> Growth
            </span>
          </div>
        </div>
        <div className="catalog-hero-scene">
          <div className="catalog-scene-orbit" aria-hidden="true" />
          <img
            src="/images/nova-catalog-guide.png"
            alt="Nova presenting Stars, Premium and Growth on a glass display"
            fetchPriority="high"
          />
          <span className="catalog-scene-caption">
            CURATED BY NOVA <span>↗</span>
          </span>
        </div>
      </section>
      <section className="catalog-collection" aria-label="Service collection">
        <div className="catalog-toolbar">
          <div className="catalog-filters" role="group" aria-label="Filter services by category">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.label}</span>
                <small>
                  {
                    services.filter(
                      (service) => category.id === 'all' || service.categoryId === category.id,
                    ).length
                  }
                </small>
              </button>
            ))}
          </div>
          <div className="catalog-search">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Search services"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Find your next upgrade…"
            />
            {searchQuery && (
              <button type="button" aria-label="Clear search" onClick={() => setSearchQuery('')}>
                <X size={15} />
              </button>
            )}
          </div>
        </div>
        <div className="catalog-results-heading">
          <h2>
            {activeCategory.id === 'all'
              ? 'Made for your next idea'
              : `Explore ${activeCategory.label}`}
          </h2>
          <p role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'service' : 'services'}
            {searchQuery.trim() ? ` matching “${searchQuery.trim()}”` : ' to explore'}
          </p>
        </div>
        <motion.div layout={!reducedMotion} className="catalog-grid">
          <AnimatePresence initial={false}>
            {filtered.map((service) => {
              const item = presentations[service.id];
              if (!item) return null;
              return (
                <motion.article
                  layout={!reducedMotion}
                  key={service.id}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
                  transition={{ duration: reducedMotion ? 0 : 0.22 }}
                  className={`catalog-card catalog-card-${item.tone}`}
                  style={
                    {
                      '--card-order':
                        service.id.endsWith('500') || service.id.includes('12m') ? '1' : '0',
                    } as CSSProperties
                  }
                >
                  <div className="catalog-card-art" aria-hidden="true">
                    <span className="catalog-edition">{item.edition}</span>
                    <div className="catalog-art-ring" />
                    <img src={`/images/solution-${item.image}.png`} alt="" loading="lazy" />
                    <div className="catalog-product-size">
                      <strong>{item.numeral}</strong>
                      <span>{item.unit}</span>
                    </div>
                    <span className="catalog-art-index">
                      N / {String(services.indexOf(service) + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="catalog-card-body">
                    <span className="catalog-card-category">{item.category}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <ul>
                      {item.features.map((feature) => (
                        <li key={feature}>
                          <Check size={13} aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="catalog-card-bottom">
                      <div>
                        <small>
                          {service.pricePerThousandCents !== undefined ? 'Per 1,000' : 'Per bundle'}
                        </small>
                        <strong>
                          {formatCents(
                            service.pricePerThousandCents ?? service.fixedPriceCents ?? 0,
                          )}
                        </strong>
                      </div>
                      <Link to={productRoute(service.id)} aria-label={`Order ${item.title}`}>
                        Choose <ArrowUpRight size={17} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {!filtered.length && (
          <div className="catalog-empty">
            <span aria-hidden="true">⌕</span>
            <h3>No matches just yet.</h3>
            <p>Try another name or explore the whole collection.</p>
            <button type="button" onClick={reset}>
              Show all services <ArrowUpRight size={16} />
            </button>
          </div>
        )}
      </section>
      <aside className="catalog-help">
        <div>
          <span className="catalog-eyebrow">A LITTLE GUIDANCE</span>
          <h2>Not sure where to start?</h2>
          <p>Compare the options, then make it yours in the order studio.</p>
        </div>
        <Link to="/pricing">
          Explore pricing <ArrowUpRight size={17} />
        </Link>
      </aside>
    </div>
  );
}
