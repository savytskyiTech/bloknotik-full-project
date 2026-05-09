import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot?: string;
  onSelectSlot: (slotId: string) => void;
}

export function TimeSlotPicker({ slots, selectedSlot, onSelectSlot }: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot.id;
        
        return (
          <button
            key={slot.id}
            onClick={() => slot.available && onSelectSlot(slot.id)}
            disabled={!slot.available}
            className={twMerge(
              clsx(
                'px-4 py-4 rounded-2xl border-2 transition-all duration-300 font-semibold text-center relative overflow-hidden group',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                  : slot.available
                  ? 'border-transparent bg-secondary text-foreground hover:bg-primary/5 hover:text-primary active:scale-[0.98]'
                  : 'border-transparent bg-muted/50 text-muted-foreground/50 cursor-not-allowed opacity-60'
              )
            )}
          >
            {isSelected && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[200%] animate-[shimmer_2s_infinite] -translate-x-full" />
            )}
            <span className="relative z-10">{slot.time}</span>
          </button>
        );
      })}
    </div>
  );
}
