import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface MascotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  mood?: 'idle' | 'happy' | 'thinking' | 'stars';
}

export function MascotCharacter({ className = '', size = 'md', mood = 'idle' }: MascotProps) {
  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${dimensions} ${className}`}>
      {/* Ambient glow behind mascot */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 via-brand-accent/20 to-sky-400/10 rounded-full blur-xl animate-pulse" />

      {/* Mascot vector body with gentle hover animation */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0, 1.5, -1.5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-full h-full flex items-center justify-center select-none"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_10px_20px_rgba(56,189,248,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <path d="M100 45 L100 22" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="18" r="8" fill="#38BDF8" />
          <circle cx="100" cy="18" r="4" fill="#FFFFFF" />

          {/* Ears / Side Thrusters */}
          <rect
            x="26"
            y="80"
            width="16"
            height="34"
            rx="8"
            fill="#18263D"
            stroke="#38BDF8"
            strokeWidth="3"
          />
          <rect
            x="158"
            y="80"
            width="16"
            height="34"
            rx="8"
            fill="#18263D"
            stroke="#38BDF8"
            strokeWidth="3"
          />
          <circle cx="34" cy="97" r="3" fill="#A78BFA" />
          <circle cx="166" cy="97" r="3" fill="#A78BFA" />

          {/* Main Head Chassis */}
          <rect
            x="38"
            y="48"
            width="124"
            height="104"
            rx="32"
            fill="url(#chassisGrad)"
            stroke="#38BDF8"
            strokeWidth="3.5"
          />

          {/* Visor Screen */}
          <rect
            x="52"
            y="66"
            width="96"
            height="62"
            rx="18"
            fill="#0B1120"
            stroke="#1E293B"
            strokeWidth="2"
          />

          {/* Visor grid effect */}
          <line
            x1="52"
            y1="84"
            x2="148"
            y2="84"
            stroke="#18263D"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <line
            x1="52"
            y1="104"
            x2="148"
            y2="104"
            stroke="#18263D"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* Expressive Visor Eyes */}
          {mood === 'stars' ? (
            <g fill="#F59E0B">
              <polygon points="76,82 80,94 92,94 82,102 86,114 76,106 66,114 70,102 60,94 72,94" />
              <polygon points="124,82 128,94 140,94 130,102 134,114 124,106 114,114 118,102 108,94 120,94" />
            </g>
          ) : mood === 'happy' ? (
            <g stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" fill="none">
              <path d="M68 96 Q 78 82 88 96" />
              <path d="M112 96 Q 122 82 132 96" />
            </g>
          ) : (
            <g fill="#38BDF8">
              {/* Cyan Digital Glowing Eyes */}
              <circle cx="78" cy="94" r="8" />
              <circle cx="122" cy="94" r="8" />
              <circle cx="81" cy="91" r="3" fill="#FFFFFF" />
              <circle cx="125" cy="91" r="3" fill="#FFFFFF" />
            </g>
          )}

          {/* Smile / Mouth */}
          <path
            d="M92 114 Q 100 120 108 114"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Collar / Floating Core */}
          <path
            d="M72 152 L128 152 L116 168 L84 168 Z"
            fill="#18263D"
            stroke="#A78BFA"
            strokeWidth="2"
          />
          <circle cx="100" cy="160" r="4" fill="#A78BFA" />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="chassisGrad"
              x1="38"
              y1="48"
              x2="162"
              y2="152"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1E293B" />
              <stop offset="0.6" stopColor="#111B2E" />
              <stop offset="1" stopColor="#0B1120" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating companion badge */}
        <div className="absolute -bottom-2 -right-1 bg-brand-elevated-dark/95 border border-brand-primary/50 text-[10px] font-bold text-brand-primary px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md">
          <Sparkles className="w-2.5 h-2.5 text-brand-accent animate-spin" />
          <span>NOVA</span>
        </div>
      </motion.div>
    </div>
  );
}
