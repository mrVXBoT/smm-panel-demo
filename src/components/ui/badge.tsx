import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../core/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-brand-primary/15 text-brand-primary border-brand-primary/30',
        secondary:
          'border-transparent bg-brand-elevated-dark text-brand-secondary border-brand-border',
        accent: 'border-transparent bg-brand-accent/15 text-brand-accent border-brand-accent/30',
        success: 'border-transparent bg-emerald-500/15 text-brand-success border-emerald-500/30',
        warning: 'border-transparent bg-amber-500/15 text-brand-warning border-amber-500/30',
        danger: 'border-transparent bg-rose-500/15 text-brand-danger border-rose-500/30',
        outline: 'text-brand-secondary border-brand-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
