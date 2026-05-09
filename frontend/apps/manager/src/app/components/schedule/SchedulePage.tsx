import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter, X, Clock, User, Phone, Car, CheckCircle2, XCircle, Circle } from "lucide-react";

const HOURS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const DAYS = ["Пн 5", "Вт 6", "Ср 7", "Чт 8", "Пт 9", "Сб 10", "Нд 11"];

const instructors = [
  { id: 1, name: "Олексій Петренко", color: "#7C3AED", bg: "#EDE9FE" },
  { id: 2, name: "Аліна Мельник", color: "#10B981", bg: "#D1FAE5" },
  { id: 3, name: "Василь Ткаченко", color: "#3B82F6", bg: "#DBEAFE" },
  { id: 4, name: "Марина Захаренко", color: "#F59E0B", bg: "#FEF3C7" },
];

type SlotStatus = "Завершено" | "Зараз" | "Незабаром" | "Заброньовано" | "Вільно" | "Заблоковано";

type Slot = {
  id: number;
  instructorId: number;
  day: number;
  startHour: number;
  duration: number;
  student?: string;
  phone?: string;
  status: SlotStatus;
};

const slots: Slot[] = [
  { id: 1, instructorId: 1, day: 0, startHour: 8, duration: 1.5, student: "Олена Коваль", phone: "+380 67 123 45 67", status: "Завершено" },
  { id: 2, instructorId: 1, day: 0, startHour: 10, duration: 1.5, student: "Максим Бондар", phone: "+380 50 987 65 43", status: "Незабаром" },
  { id: 3, instructorId: 1, day: 0, startHour: 13, duration: 1.5, student: "Аліна Мельник", phone: "+380 93 555 11 22", status: "Зараз" },
  { id: 4, instructorId: 2, day: 0, startHour: 9, duration: 1.5, student: "Ірина Новак", phone: "+380 67 234 56 78", status: "Завершено" },
  { id: 5, instructorId: 2, day: 0, startHour: 11, duration: 1.5, student: "Дмитро Лисенко", phone: "+380 95 321 00 11", status: "Заброньовано" },
  { id: 6, instructorId: 2, day: 0, startHour: 14, duration: 1.5, status: "Вільно" },
  { id: 7, instructorId: 3, day: 0, startHour: 8, duration: 1, status: "Заблоковано" },
  { id: 8, instructorId: 3, day: 0, startHour: 10, duration: 1.5, student: "Катерина Мороз", phone: "+380 66 456 78 90", status: "Зараз" },
  { id: 9, instructorId: 3, day: 0, startHour: 13, duration: 1.5, student: "Богдан Шевченко", phone: "+380 98 765 43 21", status: "Заброньовано" },
  { id: 10, instructorId: 4, day: 0, startHour: 9, duration: 1.5, student: "Наталія Руденко", phone: "+380 73 111 22 33", status: "Завершено" },
  { id: 11, instructorId: 4, day: 0, startHour: 11, duration: 1, status: "Вільно" },
  { id: 12, instructorId: 4, day: 0, startHour: 14, duration: 1.5, student: "Сергій Гнатенко", phone: "+380 67 999 00 55", status: "Заброньовано" },
  { id: 13, instructorId: 1, day: 1, startHour: 9, duration: 1.5, student: "Максим Бондар", phone: "+380 50 987 65 43", status: "Заброньовано" },
  { id: 14, instructorId: 2, day: 1, startHour: 10, duration: 1.5, student: "Ірина Новак", phone: "+380 67 234 56 78", status: "Заброньовано" },
  { id: 15, instructorId: 3, day: 1, startHour: 11, duration: 1.5, status: "Вільно" },
];

const statusConfig: Record<SlotStatus, { color: string; bg: string; label: string; icon: typeof CheckCircle2 }> = {
  "Завершено": { color: "#10B981", bg: "#D1FAE5", label: "Завершено", icon: CheckCircle2 },
  "Зараз": { color: "#7C3AED", bg: "#EDE9FE", label: "Зараз", icon: Circle },
  "Незабаром": { color: "#F59E0B", bg: "#FEF3C7", label: "Незабаром", icon: Clock },
  "Заброньовано": { color: "#3B82F6", bg: "#DBEAFE", label: "Заброньовано", icon: Car },
  "Вільно": { color: "#9CA3AF", bg: "#F3F4F6", label: "Вільно", icon: Circle },
  "Заблоковано": { color: "#EF4444", bg: "#FEE2E2", label: "Заблоковано", icon: XCircle },
};

const HOUR_HEIGHT = 72;
const START_HOUR = 8;

type DrawerSlot = Slot & { instructor: typeof instructors[0] };

export function SchedulePage() {
  const [viewMode, setViewMode] = useState<"timeline" | "week">("timeline");
  const [selectedDay, setSelectedDay] = useState(2); // Ср
  const [selectedSlot, setSelectedSlot] = useState<DrawerSlot | null>(null);
  const [filterInstructor, setFilterInstructor] = useState<number | null>(null);

  const daySlots = slots.filter(
    (s) =>
      s.day === selectedDay &&
      (filterInstructor === null || s.instructorId === filterInstructor)
  );

  const filteredInstructors = filterInstructor
    ? instructors.filter((i) => i.id === filterInstructor)
    : instructors;

  return (
    <div className="flex flex-col gap-5" style={{ height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h1 style={{ color: "#1E1B4B", fontSize: 22, fontWeight: 700 }}>Розклад</h1>
          <p style={{ color: "#A78BFA", fontSize: 13 }}>Тиждень 5 — 11 Травня 2026</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex rounded-2xl p-1" style={{ background: "#EDE9FE" }}>
            {(["timeline", "week"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className="px-3.5 py-1.5 rounded-xl transition-all"
                style={{
                  background: viewMode === m ? "#7C3AED" : "transparent",
                  color: viewMode === m ? "#fff" : "#7C3AED",
                  fontSize: 12,
                  fontWeight: 600,
                  boxShadow: viewMode === m ? "0 2px 8px rgba(124,58,237,0.3)" : "none",
                }}
              >
                {m === "timeline" ? "Таймлайн" : "Тиждень"}
              </button>
            ))}
          </div>

          {/* Filter by instructor */}
          <div className="relative">
            <select
              value={filterInstructor ?? "all"}
              onChange={(e) =>
                setFilterInstructor(e.target.value === "all" ? null : Number(e.target.value))
              }
              className="appearance-none pl-8 pr-8 py-2 rounded-2xl outline-none cursor-pointer"
              style={{
                background: "#fff",
                border: "1.5px solid #EDE9FE",
                fontSize: 12,
                color: "#1E1B4B",
                fontWeight: 500,
              }}
            >
              <option value="all">Всі інструктори</option>
              {instructors.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
            <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#A78BFA", pointerEvents: "none" }} />
          </div>

          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl"
            style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "#fff", fontSize: 12, fontWeight: 600, boxShadow: "0 4px 14px rgba(124,58,237,0.3)" }}
          >
            <Plus size={14} />
            Додати слот
          </button>
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDay(i)}
            className="flex-shrink-0 px-4 py-2.5 rounded-2xl transition-all"
            style={{
              background: selectedDay === i ? "linear-gradient(135deg, #7C3AED, #A855F7)" : "#fff",
              color: selectedDay === i ? "#fff" : "#6B7280",
              fontSize: 13,
              fontWeight: selectedDay === i ? 700 : 500,
              border: selectedDay === i ? "none" : "1.5px solid #EDE9FE",
              boxShadow: selectedDay === i ? "0 4px 14px rgba(124,58,237,0.25)" : "none",
              minWidth: 80,
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div
        className="flex-1 rounded-3xl overflow-hidden"
        style={{ background: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.07)", overflowY: "auto" }}
      >
        <div className="flex min-w-0">
          {/* Time column */}
          <div
            className="flex-shrink-0 pt-14"
            style={{ width: 64, borderRight: "1px solid #F3F4F6" }}
          >
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex items-start justify-end pr-3"
                style={{ height: HOUR_HEIGHT, paddingTop: 4 }}
              >
                <span style={{ fontSize: 11, color: "#C4B5FD", fontWeight: 500 }}>{h}</span>
              </div>
            ))}
          </div>

          {/* Instructor columns */}
          <div className="flex flex-1 min-w-0 overflow-x-auto">
            {filteredInstructors.map((instructor) => {
              const instrSlots = daySlots.filter((s) => s.instructorId === instructor.id);
              return (
                <div
                  key={instructor.id}
                  className="relative flex-1"
                  style={{ minWidth: 160, borderRight: "1px solid #F3F4F6" }}
                >
                  {/* Header */}
                  <div
                    className="sticky top-0 flex items-center gap-2 px-3 py-3 z-10"
                    style={{ background: "#fff", borderBottom: "1px solid #F3F4F6" }}
                  >
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ width: 28, height: 28, background: instructor.bg }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: instructor.color }}>
                        {instructor.name.charAt(0)}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#1E1B4B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {instructor.name.split(" ")[0]}
                    </div>
                  </div>

                  {/* Grid lines */}
                  <div className="relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                    {HOURS.map((_, hi) => (
                      <div
                        key={hi}
                        className="absolute w-full"
                        style={{ top: hi * HOUR_HEIGHT, height: HOUR_HEIGHT, borderBottom: "1px dashed #F3F4F6" }}
                      />
                    ))}

                    {/* Slots */}
                    {instrSlots.map((slot) => {
                      const top = (slot.startHour - START_HOUR) * HOUR_HEIGHT;
                      const height = slot.duration * HOUR_HEIGHT - 4;
                      const cfg = statusConfig[slot.status];
                      const StatusIcon = cfg.icon;
                      return (
                        <div
                          key={slot.id}
                          className="absolute left-1 right-1 rounded-2xl px-2.5 py-2 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                          style={{
                            top: top + 2,
                            height,
                            background: cfg.bg,
                            border: `1.5px solid ${cfg.color}20`,
                            boxShadow: `0 2px 8px ${cfg.color}20`,
                          }}
                          onClick={() =>
                            setSelectedSlot({ ...slot, instructor })
                          }
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <StatusIcon size={10} style={{ color: cfg.color }} />
                            <span style={{ fontSize: 10, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                          </div>
                          {slot.student && (
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#1E1B4B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {slot.student}
                            </div>
                          )}
                          <div style={{ fontSize: 10, color: "#9CA3AF" }}>
                            {slot.startHour}:00 – {(slot.startHour + slot.duration).toString().replace(".5", ":30")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slot detail drawer */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-end" onClick={() => setSelectedSlot(null)}>
          <div
            className="h-full flex flex-col"
            style={{ width: 360, background: "#fff", boxShadow: "-8px 0 40px rgba(124,58,237,0.15)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between p-6"
              style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)" }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Деталі заняття</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                  {DAYS[selectedSlot.day].replace(" ", ", ")} Травня
                </div>
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="p-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <X size={16} color="#fff" />
              </button>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-5 overflow-auto">
              {/* Status badge */}
              {(() => {
                const cfg = statusConfig[selectedSlot.status];
                const StatusIcon = cfg.icon;
                return (
                  <div className="flex items-center gap-2">
                    <div className="rounded-2xl px-4 py-2 flex items-center gap-2" style={{ background: cfg.bg }}>
                      <StatusIcon size={14} style={{ color: cfg.color }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Info */}
              <div className="flex flex-col gap-3">
                <InfoRow icon={Clock} label="Час" value={`${selectedSlot.startHour}:00 – ${(selectedSlot.startHour + selectedSlot.duration).toString().replace(".5", ":30")}`} />
                <InfoRow icon={User} label="Інструктор" value={selectedSlot.instructor.name} />
                {selectedSlot.student && (
                  <InfoRow icon={User} label="Студент" value={selectedSlot.student} />
                )}
                {selectedSlot.phone && (
                  <InfoRow icon={Phone} label="Телефон" value={selectedSlot.phone} />
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-auto">
                <button
                  className="w-full py-3 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "#fff", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
                >
                  Редагувати заняття
                </button>
                <button
                  className="w-full py-3 rounded-2xl"
                  style={{ background: "#FEE2E2", color: "#EF4444", fontSize: 14, fontWeight: 600 }}
                >
                  Скасувати заняття
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "#F9F7FF" }}>
      <div className="rounded-xl flex items-center justify-center" style={{ width: 34, height: 34, background: "#EDE9FE" }}>
        <Icon size={15} style={{ color: "#7C3AED" }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#A78BFA" }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1B4B" }}>{value}</div>
      </div>
    </div>
  );
}
