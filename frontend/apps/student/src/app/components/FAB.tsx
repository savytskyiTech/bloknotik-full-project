import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plus } from 'lucide-react';

interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function FAB({ label, className, children, ...props }: FABProps) {
  return (
    <button
      className={twMerge(
        clsx(
          'fixed bottom-24 right-6 bg-gradient-to-r from-primary to-[#a78bfa] text-white rounded-full shadow-soft hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30 z-40 border border-white/20',
          label ? 'px-6 py-4 flex items-center gap-2' : 'w-14 h-14 flex items-center justify-center',
          className
        )
      )}
      {...props}
    >
      {children || <Plus size={24} className="drop-shadow-sm" />}
      {label && <span className="font-semibold tracking-wide drop-shadow-sm">{label}</span>}
    </button>
  );
}
