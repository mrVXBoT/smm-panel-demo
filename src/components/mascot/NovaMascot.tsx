import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import { Crown, Sparkles, TrendingUp, Check, HeartHandshake, LoaderCircle } from 'lucide-react';

export type MascotMood = 'idle' | 'stars' | 'premium' | 'growth' | 'success' | 'error' | 'loading';
interface NovaMascotProps {
  mood?: MascotMood;
  compact?: boolean;
  interactive?: boolean;
}
const moods = {
  idle: { label: 'Meet Nova', message: 'Your guide to a brighter Telegram.', icon: Sparkles },
  stars: { label: 'Star power', message: 'A little sparkle for your next idea.', icon: Sparkles },
  premium: {
    label: 'Something special',
    message: 'Give your next chapter the royal treatment.',
    icon: Crown,
  },
  growth: {
    label: 'Onwards & upwards',
    message: 'Let’s give your channel room to grow.',
    icon: TrendingUp,
  },
  success: { label: 'Nicely done!', message: 'Your action is complete.', icon: Check },
  error: {
    label: 'Let’s try again',
    message: 'Check the details. I’m right here.',
    icon: HeartHandshake,
  },
  loading: {
    label: 'One moment',
    message: 'Getting everything ready for you.',
    icon: LoaderCircle,
  },
} satisfies Record<MascotMood, { label: string; message: string; icon: typeof Sparkles }>;

export function NovaMascot({
  mood = 'idle',
  compact = false,
  interactive = false,
}: NovaMascotProps) {
  const reducedMotion = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<MascotMood>('idle');
  const [burstId, setBurstId] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const activeMood = interactive && mood === 'idle' ? selected : mood;
  const { label, message } = moods[activeMood];
  const hasBurst = ['stars', 'premium', 'growth', 'success'].includes(activeMood);
  const resetTilt = () => {
    stage.current?.style.setProperty('--nova-x', '0deg');
    stage.current?.style.setProperty('--nova-y', '0deg');
  };
  const followPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (
      reducedMotion ||
      event.pointerType !== 'mouse' ||
      !window.matchMedia('(pointer: fine)').matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    stage.current?.style.setProperty(
      '--nova-x',
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * 10}deg`,
    );
    stage.current?.style.setProperty(
      '--nova-y',
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * -8}deg`,
    );
  };
  return (
    <div
      className={`nova-mascot ${compact ? 'nova-compact' : ''}`}
      data-mood={activeMood}
      data-motion={reducedMotion ? 'reduced' : 'full'}
    >
      <div
        className="nova-stage"
        ref={stage}
        onPointerMove={followPointer}
        onPointerLeave={resetTilt}
      >
        <div className="nova-aura" aria-hidden="true" />
        <div className="nova-orbit" aria-hidden="true" />
        <div className="nova-character">
          {imageFailed ? (
            <div className="nova-image-fallback" role="img" aria-label="Nova mascot">
              <Sparkles size={64} />
            </div>
          ) : (
            <img
              src="/images/nova-mascot.png"
              alt="Nova, a friendly white robot with cyan eyes and a purple cape, giving a thumbs up"
              width="384"
              height="384"
              loading={compact ? 'lazy' : 'eager'}
              decoding="async"
              draggable={false}
              onError={() => setImageFailed(true)}
            />
          )}
          {hasBurst && !reducedMotion && !imageFailed && (
            <span
              key={`coat-${activeMood}-${burstId}`}
              className="nova-coating"
              aria-hidden="true"
            />
          )}
        </div>
        {hasBurst && !reducedMotion && (
          <div
            key={`${activeMood}-${burstId}`}
            className="nova-burst"
            data-effect={activeMood}
            aria-hidden="true"
          >
            <span className="nova-shockwave" />
            <span className="nova-shockwave nova-shockwave-delayed" />
            {Array.from({ length: 20 }, (_, index) => {
              const angle = (index / 20) * Math.PI * 2;
              const radius = (compact ? 48 : 135) + (index % 3) * (compact ? 7 : 22);
              return (
                <span
                  key={index}
                  className={`nova-particle nova-particle-${index % 3}`}
                  style={
                    {
                      '--burst-x': `${Math.cos(angle) * radius}px`,
                      '--burst-y': `${Math.sin(angle) * radius - (compact ? 12 : 30)}px`,
                      '--burst-angle': `${index * 43}deg`,
                      '--burst-delay': `${(index % 5) * 35}ms`,
                      '--burst-size': `${(compact ? 5 : 10) + (index % 3) * (compact ? 2 : 5)}px`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>
        )}
        <div className="nova-platform" aria-hidden="true" />
      </div>
      <div
        className="nova-caption"
        role={activeMood === 'success' || activeMood === 'error' ? 'status' : undefined}
      >
        <span className="nova-label">{label}</span>
        {!compact && <p>{message}</p>}
      </div>
      {interactive && (
        <div className="nova-choices" role="group" aria-label="Explore with Nova">
          {(['stars', 'premium', 'growth'] as const).map((value) => {
            const ChoiceIcon = moods[value].icon;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected === value}
                onClick={() => {
                  setSelected(value);
                  setBurstId((id) => id + 1);
                }}
              >
                <ChoiceIcon size={14} />
                {value === 'stars' ? 'Stars' : value === 'premium' ? 'Premium' : 'Growth'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
