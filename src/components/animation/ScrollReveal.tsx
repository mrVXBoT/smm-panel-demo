import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  yOffset = 24,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !elementRef.current) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        y: yOffset,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power2.out',
      },
    );
  }, [delay, duration, yOffset]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
