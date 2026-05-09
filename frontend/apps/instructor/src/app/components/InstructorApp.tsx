import { useState, useEffect, useCallback } from "react";
import { api } from "../../lib/api";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Calendar,
  Users,
  User,
  Clock,
  ChevronRight,
  CheckCircle,
  XCircle,
  Play,
  Plus,
  ArrowLeft,
  Car,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  ChevronLeft,
  Edit3,
  Save,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Check,
} from "lucide-react";

const INSTRUCTOR_AVATAR = "https://images.unsplash.com/photo-1562101074-ddc04071bdc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZHJpdmluZyUyMGluc3RydWN0b3IlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3Nzc5MjkxNjR8MA&ixlib=rb-4.1.0&q=80&w=200";

const STUDENTS = [
  {
    id: 1,
    name: "Олена Коваль",
    phone: "+380 67 123 45 67",
    hours: 12,
    totalHours: 40,
    avatar: "https://images.unsplash.com/photo-1770235622269-bf3124d85032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMGNhc3VhbHxlbnwxfHx8fDE3Nzc5MjkxNjd8MA&ixlib=rb-4.1.0&q=80&w=200",
    level: "Початківець",
    lastLesson: "Паркування, місто",
    nextSlot: "08:00",
  },
  {
    id: 2,
    name: "Максим Бондар",
    phone: "+380 50 987 65 43",
    hours: 28,
    totalHours: 40,
    avatar: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHNtaWxpbmd8ZW58MXx8fHwxNzc3OTI5MTY3fDA&ixlib=rb-4.1.0&q=80&w=200",
    level: "Середній",
    lastLesson: "Автомагістраль, обгін",
    nextSlot: "10:00",
  },
  {
    id: 3,
    name: "Аліна Мельник",
    phone: "+380 93 555 11 22",
    hours: 5,
    totalHours: 40,
    avatar: "https://images.unsplash.com/photo-1664828308091-22cf5cd042e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwc3R1ZGVudCUyMGRyaXZlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NzkyOTE2NHww&ixlib=rb-4.1.0&q=80&w=200",
    level: "Новачок",
    lastLesson: "Рушання з місця, гальмування",
    nextSlot: "13:30",
  },
];

const SCHEDULE = [
  { id: 1, time: "08:00", end: "09:30", studentId: 1, status: "completed" },
  { id: 2, time: "09:30", end: "11:00", studentId: null, status: "free" },
  { id: 3, time: "10:00", end: "11:30", studentId: 2, status: "upcoming" },
  { id: 4, time: "11:30", end: "13:00", studentId: null, status: "free" },
  { id: 5, time: "13:30", end: "15:00", studentId: 3, status: "active" },
  { id: 6, time: "15:00", end: "16:30", studentId: null, status: "blocked", blockReason: "Технічне обслуговування" },
  { id: 7, time: "16:30", end: "18:00", studentId: null, status: "free" },
];

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

type Screen = "home" | "lesson" | "note" | "calendar" | "students" | "student-detail" | "profile";

export function InstructorApp() {
  const [activeTab, setActiveTab] = useState<"home" | "calendar" | "students" | "profile">("home");
  const [screen, setScreen] = useState<Screen>("home");
  const [activeSlot, setActiveSlot] = useState<typeof SCHEDULE[0] | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<typeof STUDENTS[0] | null>(null);
  const [lessonState, setLessonState] = useState<"ready" | "started" | "finished">("ready");
  const [noteText, setNoteText] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [selectedDay, setSelectedDay] = useState(4);

  const [schedule, setSchedule] = useState<any[]>(SCHEDULE);
  const [studentsList, setStudentsList] = useState<any[]>(STUDENTS);

  const fetchData = useCallback(async () => {
    try {
      const user = api.getStoredUser();
      if (!user) return;
      
      const slotsData = await api.getSlots().catch(() => null);
      if (slotsData && Array.isArray(slotsData)) {
        const mappedSchedule = slotsData.map((slot: any) => {
          const booking = slot.booking;
          let status = 'free';
          if (slot.status === 'booked') status = 'upcoming';
          if (booking?.status === 'completed') status = 'completed';
          if (booking?.status === 'no_show') status = 'completed';
          if (slot.status === 'cancelled') status = 'free'; // or hide it
          
          return {
            id: slot.id,
            bookingId: booking?.id,
            date: slot.start_time ? new Date(slot.start_time).getDate() : 0,
            time: slot.start_time ? slot.start_time.substring(11, 16) : '',
            end: slot.end_time ? slot.end_time.substring(11, 16) : '',
            studentId: booking?.student?.id || null,
            studentName: booking?.student?.name || null,
            status: status,
          };
        });
        if (mappedSchedule.length > 0) setSchedule(mappedSchedule);
      }

      const studentsData = await api.getStudents(user.id).catch(() => null);
      if (studentsData && Array.isArray(studentsData)) {
        const mappedStudents = studentsData.map((s: any) => ({
          id: s.id,
          name: s.name,
          phone: s.phone_number || "+380",
          hours: s.total_hours_driven || 0,
          totalHours: 40,
          avatar: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHNtaWxpbmd8ZW58MXx8fHwxNzc3OTI5MTY3fDA&ixlib=rb-4.1.0&q=80&w=200",
          level: "Студент",
          lastLesson: "-",
          nextSlot: "",
        }));
        if (mappedStudents.length > 0) setStudentsList(mappedStudents);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStudent = (id: number | string | null) => studentsList.find((s) => s.id === id) || null;

  const goHome = () => {
    setScreen("home");
    setActiveTab("home");
    setActiveSlot(null);
    setLessonState("ready");
    setNoteSaved(false);
    setNoteText("");
  };

  const handleSaveNote = async () => {
    try {
      if (activeSlot && activeSlot.bookingId) {
        await api.completeBooking(activeSlot.bookingId, 'completed', noteText);
      }
      setNoteSaved(true);
      setTimeout(() => {
        goHome();
        fetchData();
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNoShow = async () => {
    try {
      if (activeSlot && activeSlot.bookingId) {
        await api.completeBooking(activeSlot.bookingId, 'no_show');
      }
      goHome();
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const statusColor = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "active") return "bg-purple-100 text-purple-700";
    if (status === "upcoming") return "bg-blue-100 text-blue-700";
    if (status === "blocked") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-500";
  };

  const statusLabel = (status: string) => {
    if (status === "completed") return "Завершено";
    if (status === "active") return "Зараз";
    if (status === "upcoming") return "Незабаром";
    if (status === "blocked") return "Заблоковано";
    return "Вільно";
  };

  // ─── HOME SCREEN ──────────────────────────────────────
  const HomeScreen = () => (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex flex-col gap-4 px-4 pt-2 pb-28"
    >
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Занять сьогодні", value: "4", icon: <BookOpen size={16} />, color: "from-violet-500 to-purple-600" },
          { label: "Завершено", value: "1", icon: <CheckCircle size={16} />, color: "from-emerald-400 to-green-500" },
          { label: "Годин", value: "6", icon: <Clock size={16} />, color: "from-sky-400 to-blue-500" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl overflow-hidden">
            <div className={`bg-gradient-to-br ${stat.color} p-3 flex flex-col gap-1`}>
              <div className="text-white/80">{stat.icon}</div>
              <div className="text-white text-xl font-bold">{stat.value}</div>
              <div className="text-white/80 text-[10px] leading-tight">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active lesson banner */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-4 shadow-xl shadow-purple-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/90 text-sm font-medium">Зараз активне заняття</span>
          <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">🟢 Активно</span>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <img
            src={STUDENTS[2].avatar}
            alt={STUDENTS[2].name}
            className="w-10 h-10 rounded-2xl object-cover border-2 border-white/30"
          />
          <div>
            <div className="text-white font-semibold">{STUDENTS[2].name}</div>
            <div className="text-white/70 text-xs">13:30 – 15:00</div>
          </div>
        </div>
        <button
          onClick={() => { setActiveSlot(SCHEDULE[4]); setScreen("lesson"); setLessonState("started"); }}
          className="mt-3 w-full bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-2xl py-2.5 text-sm font-medium transition-all active:scale-95"
        >
          Відкрити заняття →
        </button>
      </div>

      {/* Daily timeline */}
      <div className="bg-white rounded-3xl p-4 shadow-sm shadow-gray-100 border border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800">Розклад на сьогодні</h2>
          <span className="text-purple-600 text-xs font-medium">Чт, 7 Травня</span>
        </div>

        <div className="flex flex-col gap-2">
          {schedule.map((slot) => {
            const student = getStudent(slot.studentId);
            return (
              <motion.div
                key={slot.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (slot.status !== "free" && slot.status !== "blocked") {
                    setActiveSlot(slot);
                    setScreen("lesson");
                    setLessonState(slot.status === "active" ? "started" : slot.status === "completed" ? "finished" : "ready");
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  slot.status === "free" ? "bg-gray-50" :
                  slot.status === "blocked" ? "bg-red-50" :
                  slot.status === "active" ? "bg-purple-50 ring-1 ring-purple-200" :
                  "bg-white border border-gray-100"
                } ${slot.status !== "free" && slot.status !== "blocked" ? "cursor-pointer hover:shadow-sm" : ""}`}
              >
                {/* Time */}
                <div className="w-14 flex-shrink-0 text-center">
                  <div className="text-gray-800 text-xs font-semibold">{slot.time}</div>
                  <div className="text-gray-400 text-[10px]">{slot.end}</div>
                </div>

                {/* Divider line */}
                <div className={`w-0.5 h-8 rounded-full flex-shrink-0 ${
                  slot.status === "completed" ? "bg-green-400" :
                  slot.status === "active" ? "bg-purple-500" :
                  slot.status === "upcoming" ? "bg-blue-400" :
                  slot.status === "blocked" ? "bg-red-400" :
                  "bg-gray-200"
                }`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {student ? (
                    <div className="flex items-center gap-2">
                      <img src={student.avatar} alt={student.name} className="w-7 h-7 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-gray-800 text-xs font-medium truncate">{student.name}</div>
                        <div className="text-gray-400 text-[10px] truncate">{student.phone}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs">
                      {slot.status === "blocked" ? slot.blockReason : "Вільний слот"}
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusColor(slot.status)}`}>
                  {statusLabel(slot.status)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  // ─── LESSON SCREEN ────────────────────────────────────
  const LessonScreen = () => {
    const student = activeSlot ? getStudent(activeSlot.studentId) : null;
    if (!student || !activeSlot) return null;

    return (
      <motion.div
        key="lesson"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col gap-4 px-4 pt-2 pb-28"
      >
        {/* Student card */}
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-5 shadow-xl shadow-purple-200">
          <div className="flex items-center gap-4">
            <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30" />
            <div className="flex-1">
              <div className="text-white font-semibold text-lg">{student.name}</div>
              <div className="flex items-center gap-1 text-white/70 text-sm mt-0.5">
                <Phone size={12} />
                <span>{student.phone}</span>
              </div>
              <div className="mt-2 bg-white/15 rounded-full px-2.5 py-0.5 inline-block">
                <span className="text-white/90 text-xs">{student.level}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-white/10 rounded-2xl p-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Clock size={14} />
              <span>{activeSlot.time} – {activeSlot.end}</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <TrendingUp size={14} />
              <span>{student.hours}/{student.totalHours} год</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Прогрес навчання</span>
            <span className="text-purple-600 text-sm font-medium">{student.hours}/{student.totalHours} год</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(student.hours / student.totalHours) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
            />
          </div>
          <div className="mt-3 text-gray-500 text-xs">
            <span className="font-medium text-gray-700">Останнє заняття: </span>
            {student.lastLesson}
          </div>
        </div>

        {/* Action buttons */}
        {lessonState === "ready" && (
          <div className="flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setLessonState("started")}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-purple-200 active:scale-95 transition-transform"
            >
              <Play size={18} fill="white" />
              <span>Розпочати заняття</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNoShow}
              className="w-full bg-red-50 text-red-500 rounded-2xl py-3.5 flex items-center justify-center gap-2 border border-red-100 active:scale-95 transition-transform"
            >
              <XCircle size={18} />
              <span>Не з'явився</span>
            </motion.button>
          </div>
        )}

        {lessonState === "started" && (
          <div className="flex flex-col gap-3">
            <div className="bg-purple-50 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-purple-700 text-sm font-medium">Заняття в процесі…</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setLessonState("finished")}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-green-100"
            >
              <CheckCircle size={18} />
              <span>Завершити заняття</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNoShow}
              className="w-full bg-red-50 text-red-500 rounded-2xl py-3.5 flex items-center justify-center gap-2 border border-red-100"
            >
              <XCircle size={18} />
              <span>Не з'явився</span>
            </motion.button>
          </div>
        )}

        {lessonState === "finished" && (
          <div className="flex flex-col gap-3">
            <div className="bg-green-50 rounded-2xl p-3.5 flex items-center gap-3">
              <CheckCircle size={18} className="text-green-600" />
              <span className="text-green-700 text-sm font-medium">Заняття завершено!</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setScreen("note")}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
            >
              <Edit3 size={18} />
              <span>Написати нотатку</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={goHome}
              className="w-full bg-gray-100 text-gray-600 rounded-2xl py-3.5 flex items-center justify-center gap-2"
            >
              <span>Пропустити</span>
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  };

  // ─── NOTE SCREEN ──────────────────────────────────────
  const NoteScreen = () => {
    const student = activeSlot ? getStudent(activeSlot.studentId) : null;
    if (!student) return null;
    return (
      <motion.div
        key="note"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col gap-4 px-4 pt-2 pb-28"
      >
        <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-50">
          <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <div className="text-gray-800 font-medium text-sm">{student.name}</div>
            <div className="text-gray-400 text-xs">{activeSlot?.time} – {activeSlot?.end}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
          <h2 className="text-gray-800 mb-1">Нотатка по заняттю</h2>
          <p className="text-gray-400 text-xs mb-3">Опишіть, що відпрацьовували сьогодні</p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Наприклад: відпрацювали паркування задом, рух у щільному трафіку, повороти на перехрестях. Студент добре справляється з перемиканням передач…"
            className="w-full h-36 bg-gray-50 rounded-2xl p-3.5 text-sm text-gray-700 placeholder-gray-300 resize-none outline-none focus:ring-2 focus:ring-purple-200 transition-all border border-gray-100"
          />
        </div>

        {/* Quick tags */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
          <p className="text-gray-500 text-xs mb-2.5">Швидкі теми</p>
          <div className="flex flex-wrap gap-2">
            {["Паркування", "Місто", "Магістраль", "Знаки", "Маневри", "Гальмування", "Розворот", "Парковка"].map((tag) => (
              <button
                key={tag}
                onClick={() => setNoteText((n) => n ? `${n}, ${tag.toLowerCase()}` : tag)}
                className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs rounded-full border border-purple-100 hover:bg-purple-100 transition-colors active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSaveNote}
          className={`w-full rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg transition-all ${
            noteSaved
              ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-green-100"
              : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-purple-200"
          } text-white`}
        >
          {noteSaved ? (
            <><Check size={18} /><span>Збережено!</span></>
          ) : (
            <><Save size={18} /><span>Зберегти нотатку</span></>
          )}
        </motion.button>
      </motion.div>
    );
  };

  // ─── CALENDAR SCREEN ──────────────────────────────────
  const CalendarScreen = () => {
    const [blockedDays, setBlockedDays] = useState<number[]>([12, 19]);
    const toggleBlock = (day: number) => {
      setBlockedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
    };
    return (
      <motion.div
        key="calendar"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col gap-4 px-4 pt-2 pb-28"
      >
        {/* Month nav */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <button className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronLeft size={16} className="text-gray-500" />
            </button>
            <h2 className="text-gray-800">Травень 2026</h2>
            <button className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="text-center text-gray-400 text-xs py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {[...Array(3)].map((_, i) => <div key={`empty-${i}`} />)}
            {CALENDAR_DAYS.map((day) => {
              const isToday = day === 7;
              const isSelected = day === selectedDay;
              const isBlocked = blockedDays.includes(day);
              const hasLesson = [7, 8, 9, 12, 14, 15, 21].includes(day);
              return (
                <button
                  key={day}
                  onClick={() => { setSelectedDay(day); toggleBlock(day); }}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all active:scale-90 relative ${
                    isToday && !isSelected ? "bg-purple-50 text-purple-600 font-semibold" :
                    isSelected ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-md shadow-purple-200" :
                    isBlocked ? "bg-red-50 text-red-400" :
                    "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {day}
                  {hasLesson && !isSelected && (
                    <div className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isBlocked ? "bg-red-300" : "bg-purple-400"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3">
          {[
            { color: "bg-purple-500", label: "Заняття" },
            { color: "bg-red-400", label: "Заблоковано" },
            { color: "bg-gray-200", label: "Вільно" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              <span className="text-gray-500 text-xs">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Block hint */}
        <div className="bg-amber-50 rounded-2xl p-3.5 flex items-start gap-2.5 border border-amber-100">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-xs leading-relaxed">
            Натисніть на день, щоб заблокувати або розблокувати. Заблоковані дні не з'являться у студентів.
          </p>
        </div>

        {/* Day schedule */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-800 text-sm">Слоти на {selectedDay} травня</h2>
            <button className="flex items-center gap-1 text-purple-600 text-xs font-medium">
              <Plus size={14} />
              Додати слот
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {schedule.filter(s => s.date === selectedDay).length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-4">Немає слотів на цей день</div>
            ) : (
              schedule.filter(s => s.date === selectedDay).map((slot) => {
                const isBooked = slot.status !== 'free' && slot.status !== 'cancelled';
                const student = isBooked ? getStudent(slot.studentId) : null;
                const displayStudentName = student?.name || slot.studentName;
                const displayStudentAvatar = student?.avatar || "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHNtaWxpbmd8ZW58MXx8fHwxNzc3OTI5MTY3fDA&ixlib=rb-4.1.0&q=80&w=200";
                
                return (
                  <div key={slot.id} className={`flex items-center justify-between p-3 rounded-2xl ${isBooked ? "bg-purple-50 border border-purple-100" : "bg-gray-50"}`}>
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm ${isBooked ? "text-purple-700 font-semibold" : "text-gray-600"}`}>
                        {slot.time} – {slot.end}
                      </span>
                      {displayStudentName && isBooked && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <img src={displayStudentAvatar} alt={displayStudentName} className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-xs font-medium text-purple-600">{displayStudentName}</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${isBooked ? "bg-purple-100 text-purple-600" : "bg-white text-gray-400 border border-gray-100"}`}>
                      {isBooked ? statusLabel(slot.status) : "Вільно"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // ─── STUDENTS SCREEN ──────────────────────────────────
  const StudentsScreen = () => (
    <motion.div
      key="students"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.28 }}
      className="flex flex-col gap-4 px-4 pt-2 pb-28"
    >
      {/* Summary */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl p-4 shadow-xl shadow-purple-200">
        <div className="text-white/80 text-sm mb-1">Всього учнів</div>
        <div className="text-white text-3xl font-bold mb-3">{STUDENTS.length}</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Активні", value: "3", color: "bg-white/15" },
            { label: "Годин сьогодні", value: "6", color: "bg-white/15" },
            { label: "Сер. прогрес", value: "56%", color: "bg-white/15" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-2.5 text-center`}>
              <div className="text-white font-semibold">{s.value}</div>
              <div className="text-white/60 text-[10px] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Student list */}
      {STUDENTS.map((student) => (
        <motion.div
          key={student.id}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setSelectedStudent(student); setScreen("student-detail"); }}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <img src={student.avatar} alt={student.name} className="w-14 h-14 rounded-2xl object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">{student.name}</span>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                <Phone size={11} />
                <span>{student.phone}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-[10px]">Прогрес: {student.hours}/{student.totalHours} год</span>
                  <span className="text-purple-600 text-[10px] font-medium">{Math.round((student.hours / student.totalHours) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all"
                    style={{ width: `${(student.hours / student.totalHours) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-2.5 py-1.5">
              <BookOpen size={12} className="text-gray-400" />
              <span className="text-gray-500 text-xs truncate max-w-[160px]">{student.lastLesson}</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              student.level === "Новачок" ? "bg-blue-50 text-blue-500" :
              student.level === "Початківець" ? "bg-amber-50 text-amber-500" :
              "bg-green-50 text-green-600"
            }`}>
              {student.level}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  // ─── STUDENT DETAIL ───────────────────────────────────
  const StudentDetailScreen = () => {
    if (!selectedStudent) return null;
    return (
      <motion.div
        key="student-detail"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col gap-4 px-4 pt-2 pb-28"
      >
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-5 shadow-xl shadow-purple-200">
          <div className="flex items-center gap-4">
            <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-20 h-20 rounded-3xl object-cover border-2 border-white/30" />
            <div>
              <div className="text-white text-xl font-semibold">{selectedStudent.name}</div>
              <div className="text-white/70 text-sm mt-0.5">{selectedStudent.level}</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={12} className={s <= 3 ? "text-yellow-300 fill-yellow-300" : "text-white/30"} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
          <h2 className="text-gray-800 text-sm mb-3">Контакти</h2>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-600 rounded-2xl py-3 border border-purple-100 text-sm hover:bg-purple-100 transition-colors active:scale-95">
              <Phone size={16} />
              Зателефонувати
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 rounded-2xl py-3 border border-blue-100 text-sm hover:bg-blue-100 transition-colors active:scale-95">
              <MessageCircle size={16} />
              Написати
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
          <h2 className="text-gray-800 text-sm mb-3">Прогрес навчання</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-xs">Відпрацьовано годин</span>
            <span className="text-purple-600 font-semibold text-sm">{selectedStudent.hours} / {selectedStudent.totalHours}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(selectedStudent.hours / selectedStudent.totalHours) * 100}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: "Занять", value: Math.ceil(selectedStudent.hours / 1.5) },
              { label: "Залишилось год", value: selectedStudent.totalHours - selectedStudent.hours },
              { label: "Пропусків", value: "0" },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-2xl p-3 text-center">
                <div className="text-gray-800 font-semibold">{stat.value}</div>
                <div className="text-gray-400 text-[10px] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Last lesson */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
          <h2 className="text-gray-800 text-sm mb-2">Остання нотатка</h2>
          <div className="bg-purple-50 rounded-2xl p-3 text-purple-700 text-sm leading-relaxed">
            {selectedStudent.lastLesson}
          </div>
        </div>
      </motion.div>
    );
  };

  // ─── PROFILE SCREEN ───────────────────────────────────
  const ProfileScreen = () => (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.28 }}
      className="flex flex-col gap-4 px-4 pt-2 pb-28"
    >
      <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-5 shadow-xl shadow-purple-200 flex items-center gap-4">
        <img src={INSTRUCTOR_AVATAR} alt="Олексій Петренко" className="w-20 h-20 rounded-3xl object-cover border-2 border-white/30" />
        <div>
          <div className="text-white/70 text-sm">Інструктор</div>
          <div className="text-white text-xl font-semibold">Олексій Петренко</div>
          <div className="flex items-center gap-1 mt-1.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={13} className="text-yellow-300 fill-yellow-300" />
            ))}
            <span className="text-white/70 text-xs ml-1">4.9</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Учнів всього", value: "47", icon: <Users size={18} className="text-purple-500" /> },
          { label: "Років досвіду", value: "8", icon: <Car size={18} className="text-blue-500" /> },
          { label: "Годин проведено", value: "1240", icon: <Clock size={18} className="text-emerald-500" /> },
          { label: "Рейтинг", value: "4.9 ★", icon: <Star size={18} className="text-amber-400" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className="mb-2">{stat.icon}</div>
            <div className="text-gray-800 font-semibold">{stat.value}</div>
            <div className="text-gray-400 text-xs mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
        <h2 className="text-gray-800 text-sm mb-3">Налаштування</h2>
        {[
          { label: "Мій автомобіль", desc: "Toyota Corolla 2021", icon: <Car size={16} className="text-gray-400" /> },
          { label: "Локація", desc: "Київ, Дарницький р-н", icon: <MapPin size={16} className="text-gray-400" /> },
          { label: "Telegram бот", desc: "@godrive_bot", icon: <MessageCircle size={16} className="text-gray-400" /> },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center">{item.icon}</div>
              <div>
                <div className="text-gray-700 text-sm">{item.label}</div>
                <div className="text-gray-400 text-xs">{item.desc}</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
        ))}
      </div>
    </motion.div>
  );

  const isSubScreen = screen === "lesson" || screen === "note" || screen === "student-detail";

  const screenTitles: Record<Screen, string> = {
    home: "Головна",
    lesson: "Заняття",
    note: "Нотатка",
    calendar: "Розклад",
    students: "Учні",
    "student-detail": selectedStudent?.name || "Учень",
    profile: "Профіль",
  };

  return (
    <div className="min-h-screen bg-[#f5f4fa] flex items-center justify-center p-4">
      <div
        className="relative bg-[#f5f4fa] overflow-hidden flex flex-col"
        style={{ width: 390, minHeight: 780, maxHeight: 900, borderRadius: 40, boxShadow: "0 32px 80px rgba(109,40,217,0.18), 0 8px 32px rgba(0,0,0,0.10)" }}
      >
        {/* Status bar */}
        <div className="flex-shrink-0 bg-white px-6 pt-3 pb-1 flex items-center justify-between">
          <span className="text-gray-800 text-xs font-medium">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end">
              {[3,5,7,9].map((h) => <div key={h} style={{height:h}} className="w-0.5 bg-gray-800 rounded-full" />)}
            </div>
            <svg width="15" height="11" viewBox="0 0 15 11" className="text-gray-800"><path fill="currentColor" d="M7.5 2.5C9.9 2.5 12 3.4 13.5 5L15 3.4C13.1 1.3 10.4 0 7.5 0S1.9 1.3 0 3.4L1.5 5C3 3.4 5.1 2.5 7.5 2.5zm0 3.5c-1.4 0-2.7.6-3.6 1.5L5.4 9C6 8.4 6.7 8 7.5 8s1.5.4 2.1 1L11.1 7.5C10.2 6.6 8.9 6 7.5 6zm0 3.5C7 9.5 6.6 9.7 6.3 10l1.2 1.5 1.2-1.5C8.4 9.7 8 9.5 7.5 9.5z"/></svg>
            <div className="w-6 h-3 bg-gray-800 rounded-sm relative">
              <div className="absolute inset-0.5 bg-white rounded-sm" style={{right:4}}>
                <div className="h-full bg-gray-800 rounded-sm" style={{width:'70%'}} />
              </div>
              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-gray-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex-shrink-0 bg-white px-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSubScreen && (
              <button
                onClick={() => {
                  if (screen === "note") setScreen("lesson");
                  else if (screen === "student-detail") { setScreen("students"); setActiveTab("students"); }
                  else { goHome(); }
                }}
                className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={16} className="text-gray-600" />
              </button>
            )}
            <div>
              {!isSubScreen && (
                <div className="text-gray-400 text-xs">Вітаємо, Олексію 👋</div>
              )}
              <div className="text-gray-900" style={{ fontSize: isSubScreen ? 17 : 22, fontWeight: 700, lineHeight: 1.2 }}>
                {isSubScreen ? screenTitles[screen] : "GoDrive"}
              </div>
            </div>
          </div>
          <img
            src={INSTRUCTOR_AVATAR}
            alt="Avatar"
            className="w-10 h-10 rounded-2xl object-cover border-2 border-purple-100 cursor-pointer hover:border-purple-300 transition-colors"
            onClick={() => { setScreen("profile"); setActiveTab("profile"); }}
          />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <AnimatePresence mode="wait">
            {screen === "home" && <HomeScreen key="home" />}
            {screen === "lesson" && <LessonScreen key="lesson" />}
            {screen === "note" && <NoteScreen key="note" />}
            {screen === "calendar" && <CalendarScreen key="calendar" />}
            {screen === "students" && <StudentsScreen key="students" />}
            {screen === "student-detail" && <StudentDetailScreen key="student-detail" />}
            {screen === "profile" && <ProfileScreen key="profile" />}
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        <div
          className="flex-shrink-0 bg-white border-t border-gray-100 px-2 pb-4 pt-2 flex items-center justify-around"
          style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: "0 -8px 24px rgba(0,0,0,0.04)" }}
        >
          {[
            { tab: "home" as const, icon: Home, label: "Головна", sc: "home" as Screen },
            { tab: "calendar" as const, icon: Calendar, label: "Розклад", sc: "calendar" as Screen },
            { tab: "students" as const, icon: Users, label: "Учні", sc: "students" as Screen },
            { tab: "profile" as const, icon: User, label: "Профіль", sc: "profile" as Screen },
          ].map(({ tab, icon: Icon, label, sc }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setScreen(sc); }}
                className="flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all active:scale-95"
              >
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${isActive ? "bg-gradient-to-br from-violet-600 to-purple-600 shadow-md shadow-purple-200" : ""}`}>
                  <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-purple-600" : "text-gray-400"}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
