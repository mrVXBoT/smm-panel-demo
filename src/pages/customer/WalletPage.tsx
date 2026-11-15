import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '../../app/store';
import { useCustomerWallet } from '../../core/db/hooks';
import { DemoCheckout } from '../../features/account/DemoCheckout';
import type { PaymentMethod } from '../../core/types/models';
import { formatCents } from '../../core/utils/currency';
import { AccountShell, AccountPanel } from '../../features/account/AccountShell';
import { AccountGlyph } from '../../features/account/AccountGlyph';
import { useAccountLedger } from '../../features/account/hooks';
export function WalletPage() {
  const user = useAppStore((state) => state.currentUser);
  const wallet = useCustomerWallet(user.id);
  const ledger = useAccountLedger(user.id);
  const [amount, setAmount] = useState(25);
  const [method, setMethod] = useState<PaymentMethod>('visa_demo');
  const [checkout, setCheckout] = useState<{ amountCents: number; method: PaymentMethod } | null>(
    null,
  );
  const [success, setSuccess] = useState('');
  const openCheckout = () => {
    setSuccess('');
    setCheckout({ amountCents: amount * 100, method });
  };
  return (
    <AccountShell kind="wallet">
      <div className="account-columns">
        <div className="account-stack">
          <section className="wallet-pass">
            <div>
              <span>NOVA / WALLET</span>
            </div>
            <span>Available balance</span>
            <strong>{wallet.isLoading ? 'Loading…' : formatCents(wallet.balanceCents)}</strong>
            <p>USD · Available funds</p>
            <div className="wallet-pass-bottom">
              <span>{user.displayName}</span>
              <AccountGlyph kind="wallet" />
            </div>
          </section>
          <AccountPanel kind="transactions" title="Recent movements">
            {ledger.isLoading ? (
              <p role="status">Loading activity…</p>
            ) : ledger.error ? (
              <p role="alert">{ledger.error}</p>
            ) : ledger.entries.length ? (
              ledger.entries.slice(0, 3).map((entry) => (
                <div className="account-mini-row" key={entry.id}>
                  <AccountGlyph kind="transactions" />
                  <div>
                    <strong>{entry.description}</strong>
                    <small>{new Date(entry.createdAt).toLocaleDateString()}</small>
                  </div>
                  <b className={entry.amountCents > 0 ? 'account-positive' : ''}>
                    {entry.amountCents > 0 ? '+' : '−'}
                    {formatCents(Math.abs(entry.amountCents))}
                  </b>
                </div>
              ))
            ) : (
              <p>No movements yet. Your first top-up will appear here.</p>
            )}
            <Link className="account-text-link" to="/app/transactions">
              Open transaction journal <ArrowRight size={14} />
            </Link>
          </AccountPanel>
        </div>
        <AccountPanel kind="wallet" title="Add a little possibility">
          <div className="account-form">
            <fieldset disabled={!!checkout}>
              <legend>Choose an amount</legend>
              <div className="account-amounts">
                {[25, 50, 100].map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={amount === value}
                    onClick={() => setAmount(value)}
                  >
                    +{formatCents(value * 100)}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset disabled={!!checkout}>
              <legend>Payment method</legend>
              <div className="account-methods">
                {(['visa_demo', 'mastercard_demo'] as const).map((value) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="payment-method"
                      checked={method === value}
                      onChange={() => setMethod(value)}
                    />
                    <span
                      className={value === 'visa_demo' ? 'visa-wordmark' : 'mastercard-wordmark'}
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
                    <strong>
                      {value === 'visa_demo' ? 'Visa' : 'Mastercard'} <small>Selected method</small>
                    </strong>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="account-total">
              <span>Wallet top-up</span>
              <strong>{formatCents(amount * 100)}</strong>
            </div>
            {success && (
              <p role="status" className="account-positive">
                {success}
              </p>
            )}
            <button
              className="account-primary-button"
              disabled={!!checkout || wallet.isLoading}
              onClick={openCheckout}
            >
              Pay by Visa or Mastercard
              <ArrowRight size={16} />
            </button>
          </div>
        </AccountPanel>
      </div>
      {checkout && (
        <DemoCheckout
          userId={user.id}
          amountCents={checkout.amountCents}
          initialMethod={checkout.method}
          onClose={() => setCheckout(null)}
          onSuccess={(value) => setSuccess(`${formatCents(value)} added to your wallet.`)}
        />
      )}
    </AccountShell>
  );
}
