import { ReactNode } from 'react';
import { AlertCircle, Info, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BannerProps {
  variant?: 'info' | 'warning' | 'success';
  children: ReactNode;
  className?: string;
}

export function Banner({ variant = 'info', children, className }: BannerProps) {
  const icons = {
    info: Info,
    warning: AlertCircle,
    success: CheckCircle,
  };

  const Icon = icons[variant];

  return (
    <div
      className={twMerge(
        clsx(
          'flex items-start gap-4 p-4 rounded-2xl relative overflow-hidden',
          {
            'bg-blue-500/10 text-blue-700': variant === 'info',
            'bg-amber-500/10 text-amber-700': variant === 'warning',
            'bg-emerald-500/10 text-emerald-700': variant === 'success',
          },
          className
        )
      )}
    >
      <div className={clsx("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl", {
        'bg-blue-500': variant === 'info',
        'bg-amber-500': variant === 'warning',
        'bg-emerald-500': variant === 'success',
      })} />
      
      <div className={clsx("w-8 h-8 rounded-xl flex flex-shrink-0 items-center justify-center", {
        'bg-blue-500/20 text-blue-600': variant === 'info',
        'bg-amber-500/20 text-amber-600': variant === 'warning',
        'bg-emerald-500/20 text-emerald-600': variant === 'success',
      })}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="flex-1 text-[14px] font-medium leading-snug pt-1">{children}</div>
    </div>
  );
}
