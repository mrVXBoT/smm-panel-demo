import { useState, useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { MascotCharacter } from './MascotCharacter';

export type NovaBotMood = 'idle' | 'happy' | 'thinking' | 'stars' | 'success';

interface NovaBotRiveProps {
  mood?: NovaBotMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  riveAssetUrl?: string;
}

export function NovaBotRive({
  mood = 'idle',
  size = 'md',
  className = '',
  riveAssetUrl,
}: NovaBotRiveProps) {
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Set up Rive canvas only if an actual asset URL is supplied and reduced motion is off
  const { rive, RiveComponent } = useRive({
    src: riveAssetUrl || '',
    stateMachines: 'NovaBotStateMachine',
    autoplay: !prefersReducedMotion,
    onLoadError: () => setHasError(true),
  });

  const stateInput = useStateMachineInput(rive, 'NovaBotStateMachine', 'moodState');

  useEffect(() => {
    if (stateInput && rive) {
      const moodIndex = {
        idle: 0,
        happy: 1,
        thinking: 2,
        stars: 3,
        success: 4,
      }[mood];
      stateInput.value = moodIndex;
    }
  }, [mood, stateInput, rive]);

  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }[size];

  // If no Rive file is provided, or canvas errors out, or reduced motion is preferred:
  // Render high-fidelity vector fallback with Motion
  if (!riveAssetUrl || hasError || prefersReducedMotion) {
    return (
      <div className={`relative ${dimensions} ${className}`}>
        <MascotCharacter
          size={size}
          mood={mood === 'success' ? 'happy' : mood}
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${dimensions} ${className}`}>
      <RiveComponent className="w-full h-full select-none" />
    </div>
  );
}
