import { useId } from 'react';
/** Original small product emblems for the dock; intentionally distinct from utility icons. */
export function ProductMark({ product }: { product: 'stars' | 'premium' | 'growth' }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className="dock-product-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="4" y1="3" x2="27" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity=".95" />
          <stop offset=".4" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".4" />
        </linearGradient>
      </defs>
      {product === 'stars' ? (
        <>
          <path
            d="M16 2L20 11L30 13L23 20L24 30L16 25L7 30L9 20L2 13L12 11L16 2Z"
            fill={`url(#${id})`}
          />
          <path
            d="M16 7L18 14L25 15L19 19L20 24L16 21L11 24L13 18L7 15L14 14L16 7Z"
            stroke="var(--surface)"
            strokeOpacity=".45"
          />
          <path d="M16 9V21M10 15L22 19" stroke="white" strokeOpacity=".35" />
        </>
      ) : product === 'premium' ? (
        <>
          <path d="M4 8L11 13L16 3L21 13L28 8L25 24H7L4 8Z" fill={`url(#${id})`} />
          <path
            d="M8 28H24M10 21H22M11 13L16 20L21 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M16 10L19 15L16 19L13 15L16 10Z" fill="var(--surface)" />
        </>
      ) : (
        <>
          <path
            d="M3 25L10 18L16 21L27 7"
            stroke={`url(#${id})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 6H28V15"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M4 30H28" stroke="currentColor" strokeOpacity=".4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
