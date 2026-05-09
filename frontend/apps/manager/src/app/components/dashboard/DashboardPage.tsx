import { useState } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ChevronRight,
  Zap,
  Car,
  UserCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const kpiCards = [
  {
    label: "Активних студентів",
    value: "47",
    delta: "+3 цього тижня",
    icon: Users,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
    shadowColor: "rgba(124,58,237,0.28)",
    textColor: "#fff",
  },
  {
    label: "Занять цього тижня",
    value: "138",
    delta: "+12% vs мин.",
    icon: BookOpen,
    gradient: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    shadowColor: "rgba(16,185,129,0.25)",
    textColor: "#fff",
  },
  {
    label: "Відсоток скасувань",
    value: "4.2%",
    delta: "−1.1% vs мин.",
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
    shadowColor: "rgba(245,158,11,0.25)",
    textColor: "#fff",
  },
  {
    label: "Загодин відпрацьовано",
    value: "412",
    delta: "+28 за тиждень",
    icon: Clock,
    gradient: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
    shadowColor: "rgba(59,130,246,0.25)",
    textColor: "#fff",
  },
];

const activityFeed = [
  {
    id: 1,
    type: "waitlist",
    icon: Zap,
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
    text: 'Слот 14:00 заповнено через вейтліст',
    student: "Максим Бондар",
    time: "5 хв тому",
  },
  {
    id: 2,
    type: "cancel",
    icon: XCircle,
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
    text: "Скасування < 24год",
    student: "Дмитро Савченко",
    time: "32 хв тому",
  },
  {
    id: 3,
    type: "complete",
    icon: CheckCircle2,
    iconBg: "#D1FAE5",
    iconColor: "#10B981",
    text: "Заняття завершено",
    student: "Олена Коваль → Олексій Петренко",
    time: "1 год тому",
  },
  {
    id: 4,
    type: "assign",
    icon: UserCheck,
    iconBg: "#DBEAFE",
    iconColor: "#3B82F6",
    text: "Студента призначено до інструктора",
    student: "Ірина Пономаренко → Аліна Мельник",
    time: "2 год тому",
  },
  {
    id: 5,
    type: "alert",
    icon: AlertCircle,
    iconBg: "#FEF3C7",
    iconColor: "#F59E0B",
    text: "Вейтліст: 3 студентів очікують",
    student: "Інструктор Ткаченко В.",
    time: "3 год тому",
  },
];

const chartData = [
  { day: "Пн", lessons: 22, cancelled: 1 },
  { day: "Вт", lessons: 28, cancelled: 2 },
  { day: "Ср", lessons: 25, cancelled: 0 },
  { day: "Чт", lessons: 31, cancelled: 3 },
  { day: "Пт", lessons: 20, cancelled: 1 },
  { day: "Сб", lessons: 12, cancelled: 0 },
  { day: "Нд", lessons: 0, cancelled: 0 },
];

const upcomingLessons = [
  { time: "10:00", student: "Максим Бондар", instructor: "Олексій Петренко", status: "Незабаром", statusColor: "#F59E0B", statusBg: "#FEF3C7" },
  { time: "10:00", student: "Ірина Новак", instructor: "Аліна Мельник", status: "Незабаром", statusColor: "#F59E0B", statusBg: "#FEF3C7" },
  { time: "11:30", student: "Олена Коваль", instructor: "Василь Ткаченко", status: "Вільно", statusColor: "#9CA3AF", statusBg: "#F3F4F6" },
  { time: "13:00", student: "Андрій Лисенко", instructor: "Олексій Петренко", status: "Заброньовано", statusColor: "#7C3AED", statusBg: "#EDE9FE" },
  { time: "14:30", student: "Катерина Мороз", instructor: "Аліна Мельник", status: "Заброньовано", statusColor: "#7C3AED", statusBg: "#EDE9FE" },
];

const instructors = [
  { name: "Олексій Петренко", students: 12, todayLessons: 5, utilization: 83 },
  { name: "Аліна Мельник", students: 9, todayLessons: 4, utilization: 67 },
  { name: "Василь Ткаченко", students: 14, todayLessons: 6, utilization: 91 },
  { name: "Марина Захаренко", students: 8, todayLessons: 3, utilization: 50 },
];

export function DashboardPage() {
  const [_activeTab, setActiveTab] = useState("today");

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: "#1E1B4B", fontSize: 24, fontWeight: 700 }}>Дашборд</h1>
          <p style={{ color: "#A78BFA", fontSize: 13, marginTop: 2 }}>
            Чт, 7 Травня 2026 · Огляд роботи школи
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl cursor-pointer"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
        >
          <Car size={15} color="#fff" />
          <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>+ Нове заняття</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-3xl p-5 flex flex-col gap-3 relative overflow-hidden"
              style={{ background: card.gradient, boxShadow: `0 8px 24px ${card.shadowColor}` }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="rounded-2xl flex items-center justify-center"
                  style={{ width: 38, height: 38, background: "rgba(255,255,255,0.2)" }}
                >
                  <Icon size={18} color="#fff" />
                </div>
                <ArrowUpRight size={16} color="rgba(255,255,255,0.6)" />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                  {card.label}
                </div>
              </div>
              <div
                className="rounded-xl px-2.5 py-1 self-start"
                style={{ background: "rgba(255,255,255,0.2)", fontSize: 11, color: "#fff", fontWeight: 500 }}
              >
                {card.delta}
              </div>
              {/* Decorative circle */}
              <div
                className="absolute -right-4 -bottom-4 rounded-full"
                style={{ width: 80, height: 80, background: "rgba(255,255,255,0.08)" }}
              />
            </div>
          );
        })}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div
          className="lg:col-span-2 rounded-3xl p-6"
          style={{ background: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.07)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 style={{ color: "#1E1B4B", fontWeight: 700, fontSize: 16 }}>Заняття за тиждень</h3>
              <p style={{ color: "#A78BFA", fontSize: 12, marginTop: 1 }}>Пн — Нд, поточний тиждень</p>
            </div>
            <div className="flex gap-3">
              {["today", "week", "month"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className="px-3 py-1.5 rounded-xl transition-all"
                  style={{
                    background: _activeTab === t ? "#EDE9FE" : "transparent",
                    color: _activeTab === t ? "#7C3AED" : "#9CA3AF",
                    fontSize: 12,
                    fontWeight: _activeTab === t ? 600 : 400,
                  }}
                >
                  {t === "today" ? "Тиждень" : t === "week" ? "Місяць" : "Рік"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="dashLessonsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashCancelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis key="xaxis" dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
              <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip
                key="tooltip"
                contentStyle={{
                  borderRadius: 16,
                  border: "none",
                  boxShadow: "0 8px 24px rgba(124,58,237,0.15)",
                  fontSize: 12,
                }}
              />
              <Area key="area-lessons" type="monotone" dataKey="lessons" name="Занять" stroke="#7C3AED" strokeWidth={2.5} fill="url(#dashLessonsGrad)" dot={false} />
              <Area key="area-cancelled" type="monotone" dataKey="cancelled" name="Скасовано" stroke="#EF4444" strokeWidth={2} fill="url(#dashCancelGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div
          className="rounded-3xl p-5 flex flex-col gap-4"
          style={{ background: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.07)" }}
        >
          <div className="flex items-center justify-between">
            <h3 style={{ color: "#1E1B4B", fontWeight: 700, fontSize: 16 }}>Активність</h3>
            <button style={{ fontSize: 12, color: "#7C3AED", fontWeight: 600 }}>Всі →</button>
          </div>
          <div className="flex flex-col gap-3 overflow-auto" style={{ maxHeight: 220 }}>
            {activityFeed.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className="rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ width: 32, height: 32, background: item.iconBg }}
                  >
                    <Icon size={15} style={{ color: item.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1E1B4B" }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: "#A78BFA", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.student}
                    </div>
                    <div style={{ fontSize: 10, color: "#D1D5DB", marginTop: 1 }}>{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row: Upcoming lessons + Instructors load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upcoming */}
        <div
          className="rounded-3xl p-5"
          style={{ background: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.07)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#1E1B4B", fontWeight: 700, fontSize: 16 }}>Заняття сьогодні</h3>
            <button
              className="flex items-center gap-1"
              style={{ fontSize: 12, color: "#7C3AED", fontWeight: 600 }}
            >
              Розклад <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {upcomingLessons.map((lesson, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: "#F9F7FF" }}
              >
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 42, height: 42, background: "#EDE9FE" }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>{lesson.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1B4B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {lesson.student}
                  </div>
                  <div style={{ fontSize: 11, color: "#A78BFA" }}>{lesson.instructor}</div>
                </div>
                <span
                  className="px-2.5 py-1 rounded-xl flex-shrink-0"
                  style={{ fontSize: 11, fontWeight: 600, color: lesson.statusColor, background: lesson.statusBg }}
                >
                  {lesson.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructors load */}
        <div
          className="rounded-3xl p-5"
          style={{ background: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.07)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: "#1E1B4B", fontWeight: 700, fontSize: 16 }}>Завантаження інструкторів</h3>
          </div>
          <div className="flex flex-col gap-4">
            {instructors.map((inst, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 32,
                        height: 32,
                        background: `linear-gradient(135deg, ${["#7C3AED","#10B981","#3B82F6","#F59E0B"][i % 4]}, ${["#A855F7","#34D399","#60A5FA","#FBBF24"][i % 4]})`,
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {inst.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1B4B" }}>{inst.name}</div>
                      <div style={{ fontSize: 11, color: "#A78BFA" }}>
                        {inst.students} студ · {inst.todayLessons} занять сьогодні
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: inst.utilization >= 80 ? "#EF4444" : inst.utilization >= 60 ? "#F59E0B" : "#10B981",
                    }}
                  >
                    {inst.utilization}%
                  </span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#F3F4F6" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${inst.utilization}%`,
                      background: inst.utilization >= 80
                        ? "linear-gradient(90deg,#EF4444,#F87171)"
                        : inst.utilization >= 60
                        ? "linear-gradient(90deg,#F59E0B,#FBBF24)"
                        : "linear-gradient(90deg,#10B981,#34D399)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}