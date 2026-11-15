import { useId } from 'react';
export type AccountKind = 'wallet' | 'transactions' | 'support' | 'profile';
export function AccountGlyph({ kind, className = '' }: { kind: AccountKind; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={`account-glyph ${className}`}
    >
      <defs>
        <linearGradient id={id} x1="5" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset=".4" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".35" />
        </linearGradient>
      </defs>
      {kind === 'wallet' ? (
        <>
          <path d="M8 14L34 7V16H8Z" fill={`url(#${id})`} />
          <rect
            x="5"
            y="14"
            width="37"
            height="28"
            rx="8"
            fill="currentColor"
            fillOpacity=".12"
            stroke={`url(#${id})`}
            strokeWidth="2"
          />
          <path d="M32 23H44V34H32C25 34 25 23 32 23Z" fill={`url(#${id})`} />
          <circle cx="33" cy="28.5" r="2" fill="var(--surface)" />
          <path d="M11 20H23" stroke="currentColor" strokeLinecap="round" />
        </>
      ) : kind === 'transactions' ? (
        <>
          <path
            d="M11 4H37V44L30 40L24 44L18 40L11 44V4Z"
            fill="currentColor"
            fillOpacity=".12"
            stroke={`url(#${id})`}
            strokeWidth="2"
          />
          <path
            d="M18 13H30M18 20H30M18 27H25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="35"
            cy="31"
            r="9"
            fill="var(--surface)"
            stroke={`url(#${id})`}
            strokeWidth="2"
          />
          <path
            d="M32 31L34 33L38 28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : kind === 'support' ? (
        <>
          <path
            d="M7 26V23C7 1 41 1 41 23V29"
            stroke={`url(#${id})`}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="4" y="21" width="9" height="16" rx="4" fill={`url(#${id})`} />
          <rect x="35" y="21" width="9" height="16" rx="4" fill={`url(#${id})`} />
          <path d="M40 36C40 44 31 44 27 44" stroke="currentColor" strokeWidth="2" />
          <rect x="19" y="40" width="11" height="6" rx="3" fill={`url(#${id})`} />
          <path
            d="M19 24L23 28L30 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <rect
            x="8"
            y="7"
            width="32"
            height="37"
            rx="9"
            stroke={`url(#${id})`}
            strokeWidth="2"
            fill="currentColor"
            fillOpacity=".1"
          />
          <rect x="18" y="3" width="12" height="8" rx="3" fill={`url(#${id})`} />
          <circle cx="24" cy="22" r="6" fill={`url(#${id})`} />
          <path
            d="M15 36C15 27 33 27 33 36"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M35 16L38 19L43 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
