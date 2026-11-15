import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, LoaderCircle, LockKeyhole, RefreshCw, X } from 'lucide-react';
import type { PaymentMethod } from '../../core/types/models';
import { walletRepository } from '../../core/db/walletRepository';
import { formatCents } from '../../core/utils/currency';
import { NovaLogo } from '../../components/layout/NovaLogo';
import './DemoCheckout.css';
import { checkoutGateway } from './checkoutGateway';
interface Props {
  userId: string;
  amountCents: number;
  initialMethod: PaymentMethod;
  onClose: () => void;
  onSuccess: (amountCents: number) => void;
}
export function DemoCheckout({ userId, amountCents, initialMethod, onClose, onSuccess }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const busy = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [challenge, setChallenge] = useState('73842');
  const [verified, setVerified] = useState(false);
  const [method, setMethod] = useState(initialMethod);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    return () => {
      controller.current?.abort();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  const pay = async () => {
    if (busy.current || receipt) return;
    if (!['4242424242424242', '5555555555554444'].includes(card.replace(/\s/g, ''))) {
      setError('Use the sample card 4242 4242 4242 4242 or 5555 5555 5555 4444.');
      return;
    }
    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();
    if (
      !month ||
      month > 12 ||
      !year ||
      2000 + year < now.getFullYear() ||
      (2000 + year === now.getFullYear() && month < now.getMonth() + 1) ||
      !/^\d{3,4}$/.test(cvv)
    ) {
      setError('Check the expiry date and CVV2.');
      return;
    }
    if (!verified || captcha !== challenge) {
      setError('Select “I’m not a robot” and enter the image code.');
      return;
    }
    setCard('');
    setExpiry('');
    setCvv('');
    setCaptcha('');
    busy.current = true;
    controller.current = new AbortController();
    setPending(true);
    setError('');
    try {
      await checkoutGateway.authorize(
        { amountCents, method, testReference: 'NOVA-CHECKOUT-001' },
        controller.current.signal,
      );
      if (controller.current.signal.aborted) return;
      const result = await walletRepository.simulateTopUp(userId, amountCents, method);
      setReceipt(result.payment.id);
      onSuccess(amountCents);
    } catch {
      if (controller.current?.signal.aborted) return;
      setError(
        'The payment preview could not be completed. Your wallet was not charged. Please try again.',
      );
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  const close = () => {
    if (!busy.current) {
      dialog.current?.close();
      onClose();
    }
  };
  return (
    <dialog
      ref={dialog}
      className="nova-checkout"
      aria-labelledby="checkout-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) {
          const rect = dialog.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            close();
        }
      }}
    >
      <div className="checkout-frame">
        <header className="checkout-header">
          <div>
            <NovaLogo />
            <span>
              Nova<span>Pay</span>
              <small>NovaSMM wallet checkout</small>
            </span>
          </div>

          <button aria-label="Close checkout" disabled={pending} onClick={close}>
            <X size={18} />
          </button>
        </header>
        <div className="checkout-grid">
          <aside className="checkout-summary">
            <span className="checkout-eyebrow">PAYMENT SUMMARY</span>
            <h2 id="checkout-title">
              {receipt ? 'All set. A little more possibility.' : 'Your next idea, funded.'}
            </h2>
            <p>Top up your NovaSMM wallet.</p>
            <div className="checkout-amount">
              <span>Amount due</span>
              <strong>{formatCents(amountCents)}</strong>
              <small>USD · One-time top-up</small>
            </div>
            <dl>
              <div>
                <dt>Merchant</dt>
                <dd>NovaSMM</dd>
              </div>
              <div>
                <dt>Processing fee</dt>
                <dd>{formatCents(0)}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatCents(amountCents)} USD</dd>
              </div>
            </dl>
            <div className="checkout-orbit" aria-hidden="true">
              <span>N</span>
              <i />
              <i />
            </div>
          </aside>
          <section className="checkout-main" aria-busy={pending}>
            {pending ? (
              <div className="checkout-processing" role="status">
                <div className="checkout-processing-orb">
                  <LoaderCircle size={44} className="checkout-spinner" />
                </div>
                <span>PROCESSING</span>
                <h3>Preparing your wallet.</h3>
                <p>Processing your wallet top-up.</p>
                <strong>{formatCents(amountCents)}</strong>
                <ol>
                  <li>
                    <Check size={14} /> Details reviewed
                  </li>
                  <li>
                    <LoaderCircle size={14} className="checkout-spinner" /> Processing top-up
                  </li>
                  <li>Wallet receipt comes next</li>
                </ol>
                <small>Preparing your receipt</small>
              </div>
            ) : receipt ? (
              <div className="checkout-success" role="status">
                <span>
                  <Check size={31} />
                </span>
                <b>TOP-UP COMPLETE</b>
                <h3>Your wallet is ready.</h3>
                <p>{formatCents(amountCents)} was added to your wallet balance.</p>
                <div>
                  <small>Receipt reference</small>
                  <code>{receipt}</code>
                </div>
                <p className="checkout-disclosure">Preview receipt · No bank transaction.</p>
                <button className="checkout-pay" onClick={close}>
                  Back to wallet <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="checkout-step">
                  <span>01</span>Review & confirm
                </div>
                <h3>Card payment</h3>
                <p className="checkout-lead">Enter your card details to continue.</p>
                <fieldset className="checkout-methods" disabled={pending}>
                  <legend className="sr-only">Payment method</legend>
                  {(['visa_demo', 'mastercard_demo'] as const).map((value) => (
                    <label key={value} className={method === value ? 'selected' : ''}>
                      <input
                        type="radio"
                        name="checkout-method"
                        checked={method === value}
                        onChange={() => setMethod(value)}
                      />
                      <span
                        className={value === 'visa_demo' ? 'visa-wordmark' : 'mastercard-wordmark'}
                        aria-hidden="true"
                      >
                        {value === 'visa_demo' ? (
                          'VISA'
                        ) : (
                          <>
                            <i />
                            <i />
                          </>
                        )}
                      </span>
                      <strong>{value === 'visa_demo' ? 'Visa' : 'Mastercard'}</strong>
                      <span className="checkout-selected" aria-hidden="true">
                        {method === value ? '✓' : ''}
                      </span>
                    </label>
                  ))}
                </fieldset>
                <form
                  id="checkout-card-form"
                  className="checkout-bank-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void pay();
                  }}
                >
                  <div className="checkout-form-heading">
                    <LockKeyhole size={15} />
                    <strong>Payment details</strong>
                  </div>
                  <label>
                    Card number
                    <input
                      value={card}
                      onChange={(event) =>
                        setCard(
                          event.target.value
                            .replace(/\D/g, '')
                            .slice(0, 16)
                            .replace(/(.{4})/g, '$1 ')
                            .trim(),
                        )
                      }
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      required
                      dir="ltr"
                    />
                  </label>
                  <div className="checkout-bank-pair">
                    <label>
                      Expiry date
                      <input
                        value={expiry}
                        onChange={(event) => {
                          const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
                          setExpiry(
                            digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits,
                          );
                        }}
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="MM / YY"
                        maxLength={5}
                        required
                        dir="ltr"
                      />
                    </label>
                    <label>
                      CVV2
                      <input
                        type="password"
                        value={cvv}
                        onChange={(event) =>
                          setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))
                        }
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="•••"
                        maxLength={4}
                        required
                      />
                    </label>
                  </div>
                  <div className="checkout-verification">
                    <label className="checkout-human">
                      <input
                        type="checkbox"
                        checked={verified}
                        onChange={(event) => setVerified(event.target.checked)}
                      />
                      <span>I’m not a robot</span>
                      <LockKeyhole size={18} aria-hidden="true" />
                    </label>
                    <div className="checkout-captcha-row">
                      <svg
                        className="checkout-captcha"
                        viewBox="0 0 160 55"
                        role="img"
                        aria-label="Security code image"
                      >
                        <title>Security code: {challenge.split('').join(' ')}</title>
                        <rect width="160" height="55" rx="9" fill="#dbe8ef" />
                        <path
                          d="M0 18 Q45 48 80 14 T160 28 M0 40 Q60 8 160 42"
                          stroke="#7291b5"
                          fill="none"
                        />
                        {challenge.split('').map((digit, index) => (
                          <text
                            key={index}
                            x={17 + index * 28}
                            y={37 - (index % 2) * 5}
                            transform={`rotate(${index % 2 ? 10 : -10} ${17 + index * 28} 28)`}
                            fill="#24364f"
                            fontSize="27"
                            fontWeight="800"
                            fontFamily="monospace"
                          >
                            {digit}
                          </text>
                        ))}
                      </svg>
                      <button
                        type="button"
                        className="checkout-refresh"
                        aria-label="Refresh security code"
                        onClick={() => {
                          setChallenge(String(Math.floor(10000 + Math.random() * 90000)));
                          setCaptcha('');
                        }}
                      >
                        <RefreshCw size={17} />
                      </button>
                      <label>
                        Image code
                        <input
                          value={captcha}
                          onChange={(event) =>
                            setCaptcha(event.target.value.replace(/\D/g, '').slice(0, 5))
                          }
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="Enter code"
                          maxLength={5}
                          required
                        />
                      </label>
                    </div>
                  </div>
                  <p className="checkout-disclosure" id="checkout-test-help">
                    Preview payment: no real money is transferred. Use sample card details only.
                  </p>
                </form>
                {error && (
                  <p role="alert" className="checkout-error">
                    {error}
                  </p>
                )}
                <button
                  className="checkout-pay"
                  type="submit"
                  form="checkout-card-form"
                  disabled={pending}
                >
                  {pending ? (
                    <>
                      <LoaderCircle size={18} className="checkout-spinner" />
                      Processing payment…
                    </>
                  ) : (
                    <>
                      Confirm payment · {formatCents(amountCents)} <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button className="checkout-cancel" disabled={pending} onClick={close}>
                  Cancel and return to wallet
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </dialog>
  );
}
