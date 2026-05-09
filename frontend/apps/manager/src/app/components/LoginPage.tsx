import { useState } from 'react';
import { Eye, EyeOff, LayoutDashboard, ArrowRight, Loader2, Users, Calendar, BarChart3 } from 'lucide-react';
import { api } from '../../lib/api';

interface LoginPageProps {
  onLogin?: (user: { id: string; name: string; role: string }) => void;
}

const FEATURES = [
  { icon: Users, label: 'Управління студентами', desc: 'Контроль груп та прогресу' },
  { icon: Calendar, label: 'Розклад занять', desc: 'Планування та контроль' },
  { icon: BarChart3, label: 'Аналітика', desc: 'Звіти та статистика' },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Будь ласка, заповніть усі поля');
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.login(email, password);
      if (data.user.role !== 'manager') {
        api.clearSession();
        setError('Цей акаунт не має доступу до кабінету менеджера');
        return;
      }
      onLogin?.(data.user);
    } catch (err: any) {
      setError(err.message || 'Помилка входу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--background)', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between p-10 relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(160deg, #5B21B6 0%, #7C3AED 50%, #6D28D9 100%)' }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          <div
            className="absolute bottom-0 -left-20 w-72 h-72 rounded-full"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/15 backdrop-blur-sm">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg tracking-tight">GoDrive</div>
              <div className="text-white/60 text-xs">Manager Portal</div>
            </div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10">
          <h1
            className="text-white font-bold text-4xl leading-tight mb-4"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}
          >
            Управляйте<br />школою водіння<br />ефективно
          </h1>
          <p className="text-white/65 text-base leading-relaxed mb-10">
            Єдина платформа для контролю інструкторів, студентів та розкладу занять
          </p>

          {/* Feature list */}
          <div className="flex flex-col gap-4">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  <f.icon size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{f.label}</div>
                  <div className="text-white/55 text-xs">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.75)' }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Система захищена та зашифрована
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--primary)' }}
            >
              <LayoutDashboard size={17} className="text-white" />
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
              GoDrive Manager
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-bold text-3xl mb-2" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
              Вхід до системи
            </h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Введіть дані вашого акаунту менеджера
            </p>
          </div>

          <form onSubmit={handleSubmit} id="manager-login-form" className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="manager-email" className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Email
              </label>
              <input
                id="manager-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@godrive.ua"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1.5px solid var(--border)',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1.5px solid var(--primary)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1.5px solid var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="manager-password" className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                  Пароль
                </label>
                <button
                  type="button"
                  id="manager-forgot-password"
                  className="text-xs font-semibold transition-opacity hover:opacity-75"
                  style={{ color: 'var(--primary)' }}
                >
                  Забули пароль?
                </button>
              </div>
              <div className="relative">
                <input
                  id="manager-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-12 text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'var(--input-background)',
                    color: 'var(--foreground)',
                    border: '1.5px solid var(--border)',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1.5px solid var(--primary)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(124, 58, 237, 0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1.5px solid var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  id="manager-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm font-medium"
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: 'var(--destructive)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="manager-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm font-semibold text-white transition-all duration-200 mt-1 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                boxShadow: '0 4px 20px -4px rgba(124, 58, 237, 0.5)',
              }}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Увійти до системи
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-8" style={{ color: 'var(--muted-foreground)' }}>
            Потрібен доступ?{' '}
            <button
              id="manager-contact-admin"
              type="button"
              className="font-semibold hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              Зверніться до супервізора
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
