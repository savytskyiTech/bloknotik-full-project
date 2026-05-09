import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max: number;
  label?: string;
}

export function ProgressBar({ value, max, label, className, ...props }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={twMerge(clsx('w-full', className))} {...props}>
      {label && (
        <div className="flex justify-between items-center mb-3">
          <span className="text-[15px] font-medium text-foreground/80">{label}</span>
          <span className="text-[15px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {value} / {max}
          </span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border/50 shadow-inner">
        <div
          className="bg-gradient-to-r from-primary to-[#c4b5fd] h-full transition-all duration-700 ease-out rounded-full relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'translateX(-100%)'
          }} />
        </div>
      </div>
    </div>
  );
}
