import { useId } from 'react';
import './BrandGlyph.css';

type Glyph = 'nova' | 'launch' | 'privacy' | 'processing';
/** Original Nova glyphs, drawn for the brand rather than borrowed from an icon set. */
export function BrandGlyph({ kind, className = '' }: { kind: Glyph; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={`brand-glyph glyph-${kind} ${className}`}
    >
      <defs>
        <linearGradient
          id={`${id}-metal`}
          x1="12"
          y1="8"
          x2="65"
          y2="72"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e6faff" />
          <stop offset=".35" stopColor="currentColor" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient
          id={`${id}-glass`}
          x1="20"
          y1="10"
          x2="60"
          y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" stopOpacity=".22" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".03" />
        </linearGradient>
      </defs>
      {kind === 'nova' && (
        <>
          <path
            d="M40 10L47 30L68 39L48 47L40 69L32 49L11 40L31 32L40 10Z"
            fill={`url(#${id}-metal)`}
          />
          <path d="M40 26L44 36L54 40L44 44L40 55L36 45L26 40L36 36L40 26Z" fill="var(--surface)" />
          <path
            d="M15 22L21 16M59 63L65 57M61 19H68M65 15V23"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
      {kind === 'launch' && (
        <>
          <path
            d="M18 47C28 28 42 18 64 16C62 38 52 52 33 62L18 47Z"
            fill={`url(#${id}-glass)`}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M25 50L53 27M37 25L21 26L13 40L24 40M55 44L54 59L40 67L40 55"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="48" cy="32" r="5" fill={`url(#${id}-metal)`} />
          <path
            d="M24 57L14 67M19 53L10 59M29 62L23 71"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {kind === 'privacy' && (
        <>
          <path
            d="M40 7L66 19V38C66 55 56 67 40 74C24 67 14 55 14 38V19L40 7Z"
            fill={`url(#${id}-glass)`}
            stroke={`url(#${id}-metal)`}
            strokeWidth="2.5"
          />
          <path
            d="M40 15L59 24V39C59 52 52 61 40 67C28 61 21 52 21 39V24L40 15Z"
            stroke="currentColor"
            strokeOpacity=".4"
          />
          <path
            d="M31 36V29C31 17 49 17 49 29V36"
            stroke={`url(#${id}-metal)`}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect x="26" y="34" width="28" height="24" rx="7" fill={`url(#${id}-metal)`} />
          <path d="M40 43V49" stroke="var(--surface)" strokeWidth="4" strokeLinecap="round" />
          <circle
            cx="65"
            cy="19"
            r="5"
            fill="var(--surface)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M63 19L65 21L68 17"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </>
      )}
      {kind === 'processing' && (
        <>
          <circle cx="40" cy="40" r="27" stroke="currentColor" strokeOpacity=".15" />
          <path
            d="M16 30C20 17 36 9 50 16M64 50C60 63 44 71 30 64"
            stroke={`url(#${id}-metal)`}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M51 10L53 18L45 21M29 70L27 62L35 59"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M40 24L54 32V48L40 56L26 48V32L40 24Z"
            fill={`url(#${id}-glass)`}
            stroke={`url(#${id}-metal)`}
            strokeWidth="2"
          />
          <path d="M40 32L45 40L40 48L35 40L40 32Z" fill={`url(#${id}-metal)`} />
          <rect
            x="8"
            y="35"
            width="10"
            height="10"
            rx="3"
            fill="var(--surface)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="62"
            y="35"
            width="10"
            height="10"
            rx="3"
            fill="var(--surface)"
            stroke="currentColor"
            strokeWidth="2"
          />
        </>
      )}
    </svg>
  );
}
export function CardPattern({ variant }: { variant: 'stars' | 'growth' | 'premium' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={`nova-card-pattern pattern-${variant}`}
      viewBox="0 0 360 450"
      preserveAspectRatio="xMidYMin slice"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={id}
          width={variant === 'premium' ? 48 : 28}
          height={variant === 'premium' ? 48 : 28}
          patternUnits="userSpaceOnUse"
        >
          {variant === 'stars' ? (
            <>
              <circle cx="14" cy="14" r=".9" fill="currentColor" />
              <path d="M14 0V5M0 14H5" stroke="currentColor" strokeOpacity=".25" />
            </>
          ) : variant === 'premium' ? (
            <path
              d="M24 0L48 24L24 48L0 24L24 0ZM0 0L48 48M48 0L0 48"
              stroke="currentColor"
              strokeWidth=".5"
              fill="none"
            />
          ) : (
            <path d="M0 0H28V28" stroke="currentColor" strokeWidth=".6" fill="none" />
          )}
        </pattern>
        <linearGradient id={`${id}-fade`} x2="0" y2="1">
          <stop stopColor="white" />
          <stop offset=".85" stopColor="black" />
        </linearGradient>
        <mask id={`${id}-mask`}>
          <rect width="360" height="450" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-mask)`}>
        <rect width="360" height="450" fill={`url(#${id})`} />
        {variant === 'growth' ? (
          <g stroke="currentColor" strokeWidth=".8" opacity=".7">
            <ellipse cx="300" cy="120" rx="145" ry="60" transform="rotate(-30 300 120)" />
            <ellipse cx="300" cy="120" rx="178" ry="80" transform="rotate(-30 300 120)" />
            <ellipse cx="300" cy="120" rx="210" ry="100" transform="rotate(-30 300 120)" />
          </g>
        ) : variant === 'stars' ? (
          <g stroke="currentColor" strokeWidth=".8">
            <path d="M230 30L300 70L250 140L320 200" />
            <circle cx="230" cy="30" r="3" />
            <circle cx="300" cy="70" r="3" />
            <circle cx="250" cy="140" r="3" />
          </g>
        ) : (
          <path
            d="M195 -10L340 135L195 280M230 -10L375 135L230 280"
            stroke="currentColor"
            strokeWidth="1"
          />
        )}
      </g>
    </svg>
  );
}
