import { motion } from 'motion/react';
import { Send, Sparkles, Crown, PhoneCall, Youtube, Instagram, Music2 } from 'lucide-react';

export function FloatingSocialTokens() {
  const tokens = [
    {
      id: 'tg',
      icon: Send,
      color: 'from-sky-400 to-blue-600',
      shadow: 'shadow-sky-500/30',
      label: 'Telegram',
      top: '12%',
      left: '8%',
      delay: 0,
      duration: 5,
    },
    {
      id: 'stars',
      icon: Sparkles,
      color: 'from-amber-300 to-amber-500',
      shadow: 'shadow-amber-500/30',
      label: 'Stars',
      top: '20%',
      right: '12%',
      delay: 0.8,
      duration: 6,
    },
    {
      id: 'premium',
      icon: Crown,
      color: 'from-purple-400 to-violet-600',
      shadow: 'shadow-purple-500/30',
      label: 'Premium',
      bottom: '24%',
      left: '10%',
      delay: 1.4,
      duration: 5.5,
    },
    {
      id: 'numbers',
      icon: PhoneCall,
      color: 'from-emerald-400 to-teal-600',
      shadow: 'shadow-emerald-500/30',
      label: 'Numbers',
      bottom: '18%',
      right: '10%',
      delay: 0.5,
      duration: 6.5,
    },
    {
      id: 'yt',
      icon: Youtube,
      color: 'from-red-500 to-rose-600',
      shadow: 'shadow-rose-500/30',
      label: 'YouTube',
      top: '50%',
      right: '4%',
      delay: 1.8,
      duration: 7,
    },
    {
      id: 'ig',
      icon: Instagram,
      color: 'from-pink-500 via-rose-500 to-yellow-500',
      shadow: 'shadow-pink-500/30',
      label: 'Instagram',
      top: '46%',
      left: '4%',
      delay: 1.2,
      duration: 5.8,
    },
    {
      id: 'tt',
      icon: Music2,
      color: 'from-cyan-400 to-fuchsia-500',
      shadow: 'shadow-cyan-500/30',
      label: 'TikTok',
      bottom: '40%',
      right: '18%',
      delay: 2.2,
      duration: 6.2,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {tokens.map((t) => {
        const Icon = t.icon;
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.7, 1, 0.7],
              y: [0, -14, 0],
              rotate: [0, 6, -6, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: t.duration,
              delay: t.delay,
              ease: 'easeInOut',
            }}
            style={{
              top: t.top,
              left: t.left,
              right: t.right,
              bottom: t.bottom,
            }}
            className="absolute hidden md:flex items-center gap-2 p-2.5 rounded-2xl bg-brand-surface-dark/85 border border-slate-700/60 backdrop-blur-md shadow-xl"
          >
            <div
              className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${t.color} flex items-center justify-center text-white shadow-md ${t.shadow}`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-200 pr-1">{t.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
