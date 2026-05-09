import { DayPicker } from 'react-day-picker';
import { uk } from 'date-fns/locale';

interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  availableDates?: Date[];
}

export function Calendar({ selected, onSelect, disabled, availableDates }: CalendarProps) {
  return (
    <div className="flex justify-center w-full">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        locale={uk}
        className="w-full"
        modifiers={{ hasSlots: availableDates || [] }}
        modifiersClassNames={{ hasSlots: 'rdp-day_hasSlots' }}
        styles={{
          root: { width: '100%' },
          caption: { position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' },
          month_caption: { fontSize: '1.125rem', fontWeight: '700' },
          nav: { display: 'flex', justifyContent: 'space-between', width: '100%', position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 10 },
          months: { width: '100%' },
          month: { width: '100%' },
          table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0.25rem' },
          head_cell: { color: 'var(--muted-foreground)', fontWeight: '600', fontSize: '0.875rem', paddingBottom: '0.5rem', textTransform: 'uppercase' },
          day_button: {
            borderRadius: '1rem',
            width: '2.75rem',
            height: '2.75rem',
            transition: 'all 0.3s ease',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '500',
            position: 'relative',
          },
          selected: {
            backgroundColor: 'var(--primary)',
            color: 'white',
            fontWeight: '700',
            boxShadow: '0 4px 14px -4px rgba(139, 92, 246, 0.4)',
          },
          today: {
            color: 'var(--primary)',
            fontWeight: '700',
          },
        }}
      />
    </div>
  );
}
