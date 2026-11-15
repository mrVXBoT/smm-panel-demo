import { useId } from 'react';

/** Original vector monogram: a continuous N ribbon with a small nova spark. */
export function NovaLogo() {
  const id = useId().replace(/:/g, '');
  return (
    <span className="nova-brand-art" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient
            id={`${id}-ribbon`}
            x1="8"
            y1="40"
            x2="39"
            y2="7"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#22D3EE" />
            <stop offset=".48" stopColor="#67E8F9" />
            <stop offset="1" stopColor="#A78BFA" />
          </linearGradient>
          <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#253953" />
            <stop offset="1" stopColor="#10182B" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="16"
          fill={`url(#${id}-glass)`}
          stroke="#94A3B8"
          strokeOpacity=".25"
        />
        <path
          d="M13 34V15.5C13 13.8 15.1 13.1 16.1 14.5L31.9 33.5C32.9 34.9 35 34.2 35 32.5V14"
          stroke={`url(#${id}-ribbon)`}
          strokeWidth="5.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35 6L36.5 10.5L41 12L36.5 13.5L35 18L33.5 13.5L29 12L33.5 10.5L35 6Z"
          fill="#E3D9FF"
        />
        <path
          d="M5 28C2 36 9 42 20 41"
          stroke="#22D3EE"
          strokeOpacity=".5"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
