import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Clock, User as UserIcon, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface Lesson {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  instructorName: string;
}

interface LessonCardProps {
  lesson: Lesson;
  onCancel: () => void;
}

export function LessonCard({ lesson, onCancel }: LessonCardProps) {
  return (
    <Card variant="gradient" className="relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
      
      <div className="flex items-start justify-between mb-5 relative z-10">
        <h3 className="font-semibold text-white/90 text-lg tracking-tight">Наступне заняття</h3>
        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
          Заплановано
        </span>
      </div>

      <div className="space-y-3 mb-6 relative z-10">
        <div className="flex items-center gap-3 text-white/90">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
            <CalendarIcon size={20} className="text-white" />
          </div>
          <span className="font-medium text-[15px] capitalize">{format(lesson.date, 'EEEE, d MMMM', { locale: uk })}</span>
        </div>

        <div className="flex items-center gap-3 text-white/90">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
            <Clock size={20} className="text-white" />
          </div>
          <span className="font-medium text-[15px]">{lesson.startTime} - {lesson.endTime}</span>
        </div>

        <div className="flex items-center gap-3 text-white/90">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
            <UserIcon size={20} className="text-white" />
          </div>
          <span className="font-medium text-[15px]">{lesson.instructorName}</span>
        </div>
      </div>

      <Button
        variant="glass"
        className="w-full text-white hover:text-primary relative z-10"
        onClick={onCancel}
      >
        Скасувати / Перенести
      </Button>
    </Card>
  );
}
