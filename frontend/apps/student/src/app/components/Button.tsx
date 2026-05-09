import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            {
              'bg-gradient-to-r from-primary to-[#a78bfa] text-white shadow-soft hover:shadow-lg hover:shadow-primary/30': variant === 'primary',
              'bg-secondary text-secondary-foreground hover:bg-[#e9e3ff]': variant === 'secondary',
              'border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40': variant === 'outline',
              'text-foreground hover:bg-muted/80': variant === 'ghost',
              'bg-destructive/10 text-destructive hover:bg-destructive/20': variant === 'danger',
              'bg-white/50 backdrop-blur-md border border-white/40 text-foreground hover:bg-white/80 shadow-sm': variant === 'glass',
              
              'px-4 py-2 text-sm': size === 'sm',
              'px-6 py-3.5 text-base': size === 'md',
              'px-8 py-4 text-lg': size === 'lg',
              'w-12 h-12 p-0 rounded-2xl': size === 'icon',
            },
            className
          )
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
