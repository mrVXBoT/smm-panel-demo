import { useState, type ReactNode } from 'react';
import { AccountGlyph, type AccountKind } from './AccountGlyph';
import './AccountStudio.css';
const copy = {
  wallet: [
    'YOUR WALLET',
    'Room for your next idea.',
    'Your balance, top-ups and next steps. All in one clear place.',
    'Nova holding a mint glass wallet',
  ],
  transactions: [
    'THE ACTIVITY JOURNAL',
    'Every movement. In view.',
    'Follow the credits, order charges and refunds behind your balance.',
    'Nova examining a receipt through a magnifying glass',
  ],
  support: [
    'THE HELP STUDIO',
    'A little help goes a long way.',
    'Explore the guides and keep your conversations in one place.',
    'Nova with a support microphone and glass speech bubble',
  ],
  profile: [
    'YOUR PERSONAL SPACE',
    'Make yourself at home.',
    'Your identity, workspace preferences and account controls.',
    'Nova presenting a violet identity badge',
  ],
};
export function AccountShell({ kind, children }: { kind: AccountKind; children: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const text = copy[kind];
  return (
    <div className={`account-studio account-${kind}`}>
      <header className="account-hero">
        <div>
          <div className="account-eyebrow">
            <AccountGlyph kind={kind} />
            <span>{text[0]}</span>
          </div>
          <h1>{text[1]}</h1>
          <p>{text[2]}</p>
        </div>
        <div className="account-mascot">
          {failed ? (
            <AccountGlyph kind={kind} />
          ) : (
            <img
              src={`/images/nova-account-${kind}.png`}
              alt={text[3]}
              onError={() => setFailed(true)}
            />
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
export function AccountPanel({
  title,
  kind,
  children,
  className = '',
}: {
  title: string;
  kind: AccountKind;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`account-panel ${className}`}>
      <h2>
        <AccountGlyph kind={kind} />
        {title}
      </h2>
      {children}
    </section>
  );
}
