import { useState } from 'react';
import { useAppStore } from '../../app/store';
import { formatCents } from '../../core/utils/currency';
import { AccountShell, AccountPanel } from '../../features/account/AccountShell';
import { AccountGlyph } from '../../features/account/AccountGlyph';
import { useAccountLedger } from '../../features/account/hooks';
import type { LedgerEntry } from '../../core/types/models';
export function TransactionsPage() {
  const user = useAppStore((state) => state.currentUser);
  const { entries, isLoading, error } = useAccountLedger(user.id);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<LedgerEntry | null>(null);
  const filtered = entries.filter(
    (entry) =>
      (filter === 'all' ||
        (filter === 'credits' ? entry.amountCents > 0 : entry.amountCents < 0)) &&
      `${entry.id} ${entry.description} ${entry.orderId ?? ''} ${entry.paymentId ?? ''}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const incoming = entries.reduce((sum, entry) => sum + Math.max(entry.amountCents, 0), 0),
    outgoing = entries.reduce((sum, entry) => sum + Math.max(-entry.amountCents, 0), 0);
  return (
    <AccountShell kind="transactions">
      <div className="account-stat-grid">
        {[
          { label: 'Money in', value: incoming },
          { label: 'Money out', value: outgoing },
          { label: 'Net balance', value: incoming - outgoing },
        ].map((stat) => (
          <div className="account-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{isLoading ? '…' : formatCents(stat.value)}</strong>
            <AccountGlyph kind="transactions" />
          </div>
        ))}
      </div>
      <AccountPanel kind="transactions" title="Your transaction journal">
        <div className="account-toolbar">
          <div className="account-segments" aria-label="Transaction filters">
            {['all', 'credits', 'debits'].map((value) => (
              <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>
                {value}
              </button>
            ))}
          </div>
          <input
            aria-label="Search transactions"
            placeholder="Search description or reference…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        {isLoading ? (
          <p role="status">Loading your journal…</p>
        ) : error ? (
          <p role="alert" className="account-error">
            {error}
          </p>
        ) : !filtered.length ? (
          <div className="account-empty">
            <AccountGlyph kind="transactions" />
            <h3>
              {entries.length ? 'No matching movements.' : 'A clean page for your next move.'}
            </h3>
            <p>
              {entries.length
                ? 'Try another search or filter.'
                : 'Wallet top-ups and order charges will appear here.'}
            </p>
          </div>
        ) : (
          <div className="account-ledger-list">
            {filtered.map((entry) => (
              <button
                className="account-ledger-row"
                key={entry.id}
                onClick={() => setSelected(selected?.id === entry.id ? null : entry)}
                aria-expanded={selected?.id === entry.id}
              >
                <span className={`account-entry-symbol ${entry.amountCents > 0 ? 'credit' : ''}`}>
                  {entry.amountCents > 0 ? '↙' : '↗'}
                </span>
                <span>
                  <strong>{entry.description}</strong>
                  <small>
                    {entry.kind.replaceAll('_', ' ')} ·{' '}
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </small>
                </span>
                <b className={entry.amountCents > 0 ? 'account-positive' : ''}>
                  {entry.amountCents > 0 ? '+' : '−'}
                  {formatCents(Math.abs(entry.amountCents))}
                </b>
              </button>
            ))}
          </div>
        )}
        {selected && (
          <section className="account-detail" aria-label="Transaction details">
            <h3>Receipt details</h3>
            <dl>
              <div>
                <dt>Transaction</dt>
                <dd>{selected.id}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>{selected.orderId ?? selected.paymentId ?? 'Opening balance'}</dd>
              </div>
              <div>
                <dt>Recorded</dt>
                <dd>{new Date(selected.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
            <p>Wallet record · USD</p>
            <button className="account-text-link" onClick={() => setSelected(null)}>
              Close receipt
            </button>
          </section>
        )}
      </AccountPanel>
    </AccountShell>
  );
}
