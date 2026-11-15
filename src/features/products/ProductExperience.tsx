import { useState, type CSSProperties, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { formatCents } from '../../core/utils/currency';
import { productCheckout, productOptions, productPrice, type ProductKind } from './productService';
import './ProductExperience.css';
const worlds = {
  stars: {
    eyebrow: 'THE STAR STUDIO',
    title: 'A little sparkle.\nA lot of possibility.',
    description: 'Choose a golden gift for your next Telegram idea.',
    accent: 'var(--gold-ink)',
    art: '/images/nova-stars-world.png',
    alt: 'Nova cradling a golden glass star on a crescent',
    pick: 'Pick your star power',
    action: 'Order Stars',
    note: 'Golden moments, made for sharing.',
    label: 'Stars',
    features: ['Choose a bundle', 'Preview your gift', 'Keep your receipt'],
  },
  premium: {
    eyebrow: 'THE PREMIUM ATELIER',
    title: 'Something special.\nBeautifully wrapped.',
    description: 'A thoughtfully presented Premium gift, from you to them.',
    accent: 'var(--violet-ink)',
    art: '/images/nova-premium-world.png',
    alt: 'Nova offering an open violet gift box',
    pick: 'Choose their next chapter',
    action: 'Order Premium',
    note: 'A gift with a little extra wonder.',
    label: 'Premium',
    features: ['3 or 12 months', 'Personal gift preview', 'Purchase history'],
  },
  growth: {
    eyebrow: 'THE CHANNEL LAB',
    title: 'Your channel.\nYour next chapter.',
    description: 'Shape your campaign and see every detail before ordering.',
    accent: 'var(--cyan-ink)',
    art: '/images/nova-growth-world.png',
    alt: 'Nova pointing at a cyan holographic channel panel',
    pick: 'What would you like to grow?',
    action: 'Create campaign',
    note: 'An idea, a channel, a new direction.',
    label: 'Growth',
    features: ['Members, views & reactions', 'Live price calculation', 'Channel preview'],
  },
} satisfies Record<
  ProductKind,
  {
    eyebrow: string;
    title: string;
    description: string;
    accent: string;
    art: string;
    alt: string;
    pick: string;
    action: string;
    note: string;
    label: string;
    features: string[];
  }
>;
function choiceLabel(id: string) {
  if (id.includes('stars_50') && !id.includes('500')) return '50 Stars';
  if (id.includes('stars_500')) return '500 Stars';
  if (id.includes('premium_3m')) return '3 months';
  if (id.includes('premium_12m')) return '12 months';
  if (id.includes('subscribers')) return 'Members';
  if (id.includes('views')) return 'Post views';
  return 'Reactions';
}
export function ProductExperience({ kind }: { kind: ProductKind }) {
  const [params] = useSearchParams();
  const world = worlds[kind];
  const options = productOptions(kind);
  const [selectedId, setSelectedId] = useState(
    options.find((item) => item.id === params.get('service'))?.id ?? options[0]?.id ?? '',
  );
  const service = options.find((item) => item.id === selectedId) ?? options[0];
  const [quantity, setQuantity] = useState(service?.minQty ?? 1);
  const [recipient, setRecipient] = useState('');
  const [mode, setMode] = useState<'gift' | 'self'>('gift');
  const [feature, setFeature] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{ id: string; charge: number; target: string } | null>(
    null,
  );
  const [imageFailed, setImageFailed] = useState(false);
  const user = useAppStore((state) => state.currentUser);
  const wallet = useCustomerWallet(user.id);
  if (!service)
    return (
      <section className="product-empty">
        <h1>{world.label} is taking a short break.</h1>
        <p>No active products are available.</p>
        <Link to="/app/order/new">Explore other services</Link>
      </section>
    );
  const validQuantity =
    Number.isInteger(quantity) &&
    quantity >= (service.minQty ?? 1) &&
    quantity <= (service.maxQty ?? 100000);
  const price = validQuantity ? productPrice(service, quantity) : 0;
  const insufficient = !wallet.isLoading && price > wallet.balanceCents;
  const target = recipient;
  const select = (id: string) => {
    const next = options.find((item) => item.id === id);
    if (!next) return;
    setSelectedId(id);
    setQuantity(next.minQty ?? 1);
    setError(null);
    setPulse((value) => value + 1);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (pending || wallet.isLoading || !validQuantity || insufficient) return;
    setPending(true);
    setError(null);
    try {
      const order = await productCheckout.purchase({
        userId: user.id,
        serviceId: service.id,
        target,
        quantity,
      });
      setReceipt({ id: order.id, charge: order.chargeCents, target: order.target });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create the order. Try again.');
    } finally {
      setPending(false);
    }
  };
  const isViews = service.id.includes('views');
  const isMembers = service.id.includes('subscribers');
  return (
    <div
      className={`product-world world-${kind}`}
      style={{ '--world': world.accent } as CSSProperties}
    >
      <section className="product-hero">
        <div className="product-hero-copy">
          <span className="product-eyebrow">{world.eyebrow}</span>
          <h1>
            {world.title.split('\n').map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p>{world.description}</p>
          <div className="product-hero-chips">
            {world.features.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <Link to="/app/wallet" className="product-wallet">
            Wallet{' '}
            <strong>{wallet.isLoading ? 'Loading…' : formatCents(wallet.balanceCents)}</strong>
            <ArrowRight size={14} />
          </Link>
        </div>
        <div
          className="product-character"
          data-state={pending ? 'busy' : receipt ? 'success' : 'ready'}
        >
          <div className="product-character-orbit" aria-hidden="true" />
          {imageFailed ? (
            <div className="product-art-fallback">Nova’s {world.label} studio</div>
          ) : (
            <img src={world.art} alt={world.alt} onError={() => setImageFailed(true)} />
          )}
          <span>{world.note}</span>
          <div
            key={pulse}
            className={`product-selection-light ${pulse ? 'play' : ''}`}
            aria-hidden="true"
          />
        </div>
      </section>
      {receipt ? (
        <section className="product-receipt" role="status">
          <span className="product-receipt-check">
            <Check />
          </span>
          <span className="product-eyebrow">SAVED TO YOUR ORDER HISTORY</span>
          <h2>A little idea, now an order.</h2>
          <p>
            {formatCents(receipt.charge)} recorded in your wallet for {receipt.target}.
          </p>
          <code>{receipt.id}</code>
          <p>No Stars, subscription or channel activity is actually delivered.</p>
          <div>
            <button
              onClick={() => {
                setReceipt(null);
                setPulse((value) => value + 1);
              }}
            >
              <RotateCcw size={15} /> Create another
            </button>
            <Link to="/app/orders">
              View order history <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      ) : (
        <div className="product-workspace">
          <form onSubmit={submit} className="product-config" aria-busy={pending}>
            <fieldset disabled={pending}>
              <legend>
                <span>01</span>
                {world.pick}
              </legend>
              <div className="product-options">
                {options.map((option, index) => (
                  <label
                    key={option.id}
                    className={`product-option ${option.id === selectedId ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`product-${kind}`}
                      checked={option.id === selectedId}
                      onChange={() => select(option.id)}
                    />
                    <span className="product-option-art" aria-hidden="true">
                      {kind === 'stars' ? (
                        <span className={`star-sculpture star-size-${index}`} />
                      ) : kind === 'premium' ? (
                        <span className="premium-monogram">{index ? 'XII' : 'III'}</span>
                      ) : (
                        <span className={`growth-sculpture sculpture-${index}`}>
                          <i />
                          <i />
                          <i />
                          <i />
                        </span>
                      )}
                    </span>
                    <strong>{choiceLabel(option.id)}</strong>
                    <small>
                      {formatCents(option.fixedPriceCents ?? option.pricePerThousandCents ?? 0)}{' '}
                      {kind === 'growth' ? '/ 1,000' : '/ gift'}
                    </small>
                    <span className="product-option-check" aria-hidden="true">
                      {option.id === selectedId ? '✓' : '+'}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset disabled={pending}>
              <legend>
                <span>02</span>
                {kind === 'growth' ? 'Shape the campaign' : 'Make it personal'}
              </legend>
              {kind !== 'growth' && (
                <div className="product-gift-switch">
                  <button
                    type="button"
                    aria-pressed={mode === 'gift'}
                    onClick={() => setMode('gift')}
                  >
                    Send a gift
                  </button>
                  <button
                    type="button"
                    aria-pressed={mode === 'self'}
                    onClick={() => setMode('self')}
                  >
                    For myself
                  </button>
                </div>
              )}
              <label className="product-field" htmlFor={`recipient-${kind}`}>
                {kind === 'growth' ? 'Channel handle' : 'Recipient'}
                <input
                  id={`recipient-${kind}`}
                  value={target}
                  onChange={(event) => {
                    setRecipient(event.target.value);
                    setError(null);
                  }}
                  required
                  pattern="@[a-zA-Z0-9_]{3,}"
                  placeholder={kind === 'growth' ? '@channel_username' : '@username'}
                  aria-describedby={`recipient-help-${kind}`}
                />
              </label>
              <p className="product-field-hint" id={`recipient-help-${kind}`}>
                {kind === 'growth'
                  ? 'Enter your channel’s Telegram username.'
                  : mode === 'self'
                    ? 'Enter your Telegram username.'
                    : 'Enter the recipient’s Telegram username.'}
              </p>
              <div className="product-quantity-head">
                <label htmlFor={`quantity-${kind}`}>
                  {kind === 'growth' ? 'Quantity' : 'Number of gifts'}
                </label>
                <span>
                  {(service.minQty ?? 1).toLocaleString()}–
                  {(service.maxQty ?? 100000).toLocaleString()}
                </span>
              </div>
              <input
                className="product-quantity"
                id={`quantity-${kind}`}
                type="number"
                value={Number.isNaN(quantity) ? '' : quantity}
                min={service.minQty ?? 1}
                max={service.maxQty ?? 100000}
                step="1"
                required
                onChange={(event) => setQuantity(event.target.valueAsNumber)}
              />
              {kind === 'growth' && (
                <div className="product-presets">
                  {[service.minQty ?? 1, 1000, 5000]
                    .filter(
                      (value, index, values) =>
                        values.indexOf(value) === index && value <= (service.maxQty ?? 100000),
                    )
                    .map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={quantity === value}
                        onClick={() => {
                          setQuantity(value);
                          setPulse((count) => count + 1);
                        }}
                      >
                        {value.toLocaleString()}
                      </button>
                    ))}
                </div>
              )}
            </fieldset>
            {error && (
              <p className="product-error" role="alert">
                {error}
              </p>
            )}
            {insufficient && (
              <p className="product-error" role="alert">
                This order needs {formatCents(price)}. <Link to="/app/wallet">Add funds →</Link>
              </p>
            )}
            <div className="product-checkout">
              <div>
                <span>Total</span>
                <strong aria-live="polite">{validQuantity ? formatCents(price) : '—'}</strong>
              </div>
              <button
                type="submit"
                disabled={pending || wallet.isLoading || insufficient || !validQuantity}
              >
                {pending ? 'Creating order…' : wallet.isLoading ? 'Loading wallet…' : world.action}
                <ArrowRight size={16} />
              </button>
            </div>
            <p className="product-demo">Preview order: no real payment or Telegram delivery.</p>
          </form>
          <aside className="product-preview">
            <div className="product-preview-heading">
              <span className="product-eyebrow">
                {kind === 'growth'
                  ? 'CHANNEL CANVAS'
                  : kind === 'premium'
                    ? 'THE GIFT PREVIEW'
                    : 'YOUR GOLDEN MOMENT'}
              </span>
              <span>PREVIEW</span>
            </div>
            {kind === 'stars' ? (
              <div className="star-gift-preview" key={selectedId}>
                <div className="star-preview-orbits" aria-hidden="true">
                  <span className="star-sculpture" />
                </div>
                <strong>{choiceLabel(service.id)}</strong>
                <p>For {target || '@username'}</p>
                <span>A golden gift, ready to imagine.</span>
              </div>
            ) : kind === 'premium' ? (
              <div className="premium-pass">
                <div className="premium-pass-top">
                  <span>NOVA / PREMIUM</span>
                  <span>✦</span>
                </div>
                <div className="premium-profile-avatar">
                  N<span>✦</span>
                </div>
                <h3>{target || '@username'}</h3>
                <p>{choiceLabel(service.id)} of possibility</p>
                <div className="premium-feature-display" aria-live="polite">
                  {
                    [
                      'A profile with personality',
                      'A world of expressive emoji',
                      'More room for your ideas',
                    ][feature]
                  }
                </div>
                <div className="premium-feature-tabs">
                  {['Profile', 'Emoji', 'Space'].map((label, index) => (
                    <button
                      type="button"
                      key={label}
                      aria-pressed={feature === index}
                      onClick={() => setFeature(index)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <small>Illustrative Premium profile · no activation</small>
              </div>
            ) : (
              <div className="growth-channel">
                <div className="growth-channel-head">
                  <span>N</span>
                  <div>
                    <strong>{target || '@username'}</strong>
                    <small>Sample channel · preview post</small>
                  </div>
                </div>
                <div className="growth-post-art">
                  <span />
                  <span />
                  <span />
                  <b>
                    MAKE
                    <br />
                    ROOM.
                  </b>
                </div>
                <h3>A new idea deserves a little space.</h3>
                <p>This canvas previews your selection. It does not predict channel performance.</p>
                <div className="growth-channel-stats">
                  <span className={isMembers ? 'highlight' : ''}>
                    Members {isMembers ? `+${quantity || 0}` : '—'}
                  </span>
                  <span className={isViews ? 'highlight' : ''}>
                    Views {isViews ? `+${quantity || 0}` : '—'}
                  </span>
                  <span className={!isMembers && !isViews ? 'highlight' : ''}>
                    ♥ {!isMembers && !isViews ? `+${quantity || 0}` : '—'}
                  </span>
                </div>
              </div>
            )}
            <dl className="product-preview-receipt">
              <div>
                <dt>Selection</dt>
                <dd>{choiceLabel(service.id)}</dd>
              </div>
              <div>
                <dt>{kind === 'growth' ? 'Units' : 'Gifts'}</dt>
                <dd>{validQuantity ? quantity.toLocaleString() : '—'}</dd>
              </div>
              <div>
                <dt>Wallet after order</dt>
                <dd>
                  {wallet.isLoading
                    ? 'Loading…'
                    : insufficient
                      ? 'Top-up needed'
                      : validQuantity
                        ? formatCents(wallet.balanceCents - price)
                        : '—'}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
}
