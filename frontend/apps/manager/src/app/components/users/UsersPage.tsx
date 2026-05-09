import { useState } from "react";
import {
  Search,
  MoreVertical,
  Plus,
  X,
  User,
  Phone,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Clock,
  UserCheck,
  Car,
} from "lucide-react";

type Level = "Новачок" | "Початківець" | "Середній" | "Впевнений";

const levelConfig: Record<Level, { color: string; bg: string }> = {
  "Новачок": { color: "#9CA3AF", bg: "#F3F4F6" },
  "Початківець": { color: "#F59E0B", bg: "#FEF3C7" },
  "Середній": { color: "#10B981", bg: "#D1FAE5" },
  "Впевнений": { color: "#3B82F6", bg: "#DBEAFE" },
};

type Status = "Активний" | "Очікує" | "Завершив";

const statusConfig: Record<Status, { color: string; bg: string }> = {
  "Активний": { color: "#10B981", bg: "#D1FAE5" },
  "Очікує": { color: "#F59E0B", bg: "#FEF3C7" },
  "Завершив": { color: "#9CA3AF", bg: "#F3F4F6" },
};

type Student = {
  id: number;
  name: string;
  phone: string;
  instructor: string;
  hoursTotal: number;
  hoursMax: number;
  status: Status;
  level: Level;
  lastLesson: string;
  topic: string;
  avatar: string;
};

const students: Student[] = [
  { id: 1, name: "Олена Коваль", phone: "+380 67 123 45 67", instructor: "Олексій Петренко", hoursTotal: 12, hoursMax: 40, status: "Активний", level: "Початківець", lastLesson: "Сьогодні", topic: "Паркування, місто", avatar: "ОК" },
  { id: 2, name: "Максим Бондар", phone: "+380 50 987 65 43", instructor: "Олексій Петренко", hoursTotal: 28, hoursMax: 40, status: "Активний", level: "Середній", lastLesson: "Вчора", topic: "Автомагістраль, обгін", avatar: "МБ" },
  { id: 3, name: "Аліна Петрова", phone: "+380 93 555 11 22", instructor: "Аліна Мельник", hoursTotal: 5, hoursMax: 40, status: "Активний", level: "Новачок", lastLesson: "Сьогодні", topic: "Рушання з місця", avatar: "АП" },
  { id: 4, name: "Ірина Новак", phone: "+380 67 234 56 78", instructor: "Аліна Мельник", hoursTotal: 35, hoursMax: 40, status: "Активний", level: "Впевнений", lastLesson: "2 дні тому", topic: "Складний маршрут", avatar: "ІН" },
  { id: 5, name: "Дмитро Лисенко", phone: "+380 95 321 00 11", instructor: "Василь Ткаченко", hoursTotal: 0, hoursMax: 40, status: "Очікує", level: "Новачок", lastLesson: "—", topic: "Не розпочав", avatar: "ДЛ" },
  { id: 6, name: "Катерина Мороз", phone: "+380 66 456 78 90", instructor: "Василь Ткаченко", hoursTotal: 18, hoursMax: 40, status: "Активний", level: "Початківець", lastLesson: "Сьогодні", topic: "Міський трафік", avatar: "КМ" },
  { id: 7, name: "Богдан Шевченко", phone: "+380 98 765 43 21", instructor: "Марина Захаренко", hoursTotal: 40, hoursMax: 40, status: "Завершив", level: "Впевнений", lastLesson: "2 тижні тому", topic: "Іспит складено", avatar: "БШ" },
  { id: 8, name: "Наталія Руденко", phone: "+380 73 111 22 33", instructor: "Марина Захаренко", hoursTotal: 22, hoursMax: 40, status: "Активний", level: "Середній", lastLesson: "Вчора", topic: "Нічне водіння", avatar: "НР" },
];

const instructors = ["Олексій Петренко", "Аліна Мельник", "Василь Ткаченко", "Марина Захаренко"];
const avatarColors = ["#7C3AED","#10B981","#3B82F6","#F59E0B","#EF4444","#A855F7","#06B6D4","#F97316"];

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"students" | "instructors">("students");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [assignModal, setAssignModal] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState("");

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.instructor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ color: "#1E1B4B", fontSize: 22, fontWeight: 700 }}>Користувачі</h1>
          <p style={{ color: "#A78BFA", fontSize: 13 }}>CRM · Студенти та інструктори</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}
        >
          <Plus size={15} />
          Новий студент
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["students", "instructors"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2.5 rounded-2xl transition-all"
            style={{
              background: tab === t ? "linear-gradient(135deg, #7C3AED, #A855F7)" : "#fff",
              color: tab === t ? "#fff" : "#6B7280",
              fontSize: 13,
              fontWeight: 600,
              border: tab === t ? "none" : "1.5px solid #EDE9FE",
              boxShadow: tab === t ? "0 4px 14px rgba(124,58,237,0.25)" : "none",
            }}
          >
            {t === "students" ? `Студенти (${students.length})` : `Інструктори (${instructors.length})`}
          </button>
        ))}
      </div>

      {tab === "students" && (
        <>
          {/* Search */}
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#C4B5FD" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук студентів..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl outline-none"
              style={{ background: "#fff", border: "1.5px solid #EDE9FE", fontSize: 13, color: "#1E1B4B" }}
            />
          </div>

          {/* Table */}
          <div className="rounded-3xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.07)" }}>
            {/* Table header */}
            <div
              className="grid px-5 py-3"
              style={{ gridTemplateColumns: "2fr 1.5fr 1fr 1.2fr 0.8fr 0.8fr 80px", fontSize: 11, fontWeight: 600, color: "#C4B5FD", letterSpacing: "0.05em", background: "#F9F7FF", borderBottom: "1px solid #EDE9FE" }}
            >
              <span>СТУДЕНТ</span>
              <span>ІНСТРУКТОР</span>
              <span>ПРОГРЕС</span>
              <span>ОСТАННЯ ТЕМА</span>
              <span>РІВЕНЬ</span>
              <span>СТАТУС</span>
              <span></span>
            </div>

            {/* Rows */}
            {filtered.map((student, i) => {
              const progress = Math.round((student.hoursTotal / student.hoursMax) * 100);
              return (
                <div
                  key={student.id}
                  className="grid px-5 py-4 items-center transition-all hover:bg-[#F9F7FF] cursor-pointer"
                  style={{
                    gridTemplateColumns: "2fr 1.5fr 1fr 1.2fr 0.8fr 0.8fr 80px",
                    borderBottom: i < filtered.length - 1 ? "1px solid #F3F4F6" : "none",
                  }}
                  onClick={() => setSelectedStudent(student)}
                >
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 36,
                        height: 36,
                        background: `${avatarColors[i % avatarColors.length]}20`,
                        color: avatarColors[i % avatarColors.length],
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {student.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1B4B" }}>{student.name}</div>
                      <div style={{ fontSize: 11, color: "#A78BFA" }}>{student.phone}</div>
                    </div>
                  </div>

                  {/* Instructor */}
                  <div style={{ fontSize: 12, color: "#4B5563", fontWeight: 500 }}>{student.instructor}</div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{student.hoursTotal}/{student.hoursMax} год</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>{progress}%</span>
                    </div>
                    <div className="rounded-full overflow-hidden" style={{ height: 5, background: "#F3F4F6" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7C3AED, #A855F7)" }}
                      />
                    </div>
                  </div>

                  {/* Topic */}
                  <div style={{ fontSize: 11, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {student.topic}
                  </div>

                  {/* Level */}
                  <span
                    className="inline-block px-2.5 py-1 rounded-xl"
                    style={{ fontSize: 11, fontWeight: 600, color: levelConfig[student.level].color, background: levelConfig[student.level].bg }}
                  >
                    {student.level}
                  </span>

                  {/* Status */}
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl"
                    style={{ fontSize: 11, fontWeight: 600, color: statusConfig[student.status].color, background: statusConfig[student.status].bg }}
                  >
                    <span className="inline-block rounded-full" style={{ width: 5, height: 5, background: statusConfig[student.status].color }} />
                    {student.status}
                  </span>

                  {/* Actions */}
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        className="p-2 rounded-xl transition-all hover:bg-[#EDE9FE]"
                        onClick={() => setOpenMenu(openMenu === student.id ? null : student.id)}
                      >
                        <MoreVertical size={15} style={{ color: "#A78BFA" }} />
                      </button>
                      {openMenu === student.id && (
                        <div
                          className="absolute right-0 top-8 z-20 rounded-2xl overflow-hidden py-1.5"
                          style={{ background: "#fff", boxShadow: "0 8px 24px rgba(124,58,237,0.15)", minWidth: 170, border: "1px solid #EDE9FE" }}
                        >
                          <button
                            className="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-[#F9F7FF] transition-all"
                            style={{ fontSize: 13, color: "#1E1B4B" }}
                            onClick={() => { setSelectedStudent(student); setOpenMenu(null); }}
                          >
                            <User size={13} style={{ color: "#7C3AED" }} /> Переглянути
                          </button>
                          <button
                            className="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-[#F9F7FF] transition-all"
                            style={{ fontSize: 13, color: "#1E1B4B" }}
                            onClick={() => { setAssignModal(student); setOpenMenu(null); }}
                          >
                            <UserCheck size={13} style={{ color: "#10B981" }} /> Призначити інструктора
                          </button>
                          <button
                            className="flex items-center gap-2.5 w-full px-4 py-2 hover:bg-[#FEE2E2] transition-all"
                            style={{ fontSize: 13, color: "#EF4444" }}
                          >
                            <X size={13} /> Видалити
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "instructors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {instructors.map((name, i) => {
            const instrStudents = students.filter((s) => s.instructor === name);
            const active = instrStudents.filter((s) => s.status === "Активний").length;
            const totalHours = instrStudents.reduce((acc, s) => acc + s.hoursTotal, 0);
            const avgProgress = instrStudents.length
              ? Math.round(instrStudents.reduce((a, s) => a + (s.hoursTotal / s.hoursMax) * 100, 0) / instrStudents.length)
              : 0;

            return (
              <div
                key={name}
                className="rounded-3xl p-5 flex flex-col gap-4"
                style={{ background: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.07)" }}
              >
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-2xl flex items-center justify-center"
                    style={{
                      width: 60,
                      height: 60,
                      background: `linear-gradient(135deg, ${avatarColors[i % avatarColors.length]}, ${avatarColors[(i + 1) % avatarColors.length]})`,
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 700,
                      boxShadow: `0 4px 16px ${avatarColors[i % avatarColors.length]}40`,
                    }}
                  >
                    {name.charAt(0)}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1E1B4B", textAlign: "center" }}>{name}</div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <StatMini label="Студ." value={instrStudents.length.toString()} />
                  <StatMini label="Активних" value={active.toString()} color="#10B981" />
                  <StatMini label="Годин" value={totalHours.toString()} color="#7C3AED" />
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>Сер. прогрес</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>{avgProgress}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 6, background: "#F3F4F6" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${avgProgress}%`, background: "linear-gradient(90deg, #7C3AED, #A855F7)" }}
                    />
                  </div>
                </div>

                <button
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl"
                  style={{ background: "#EDE9FE", color: "#7C3AED", fontSize: 12, fontWeight: 600 }}
                >
                  <Car size={13} />
                  Розклад
                  <ChevronRight size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Assign modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(124,58,237,0.12)", backdropFilter: "blur(4px)" }} onClick={() => setAssignModal(null)}>
          <div
            className="rounded-3xl p-7 w-full max-w-sm"
            style={{ background: "#fff", boxShadow: "0 20px 60px rgba(124,58,237,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1E1B4B" }}>Призначити інструктора</h3>
              <button onClick={() => setAssignModal(null)} className="p-2 rounded-xl" style={{ background: "#F5F3FF" }}>
                <X size={15} style={{ color: "#7C3AED" }} />
              </button>
            </div>

            <div className="rounded-2xl p-3 flex items-center gap-3 mb-5" style={{ background: "#F9F7FF" }}>
              <div className="rounded-xl flex items-center justify-center" style={{ width: 36, height: 36, background: "#EDE9FE", fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>
                {assignModal.avatar}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1B4B" }}>{assignModal.name}</div>
                <div style={{ fontSize: 11, color: "#A78BFA" }}>{assignModal.phone}</div>
              </div>
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: "#7C3AED", display: "block", marginBottom: 6 }}>
              Оберіть інструктора
            </label>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl outline-none mb-5"
              style={{ background: "#F9F7FF", border: "1.5px solid #EDE9FE", fontSize: 13, color: "#1E1B4B" }}
            >
              <option value="">— Оберіть —</option>
              {instructors.map((name) => {
                const load = students.filter((s) => s.instructor === name && s.status === "Активний").length;
                return (
                  <option key={name} value={name}>
                    {name} ({load} студ.)
                  </option>
                );
              })}
            </select>

            <button
              className="w-full py-3 rounded-2xl"
              style={{ background: selectedInstructor ? "linear-gradient(135deg, #7C3AED, #A855F7)" : "#E5E7EB", color: selectedInstructor ? "#fff" : "#9CA3AF", fontSize: 14, fontWeight: 600, boxShadow: selectedInstructor ? "0 4px 16px rgba(124,58,237,0.3)" : "none" }}
              onClick={() => setAssignModal(null)}
            >
              Призначити
            </button>
          </div>
        </div>
      )}

      {/* Student detail drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-end" onClick={() => setSelectedStudent(null)}>
          <div
            className="h-full flex flex-col overflow-auto"
            style={{ width: 380, background: "#fff", boxShadow: "-8px 0 40px rgba(124,58,237,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Purple header */}
            <div
              className="p-6 relative"
              style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
            >
              <button
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 p-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <X size={15} color="#fff" />
              </button>
              <div className="flex items-center gap-4 mt-4">
                <div
                  className="rounded-2xl flex items-center justify-center"
                  style={{ width: 56, height: 56, background: "rgba(255,255,255,0.25)", color: "#fff", fontSize: 16, fontWeight: 700 }}
                >
                  {selectedStudent.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{selectedStudent.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{selectedStudent.phone}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-xl" style={{ background: "rgba(255,255,255,0.2)", fontSize: 11, color: "#fff", fontWeight: 600 }}>
                      {selectedStudent.level}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-xl" style={{ background: "rgba(255,255,255,0.2)", fontSize: 11, color: "#fff", fontWeight: 600 }}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Progress card */}
              <div className="rounded-2xl p-4" style={{ background: "#F9F7FF" }}>
                <div className="flex justify-between mb-2">
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1E1B4B" }}>Прогрес навчання</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>
                    {Math.round((selectedStudent.hoursTotal / selectedStudent.hoursMax) * 100)}%
                  </span>
                </div>
                <div className="rounded-full overflow-hidden mb-2" style={{ height: 8, background: "#EDE9FE" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(selectedStudent.hoursTotal / selectedStudent.hoursMax) * 100}%`, background: "linear-gradient(90deg, #7C3AED, #A855F7)" }}
                  />
                </div>
                <div style={{ fontSize: 11, color: "#A78BFA" }}>{selectedStudent.hoursTotal} / {selectedStudent.hoursMax} годин відпрацьовано</div>
              </div>

              {/* Info rows */}
              <div className="flex flex-col gap-2.5">
                <InfoRow2 icon={UserCheck} label="Інструктор" value={selectedStudent.instructor} />
                <InfoRow2 icon={BookOpen} label="Поточна тема" value={selectedStudent.topic} />
                <InfoRow2 icon={Clock} label="Останнє заняття" value={selectedStudent.lastLesson} />
                <InfoRow2 icon={Phone} label="Телефон" value={selectedStudent.phone} />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  className="w-full py-3 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "#fff", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
                  onClick={() => { setAssignModal(selectedStudent); setSelectedStudent(null); }}
                >
                  Змінити інструктора
                </button>
                <button
                  className="w-full py-3 rounded-2xl"
                  style={{ background: "#D1FAE5", color: "#10B981", fontSize: 14, fontWeight: 600 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 size={15} />
                    Написати нотатку
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatMini({ label, value, color = "#1E1B4B" }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-xl p-2 text-center" style={{ background: "#F9F7FF" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: "#A78BFA" }}>{label}</div>
    </div>
  );
}

function InfoRow2({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#F9F7FF" }}>
      <div className="rounded-xl flex items-center justify-center" style={{ width: 32, height: 32, background: "#EDE9FE" }}>
        <Icon size={14} style={{ color: "#7C3AED" }} />
      </div>
      <div>
        <div style={{ fontSize: 10, color: "#A78BFA" }}>{label}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1E1B4B" }}>{value}</div>
      </div>
    </div>
  );
}
