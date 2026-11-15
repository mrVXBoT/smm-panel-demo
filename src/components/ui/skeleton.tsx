import { cn } from '../../core/utils/cn';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-brand-elevated-dark/80', className)}
      {...props}
    />
  );
}
