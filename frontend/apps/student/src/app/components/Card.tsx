import { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            'rounded-[2rem] p-6 relative overflow-hidden transition-all duration-300',
            {
              'bg-card text-card-foreground shadow-float border border-border/50': variant === 'default',
              'bg-white/70 backdrop-blur-xl border border-white/50 shadow-soft': variant === 'glass',
              'bg-gradient-to-br from-primary to-[#a78bfa] text-primary-foreground shadow-soft border-none': variant === 'gradient',
              'hover:shadow-lg hover:-translate-y-1 cursor-pointer': interactive,
            },
            className
          )
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
