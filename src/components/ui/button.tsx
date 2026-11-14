import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../core/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-brand-primary text-slate-950 hover:bg-sky-400 shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/40',
        secondary:
          'bg-brand-surface-dark/80 text-brand-text-dark border border-slate-700/60 hover:bg-brand-elevated-dark hover:border-slate-600',
        accent:
          'bg-brand-accent text-slate-950 hover:bg-purple-300 shadow-md shadow-brand-accent/20 hover:shadow-brand-accent/40',
        outline:
          'border border-slate-700/80 bg-transparent text-brand-text-dark hover:bg-slate-800/50 hover:border-slate-500',
        ghost: 'text-brand-muted-dark hover:text-brand-text-dark hover:bg-slate-800/40',
        danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-2xl px-6 text-base font-bold',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';
