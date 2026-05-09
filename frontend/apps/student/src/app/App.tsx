import { useState, useEffect, useCallback } from 'react';
import { LoginPage } from './components/LoginPage';
import { isBefore, differenceInHours, format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, MessageCircle, Bell, BookOpen, Settings, ChevronRight } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { LessonCard } from './components/LessonCard';
import { ProgressBar } from './components/ProgressBar';
import { FAB } from './components/FAB';
import { BottomNav } from './components/BottomNav';
import { Modal } from './components/Modal';
import { Calendar } from './components/Calendar';
import { TimeSlotPicker } from './components/TimeSlotPicker';
import { Banner } from './components/Banner';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  role: string;
  assigned_instructor_id?: string;
}

interface Lesson {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  instructorName: string;
  bookingId: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Note {
  id: string;
  date: Date;
  text: string;
}

export default function App() {
  // ─── Auth state ────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ─── UI state ──────────────────────────────────
  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'profile'>('home');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string>();
  const [bookingStep, setBookingStep] = useState<1 | 2>(1);
  const [notifications, setNotifications] = useState(true);

  // ─── Data from API ─────────────────────────────
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [lessonsThisWeek, setLessonsThisWeek] = useState(0);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);

  // ─── Restore session ──────────────────────────
  useEffect(() => {
    if (api.restoreSession()) {
      const storedUser = api.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setIsLoggedIn(true);
      }
    }
  }, []);

  // ─── Fetch data when logged in ────────────────
  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch bookings
      const bookings = await api.getBookings();
      const mapped: Lesson[] = bookings
        .filter((b: any) => b.status === 'confirmed')
        .map((b: any) => ({
          id: b.id,
          date: parseISO(b.slot.start_time),
          startTime: format(parseISO(b.slot.start_time), 'HH:mm'),
          endTime: format(parseISO(b.slot.end_time), 'HH:mm'),
          instructorName: b.slot.instructor?.name || 'Інструктор',
          bookingId: b.id,
        }))
        .sort((a: Lesson, b: Lesson) => a.date.getTime() - b.date.getTime());
      setLessons(mapped);

      // Fetch availability
      const availability = await api.getAvailability();
      setLessonsThisWeek(availability.lessons_this_week);

      // Fetch notes
      const fetchedNotes = await api.getNotes(user.id);
      setNotes(
        fetchedNotes.map((n: any) => ({
          id: n.id,
          date: parseISO(n.created_at),
          text: n.text,
        }))
      );
    } catch (err: any) {
      if (err.code === 'UNAUTHORIZED') {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn, fetchData]);

  // ─── Auth handlers ────────────────────────────

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch { /* ignore */ }
    setUser(null);
    setIsLoggedIn(false);
    setLessons([]);
    setNotes([]);
  };

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin as any} />;

  // ─── Derived state ────────────────────────────

  const nextLesson = lessons.length > 0 ? lessons[0] : null;
  const canBookMore = lessonsThisWeek < 2;
  const hasAvailableSlots = timeSlots.some((slot) => slot.available);

  // ─── Booking flow ─────────────────────────────

  const handleOpenBooking = async () => {
    setBookingModalOpen(true);
    setBookingStep(1);
    setSelectedDate(undefined);
    setSelectedSlot(undefined);
    setTimeSlots([]);
    setAvailableDates([]);

    if (user?.assigned_instructor_id) {
      try {
        const slots = await api.getSlots({
          instructor_id: user.assigned_instructor_id,
        });
        const datesWithSlots = slots
          .filter((s: any) => s.status === 'available')
          .map((s: any) => parseISO(s.start_time));
        
        setAvailableDates(datesWithSlots);
      } catch {
        toast.error('Не вдалось завантажити доступні дні');
      }
    }
  };

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && user?.assigned_instructor_id) {
      // Fetch real slots for this date from the API
      try {
        const dateStr = format(date, 'yyyy-MM-dd');
        const slots = await api.getSlots({
          instructor_id: user.assigned_instructor_id,
          date: dateStr,
        });
        setTimeSlots(
          slots.map((s: any) => ({
            id: s.id,
            time: `${format(parseISO(s.start_time), 'HH:mm')} - ${format(parseISO(s.end_time), 'HH:mm')}`,
            available: s.status === 'available',
          }))
        );
        setBookingStep(2);
      } catch {
        toast.error('Не вдалось завантажити слоти');
      }
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;
    try {
      await api.createBooking(selectedSlot);
      setBookingModalOpen(false);
      toast.success('Заняття успішно заброньовано!', {
        className: 'bg-white/80 backdrop-blur-xl border-white/40 shadow-float rounded-2xl text-foreground font-medium'
      });
      fetchData(); // Refresh data
    } catch (err: any) {
      if (err.code === 'CONFLICT') {
        toast.error('Слот вже зайнято. Оберіть інший.');
      } else {
        toast.error(err.message || 'Помилка бронювання');
      }
    }
  };

  const handleJoinWaitlist = async () => {
    if (!selectedDate || !user?.assigned_instructor_id) return;
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const result = await api.joinWaitlist(dateStr, user.assigned_instructor_id);
      setBookingModalOpen(false);
      toast.info(`Ви додані до черги (позиція: ${result.position}). Повідомимо, коли з'явиться вільне місце.`, {
        className: 'bg-white/80 backdrop-blur-xl border-white/40 shadow-float rounded-2xl text-foreground font-medium'
      });
    } catch (err: any) {
      toast.error(err.message || 'Не вдалось стати в чергу');
    }
  };

  const handleCancelLesson = () => {
    if (!nextLesson) return;
    const hoursUntilLesson = differenceInHours(nextLesson.date, new Date());
    if (hoursUntilLesson < 24) {
      setCancelModalOpen(true);
    } else {
      confirmCancel();
    }
  };

  const confirmCancel = async () => {
    if (!nextLesson) return;
    try {
      await api.cancelBooking(nextLesson.bookingId);
      setCancelModalOpen(false);
      toast.success('Заняття скасовано', {
        className: 'bg-white/80 backdrop-blur-xl border-white/40 shadow-float rounded-2xl text-foreground font-medium'
      });
      fetchData(); // Refresh data
    } catch (err: any) {
      toast.error(err.message || 'Не вдалось скасувати заняття');
      setCancelModalOpen(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'Учень';

  return (
    <div className="min-h-screen bg-background pb-32 overflow-x-hidden">
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'bg-white/90 backdrop-blur-xl border border-white/50 shadow-float rounded-2xl text-foreground font-semibold px-6 py-4'
        }} 
      />

      {/* Premium Header */}
      <header className="px-6 pt-12 pb-6 sticky top-0 z-20 bg-background/80 backdrop-blur-2xl border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Вітаємо, {firstName} 👋</p>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              GoDrive
            </h1>
          </div>
          <button onClick={handleLogout} className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
             <span className="text-lg font-bold text-foreground">{firstName.charAt(0)}</span>
          </button>
        </div>
      </header>

      {activeTab === 'home' && (
        <main className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {nextLesson ? (
            <LessonCard lesson={nextLesson} onCancel={handleCancelLesson} />
          ) : (
            <Card variant="glass" className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                 <CalendarIcon size={28} className="text-primary" />
              </div>
              <p className="text-foreground font-medium text-lg mb-1">Немає занять</p>
              <p className="text-muted-foreground text-center max-w-[200px]">
                Забронюйте своє перше заняття, щоб почати навчання
              </p>
            </Card>
          )}

          <Card variant="glass">
            <h3 className="font-semibold text-foreground mb-4 text-lg">Прогрес тижня</h3>
            <ProgressBar value={lessonsThisWeek} max={2} label="Відкатано занять" />
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card interactive variant="glass" className="p-5 flex flex-col items-center text-center gap-3" onClick={handleOpenBooking}>
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <CalendarIcon size={24} />
               </div>
               <span className="font-semibold text-foreground text-sm">Забронювати<br/>заняття</span>
            </Card>
            
            <Card interactive variant="glass" className="p-5 flex flex-col items-center text-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc]">
                 <MessageCircle size={24} />
               </div>
               <span className="font-semibold text-foreground text-sm">Telegram<br/>бот</span>
            </Card>
          </div>
        </main>
      )}

      {activeTab === 'schedule' && (
        <main className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-foreground">Мої заняття</h2>

          {lessons.length === 0 ? (
            <Card variant="glass" className="flex flex-col items-center justify-center py-12">
               <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                 <CalendarIcon size={28} className="text-muted-foreground" />
               </div>
              <p className="text-muted-foreground text-center font-medium">
                У вас ще немає запланованих занять
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id} variant="glass" interactive>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground text-lg">
                          {lesson.startTime} - {lesson.endTime}
                        </p>
                        <p className="text-sm font-medium text-primary mt-0.5 capitalize">
                          {lesson.date.toLocaleDateString('uk-UA', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                          })}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                        Активне
                      </span>
                    </div>
                    <div className="h-px w-full bg-border/50 my-2" />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                         <span className="text-[10px] font-bold text-foreground">{lesson.instructorName.charAt(0)}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground/80">
                        {lesson.instructorName}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      )}

      {activeTab === 'profile' && (
        <main className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-foreground">Профіль</h2>

          <Card variant="glass" className="p-0 overflow-hidden">
            <div className="p-5 border-b border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Налаштування</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                      <Bell size={20} />
                    </div>
                    <span className="font-medium text-foreground">Сповіщення</span>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
                      notifications ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${
                        notifications ? 'left-6' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <button className="flex items-center justify-between w-full py-2 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Settings size={20} />
                    </div>
                    <span className="font-medium text-foreground">Загальні налаштування</span>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
            
            <div className="p-5 bg-gradient-to-br from-[#0088cc]/5 to-transparent">
              <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-[#0088cc] flex items-center justify-center text-white shrink-0 shadow-soft">
                   <MessageCircle size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-foreground mb-1">Telegram Бот</h3>
                   <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                     Отримуйте миттєві сповіщення про заняття та зміни в розкладі
                   </p>
                   <Button variant="primary" size="sm" className="bg-[#0088cc] hover:shadow-[#0088cc]/30 shadow-sm">
                     Підключити
                   </Button>
                 </div>
              </div>
            </div>
          </Card>

          <Card variant="glass">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <BookOpen size={18} />
              </div>
              Нотатки інструктора
            </h3>
            {notes.length === 0 ? (
              <p className="text-muted-foreground text-sm">Нотаток ще немає</p>
            ) : (
              <div className="space-y-4 mt-2">
                {notes.map((note) => (
                  <div key={note.id} className="relative pl-5 py-2">
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full" />
                    <p className="text-[15px] text-foreground leading-relaxed font-medium">{note.text}</p>
                    <p className="text-xs font-semibold text-primary mt-2">
                      {note.date.toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      )}

      {activeTab === 'home' && <FAB label="Забронювати" onClick={handleOpenBooking} />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <Modal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        title={bookingStep === 1 ? 'Оберіть дату' : 'Оберіть час'}
        footer={
          bookingStep === 2 && (
            <div className="flex gap-3 w-full">
              <Button variant="secondary" className="flex-1" onClick={() => setBookingStep(1)}>
                Назад
              </Button>
              {hasAvailableSlots ? (
                <Button className="flex-1" onClick={handleConfirmBooking} disabled={!selectedSlot || !canBookMore}>
                  Підтвердити
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" onClick={handleJoinWaitlist}>Стати в чергу</Button>
              )}
            </div>
          )
        }
      >
        {!canBookMore && (
          <Banner variant="warning" className="mb-4">
            Ви вже маєте 2 заняття на цьому тижні. Бронювання нових занять недоступне.
          </Banner>
        )}

        {bookingStep === 1 && (
          <div className="bg-secondary/30 rounded-3xl p-2 border border-border/50">
             <Calendar
               selected={selectedDate}
               onSelect={handleDateSelect}
               disabled={(date) => isBefore(date, new Date()) || !canBookMore}
               availableDates={availableDates}
             />
          </div>
        )}

        {bookingStep === 2 && (
          <div className="space-y-4">
            {!hasAvailableSlots && (
              <Banner variant="info">
                На обрану дату немає вільних місць. Ви можете стати в чергу.
              </Banner>
            )}
            <TimeSlotPicker
              slots={timeSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
            />
          </div>
        )}
      </Modal>

      <Modal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        title="Скасування заняття"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setCancelModalOpen(false)}>
              Назад
            </Button>
            <Button variant="danger" className="flex-1" onClick={confirmCancel}>
              Скасувати
            </Button>
          </div>
        }
      >
        <Banner variant="warning" className="mb-6">
          До заняття менше 24 годин. Можливе нарахування штрафних санкцій за пізнє скасування.
        </Banner>
        <p className="text-foreground/80 font-medium text-center">Ви дійсно бажаєте скасувати це заняття?</p>
      </Modal>
    </div>
  );
}
