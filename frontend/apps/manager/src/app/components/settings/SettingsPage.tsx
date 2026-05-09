import { useState } from "react";
import { Bell, Shield, Globe, Palette, Car, Save, ChevronRight } from "lucide-react";

const settingsSections = [
  {
    id: "general",
    icon: Car,
    title: "Загальні",
    desc: "Назва школи, адреса, контакти",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Сповіщення",
    desc: "Email, push-сповіщення та вейтліст",
  },
  {
    id: "security",
    icon: Shield,
    title: "Безпека",
    desc: "Паролі, 2FA, доступи",
  },
  {
    id: "appearance",
    icon: Palette,
    title: "Зовнішній вигляд",
    desc: "Тема, мова, часовий пояс",
  },
  {
    id: "integrations",
    icon: Globe,
    title: "Інтеграції",
    desc: "Telegram бот, API ключі",
  },
];

export function SettingsPage() {
  const [active, setActive] = useState("general");
  const [schoolName, setSchoolName] = useState("GoDrive Автошкола");
  const [email, setEmail] = useState("admin@godrive.ua");
  const [phone, setPhone] = useState("+380 44 123 45 67");
  const [city, setCity] = useState("Київ");
  const [notifications, setNotifications] = useState({
    cancelAlert: true,
    waitlistFill: true,
    newStudent: true,
    weeklyReport: false,
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 style={{ color: "#1E1B4B", fontSize: 22, fontWeight: 700 }}>Налаштування</h1>
        <p style={{ color: "#A78BFA", fontSize: 13 }}>Управління системою GoDrive</p>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Sidebar */}
        <div
          className="rounded-3xl p-3 flex flex-col gap-1 lg:w-64 flex-shrink-0 h-fit"
          style={{ background: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.07)" }}
        >
          {settingsSections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="flex items-center gap-3 p-3 rounded-2xl text-left w-full transition-all"
                style={{
                  background: isActive ? "linear-gradient(135deg, #7C3AED, #A855F7)" : "transparent",
                  boxShadow: isActive ? "0 4px 14px rgba(124,58,237,0.25)" : "none",
                }}
              >
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 34, height: 34, background: isActive ? "rgba(255,255,255,0.2)" : "#F5F3FF" }}
                >
                  <Icon size={16} style={{ color: isActive ? "#fff" : "#7C3AED" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#fff" : "#1E1B4B" }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.7)" : "#A78BFA" }}>{s.desc}</div>
                </div>
                {!isActive && <ChevronRight size={14} style={{ color: "#C4B5FD", marginLeft: "auto" }} />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {active === "general" && (
            <SettingsCard title="Загальні налаштування" desc="Основна інформація про автошколу">
              <FieldGroup label="Назва школи">
                <StyledInput value={schoolName} onChange={setSchoolName} />
              </FieldGroup>
              <FieldGroup label="Email адміністратора">
                <StyledInput value={email} onChange={setEmail} type="email" />
              </FieldGroup>
              <FieldGroup label="Телефон">
                <StyledInput value={phone} onChange={setPhone} type="tel" />
              </FieldGroup>
              <FieldGroup label="Місто">
                <StyledInput value={city} onChange={setCity} />
              </FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Тривалість заняття (хв)">
                  <StyledInput value="90" onChange={() => {}} />
                </FieldGroup>
                <FieldGroup label="Мінімум занять для іспиту">
                  <StyledInput value="40" onChange={() => {}} />
                </FieldGroup>
              </div>
              <SaveButton />
            </SettingsCard>
          )}

          {active === "notifications" && (
            <SettingsCard title="Сповіщення" desc="Налаштування системних повідомлень">
              <div className="flex flex-col gap-4">
                <ToggleRow
                  label="Скасування за < 24 год"
                  desc="Сповіщення при пізньому скасуванні"
                  checked={notifications.cancelAlert}
                  onChange={(v) => setNotifications((n) => ({ ...n, cancelAlert: v }))}
                />
                <ToggleRow
                  label="Вейтліст заповнено"
                  desc="Коли вільний слот автоматично заповнено"
                  checked={notifications.waitlistFill}
                  onChange={(v) => setNotifications((n) => ({ ...n, waitlistFill: v }))}
                />
                <ToggleRow
                  label="Новий студент"
                  desc="При реєстрації нового студента"
                  checked={notifications.newStudent}
                  onChange={(v) => setNotifications((n) => ({ ...n, newStudent: v }))}
                />
                <ToggleRow
                  label="Тижневий звіт"
                  desc="Зведення статистики щопонеділка"
                  checked={notifications.weeklyReport}
                  onChange={(v) => setNotifications((n) => ({ ...n, weeklyReport: v }))}
                />
              </div>
              <SaveButton />
            </SettingsCard>
          )}

          {active === "security" && (
            <SettingsCard title="Безпека" desc="Захист облікового запису">
              <FieldGroup label="Поточний пароль">
                <StyledInput value="" onChange={() => {}} type="password" placeholder="••••••••" />
              </FieldGroup>
              <FieldGroup label="Новий пароль">
                <StyledInput value="" onChange={() => {}} type="password" placeholder="••••••••" />
              </FieldGroup>
              <FieldGroup label="Підтвердіть пароль">
                <StyledInput value="" onChange={() => {}} type="password" placeholder="••••••••" />
              </FieldGroup>
              <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}>
                <Shield size={16} style={{ color: "#10B981", flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 12, color: "#15803D" }}>
                  Двофакторна аутентифікація (2FA) увімкнена. Ваш акаунт захищено.
                </div>
              </div>
              <SaveButton label="Оновити пароль" />
            </SettingsCard>
          )}

          {active === "appearance" && (
            <SettingsCard title="Зовнішній вигляд" desc="Персоналізація інтерфейсу">
              <FieldGroup label="Мова інтерфейсу">
                <select
                  className="w-full px-4 py-3 rounded-2xl outline-none"
                  style={{ background: "#F9F7FF", border: "1.5px solid #EDE9FE", fontSize: 13, color: "#1E1B4B" }}
                  defaultValue="uk"
                >
                  <option value="uk">Українська</option>
                  <option value="en">English</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Часовий пояс">
                <select
                  className="w-full px-4 py-3 rounded-2xl outline-none"
                  style={{ background: "#F9F7FF", border: "1.5px solid #EDE9FE", fontSize: 13, color: "#1E1B4B" }}
                  defaultValue="kyiv"
                >
                  <option value="kyiv">Київ (UTC+3)</option>
                  <option value="utc">UTC</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Тема">
                <div className="flex gap-3">
                  {["Світла", "Темна", "Авто"].map((t) => (
                    <button
                      key={t}
                      className="flex-1 py-3 rounded-2xl"
                      style={{
                        background: t === "Світла" ? "linear-gradient(135deg, #7C3AED, #A855F7)" : "#F9F7FF",
                        color: t === "Світла" ? "#fff" : "#6B7280",
                        fontSize: 13,
                        fontWeight: 600,
                        border: t === "Світла" ? "none" : "1.5px solid #EDE9FE",
                        boxShadow: t === "Світла" ? "0 4px 14px rgba(124,58,237,0.25)" : "none",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </FieldGroup>
              <SaveButton />
            </SettingsCard>
          )}

          {active === "integrations" && (
            <SettingsCard title="Інтеграції" desc="Зовнішні сервіси та API">
              <div
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: "#F9F7FF", border: "1.5px solid #EDE9FE" }}
              >
                <div
                  className="rounded-xl flex items-center justify-center"
                  style={{ width: 44, height: 44, background: "#DBEAFE" }}
                >
                  <Globe size={20} style={{ color: "#3B82F6" }} />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1E1B4B" }}>Telegram Bot</div>
                  <div style={{ fontSize: 12, color: "#A78BFA" }}>@GoDriveBot · Активний</div>
                </div>
                <span className="px-3 py-1 rounded-xl" style={{ background: "#D1FAE5", color: "#10B981", fontSize: 12, fontWeight: 600 }}>
                  ● Активний
                </span>
              </div>
              <FieldGroup label="Telegram Bot Token">
                <StyledInput value="7812345678:AAF..." onChange={() => {}} type="password" />
              </FieldGroup>
              <FieldGroup label="Webhook URL">
                <StyledInput value="https://api.godrive.ua/webhook" onChange={() => {}} />
              </FieldGroup>
              <SaveButton />
            </SettingsCard>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl p-6 flex flex-col gap-5" style={{ background: "#fff", boxShadow: "0 4px 24px rgba(124,58,237,0.07)" }}>
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1E1B4B" }}>{title}</h2>
        <p style={{ fontSize: 13, color: "#A78BFA", marginTop: 2 }}>{desc}</p>
      </div>
      <div className="h-px" style={{ background: "#F3F4F6" }} />
      {children}
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: 12, fontWeight: 600, color: "#7C3AED" }}>{label}</label>
      {children}
    </div>
  );
}

function StyledInput({ value, onChange, type = "text", placeholder }: { value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-2xl outline-none transition-all"
      style={{ background: "#F9F7FF", border: "1.5px solid #EDE9FE", fontSize: 13, color: "#1E1B4B" }}
    />
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{ background: "#F9F7FF", border: "1.5px solid #EDE9FE" }}
    >
      <div className="flex-1">
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1E1B4B" }}>{label}</div>
        <div style={{ fontSize: 11, color: "#A78BFA", marginTop: 1 }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="flex-shrink-0 rounded-full transition-all"
        style={{
          width: 46,
          height: 26,
          background: checked ? "linear-gradient(135deg, #7C3AED, #A855F7)" : "#E5E7EB",
          position: "relative",
          boxShadow: checked ? "0 2px 8px rgba(124,58,237,0.35)" : "none",
        }}
      >
        <span
          className="absolute top-1 rounded-full transition-all"
          style={{
            width: 18,
            height: 18,
            background: "#fff",
            left: checked ? 24 : 4,
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        />
      </button>
    </div>
  );
}

function SaveButton({ label = "Зберегти зміни" }: { label?: string }) {
  return (
    <button
      className="flex items-center gap-2 px-6 py-3 rounded-2xl self-start"
      style={{ background: "linear-gradient(135deg, #7C3AED, #A855F7)", color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}
    >
      <Save size={15} />
      {label}
    </button>
  );
}
