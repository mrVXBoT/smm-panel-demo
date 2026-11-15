import { useEffect, useRef, useState } from 'react';
import './LandingStory.css';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronRight,
  LockKeyhole,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { NovaMascot } from '../../../components/mascot/NovaMascot';
import { INITIAL_SERVICES } from '../../../core/fixtures/services';
import { formatCents } from '../../../core/utils/currency';

const products = [
  { name: 'Stars', image: '/images/solution-stars.png', mood: 'stars' },
  { name: 'Premium', image: '/images/solution-premium.png', mood: 'premium' },
  { name: 'Growth', image: '/images/solution-growth.png', mood: 'growth' },
] as const;

function StoryHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="story-heading">
      <span className="story-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export function HowItWorks() {
  const reducedMotion = useReducedMotion();
  const trackingRef = useRef<HTMLLIElement>(null);
  const trackingVisible = useInView(trackingRef, { once: true, amount: 0.3 });
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [run, setRun] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [visibleStep, setVisibleStep] = useState(0);
  const isComplete = reducedMotion || completed;
  useEffect(() => {
    if (!trackingVisible || reducedMotion) return;
    const timer = window.setTimeout(() => setCompleted(true), 1800);
    return () => window.clearTimeout(timer);
  }, [trackingVisible, run, reducedMotion]);
  const reveal = (step: number) => ({
    initial: reducedMotion ? (false as const) : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : step * 0.12 },
    onViewportEnter: () => setVisibleStep((current) => Math.max(current, step)),
  });
  return (
    <section className="landing-story" id="how-it-works" aria-label="How It Works">
      <StoryHeading
        eyebrow="FROM FIRST CLICK TO ALL SET"
        title="How It Works"
        description="A simple journey. A friendly guide. Explore the whole flow before your first order."
      />
      <ol className="journey-grid" data-step={reducedMotion ? 2 : visibleStep}>
        <motion.li className="journey-step" {...reveal(0)}>
          <div className="journey-step-label">
            <span>01</span>
            <span>FIND YOUR SPARK</span>
          </div>
          <div className="journey-preview journey-product-preview">
            <div className="journey-product-halo" aria-hidden="true" />
            <img
              key={selectedProduct}
              src={products[selectedProduct]!.image}
              alt={`${products[selectedProduct]!.name} product preview`}
              width="150"
              height="150"
              loading="lazy"
            />
            <div
              className="journey-product-tabs"
              role="group"
              aria-label="Preview a service category"
            >
              {products.map((product, index) => (
                <button
                  key={product.name}
                  type="button"
                  onClick={() => setSelectedProduct(index)}
                  aria-pressed={selectedProduct === index}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
          <h3>Choose your service.</h3>
          <p>Stars, Premium or channel growth. Find the right fit and see the price upfront.</p>
          <Link className="story-text-link" to="/services">
            Browse the collection <ArrowUpRight size={14} />
          </Link>
        </motion.li>
        <motion.li className="journey-step" {...reveal(1)}>
          <div className="journey-step-label">
            <span>02</span>
            <span>JUST THE ESSENTIALS</span>
          </div>
          <div className="journey-preview journey-form-preview">
            <span className="preview-window-label">
              <i /> ORDER DETAILS <span>PREVIEW</span>
            </span>
            <div className="preview-field">
              <span>Test recipient</span>
              <strong>
                <span className="preview-at">@</span> your_channel <Check size={13} />
              </strong>
            </div>
            <div className="preview-form-bottom">
              <span>
                <CheckCheck size={13} /> Sample recipient
              </span>
              <span>No password</span>
            </div>
            <div className="preview-continue" aria-hidden="true">
              Ready to review <ChevronRight size={14} />
            </div>
          </div>
          <h3>A few details. That’s it.</h3>
          <p>
            Choose a recipient or channel link. Review the quantity and cost before
            confirming.
          </p>
          <span className="story-detail">
            <LockKeyhole size={12} /> No Telegram password required
          </span>
        </motion.li>
        <motion.li ref={trackingRef} className="journey-step" {...reveal(2)}>
          <div className="journey-step-label">
            <span>03</span>
            <span>FOLLOW EVERY STEP</span>
          </div>
          <div className="journey-preview journey-track-preview">
            <div className="journey-track-ui">
              <span className="preview-window-label">
                ORDER PREVIEW <span>#NOVA-001</span>
              </span>
              <div
                className={`journey-result ${isComplete ? 'is-complete' : ''}`}
                role="status"
                aria-label="Preview order status"
              >
                <span className="journey-result-dot" />
                {isComplete ? 'Completed' : 'Processing'}
              </div>
              <div className="journey-progress">
                <span style={{ width: isComplete ? '100%' : '42%' }} />
              </div>
              <span className="journey-track-note">
                {isComplete ? 'All set. Preview complete.' : 'Following the order preview…'}
              </span>
            </div>
            <div className="journey-nova">
              <NovaMascot compact mood={isComplete ? 'success' : 'loading'} />
            </div>
          </div>
          <h3>Watch it come together.</h3>
          <p>Follow your order from processing to completion, with Nova along for the ride.</p>
          <button
            className="story-text-link"
            type="button"
            disabled={!isComplete || !!reducedMotion}
            onClick={() => {
              setCompleted(false);
              setRun((value) => value + 1);
            }}
          >
            <RotateCcw size={12} />
            {reducedMotion ? 'Static preview · reduced motion' : 'Replay the preview'}
          </button>
        </motion.li>
      </ol>
    </section>
  );
}

export function WhyNova() {
  const reducedMotion = useReducedMotion();
  const [quantity, setQuantity] = useState(1000);
  const service = INITIAL_SERVICES.find((item) => item.id === 'srv_tg_views_instant');
  const rate = service?.pricePerThousandCents;
  const total = rate === undefined ? null : Math.round((rate * quantity) / 1000);
  const enter = {
    initial: reducedMotion ? (false as const) : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reducedMotion ? 0 : 0.5 },
  };
  return (
    <section className="landing-story why-nova-section" id="why-novasmm" aria-label="Why NovaSMM">
      <StoryHeading
        eyebrow="LESS GUESSWORK. MORE CLARITY."
        title="Why NovaSMM"
        description="Thoughtful details that make exploring, ordering and tracking feel effortless."
      />
      <div className="why-bento">
        <motion.article className="why-card why-panel" {...enter}>
          <div className="why-card-copy">
            <span className="story-eyebrow">YOUR WORKSPACE</span>
            <h3>Everything in its place.</h3>
            <p>Your orders, balance and activity. One clear view of what’s happening.</p>
          </div>
          <div className="workspace-preview" aria-label="Sample customer workspace">
            <div className="workspace-top">
              <span>
                <i /> NOVA / WORKSPACE
              </span>
              <span>SAMPLE PREVIEW</span>
            </div>
            <div className="workspace-body">
              <div className="workspace-rail" aria-hidden="true">
                <span>N</span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="workspace-content">
                <div className="workspace-title">
                  <div>
                    <small>GOOD TO SEE YOU</small>
                    <strong>Your next chapter.</strong>
                  </div>
                  <span className="workspace-avatar">N</span>
                </div>
                <div className="workspace-stats">
                  <div>
                    <span>Sample balance</span>
                    <strong>$87.00</strong>
                  </div>
                  <div>
                    <span>Sample orders</span>
                    <strong>03</strong>
                  </div>
                  <div>
                    <span>Categories</span>
                    <strong>03</strong>
                  </div>
                </div>
                <div className="workspace-table">
                  <div className="workspace-table-head">
                    <span>RECENT ORDER PREVIEWS</span>
                    <span>STATUS</span>
                  </div>
                  {[
                    {
                      name: 'Telegram Stars',
                      date: '50 Stars gift pack',
                      image: products[0].image,
                      status: 'Completed',
                    },
                    {
                      name: 'Telegram Premium',
                      date: '3 month subscription',
                      image: products[1].image,
                      status: 'Processing',
                    },
                    {
                      name: 'Channel Growth',
                      date: 'Post views',
                      image: products[2].image,
                      status: 'Pending',
                    },
                  ].map((order) => (
                    <div className="workspace-row" key={order.name}>
                      <img src={order.image} alt="" width="32" height="32" loading="lazy" />
                      <div>
                        <strong>{order.name}</strong>
                        <small>{order.date}</small>
                      </div>
                      <span className={`workspace-status status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Link className="story-text-link" to="/app">
            Explore the customer panel <ArrowUpRight size={15} />
          </Link>
        </motion.article>
        <motion.article className="why-card why-pricing" {...enter}>
          <span className="story-eyebrow">NO GUESSWORK</span>
          <h3>
            Know the price.
            <br />
            Before you click.
          </h3>
          <p>A clear rate, a simple calculation. Try a sample quantity.</p>
          <div className="pricing-example">
            <div className="pricing-example-top">
              <span>Telegram post views</span>
              <span>PREVIEW</span>
            </div>
            <div className="quantity-choices" role="group" aria-label="Sample post view quantity">
              {[1000, 2500, 5000].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={quantity === value}
                  onClick={() => setQuantity(value)}
                >
                  {value.toLocaleString('en-US')}
                </button>
              ))}
            </div>
            <div className="pricing-equation">
              <span>
                {quantity.toLocaleString('en-US')} × {rate === undefined ? '—' : formatCents(rate)}{' '}
                / 1,000
              </span>
              <output aria-live="polite" aria-label="Sample order total">
                {total === null ? 'Unavailable' : formatCents(total)}
              </output>
            </div>
          </div>
        </motion.article>
        <motion.article className="why-card why-privacy" {...enter}>
          <div className="privacy-lock-scene" aria-hidden="true">
            <div className="privacy-lock-halo" />
            <div className="privacy-lock">
              <div className="privacy-lock-shackle" />
              <div className="privacy-lock-body">
                <span />
              </div>
            </div>
            <span className="privacy-check">
              <Check size={14} />
            </span>
          </div>
          <div>
            <span className="story-eyebrow">ONLY WHAT’S NEEDED</span>
            <h3>
              Your password
              <br />
              stays yours.
            </h3>
            <p>No Telegram password or OTP fields. Your access stays yours.</p>
          </div>
        </motion.article>
        <motion.article className="why-card why-tracking" {...enter}>
          <div>
            <span className="story-eyebrow">CLEAR AT EVERY STEP</span>
            <h3>No mystery statuses.</h3>
            <p>See where an order stands, from the first click to the final update.</p>
          </div>
          <ol className="status-timeline" aria-label="Example order lifecycle">
            <li>
              <span>
                <Check size={12} />
              </span>
              <div>
                <strong>Pending</strong>
                <small>Order recorded</small>
              </div>
            </li>
            <li>
              <span>
                <Check size={12} />
              </span>
              <div>
                <strong>Processing</strong>
                <small>Processing underway</small>
              </div>
            </li>
            <li>
              <span>
                <Sparkles size={12} />
              </span>
              <div>
                <strong>Completed</strong>
                <small>Result ready to view</small>
              </div>
            </li>
          </ol>
          <Link className="story-text-link" to="/app/orders">
            See order history <ArrowUpRight size={14} />
          </Link>
        </motion.article>
      </div>
    </section>
  );
}
