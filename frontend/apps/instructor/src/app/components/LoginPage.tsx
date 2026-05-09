import { useState } from 'react';
import { Eye, EyeOff, Car, ArrowRight, Loader2, Shield } from 'lucide-react';
import { api } from '../../lib/api';

interface LoginPageProps {
  onLogin?: (user: { id: string; name: string; role: string }) => void;
}

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
      if (data.user.role !== 'instructor') {
        api.clearSession();
        setError('Цей акаунт не має доступу до кабінету інструктора');
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--primary)' }}
            >
              <Car size={22} className="text-white" />
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
                GoDrive
              </div>
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Instructor Portal
              </div>
            </div>
          </div>

          <div
            className="w-full rounded-2xl px-4 py-2.5 flex items-center gap-2 text-xs font-medium"
            style={{
              background: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              border: '1px solid var(--border)',
            }}
          >
            <Shield size={14} />
            Захищений вхід для інструкторів
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
          }}
        >
          <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
            Вхід в акаунт
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Введіть ваші дані для доступу до кабінету
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="instructor-login-form">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="instructor-email" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                Email адреса
              </label>
              <input
                id="instructor-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="instructor@godrive.ua"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
                style={{
                  background: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid var(--foreground)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(3, 2, 19, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="instructor-password" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  Пароль
                </label>
                <button
                  type="button"
                  id="instructor-forgot-password"
                  className="text-xs font-medium hover:underline transition-opacity"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Забули пароль?
                </button>
              </div>
              <div className="relative">
                <input
                  id="instructor-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-3.5 py-2.5 pr-11 text-sm outline-none transition-all duration-150"
                  style={{
                    background: 'var(--input-background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid var(--foreground)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(3, 2, 19, 0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  id="instructor-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-opacity hover:opacity-70"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-lg px-3.5 py-3 text-sm"
                style={{
                  background: 'rgba(212, 24, 61, 0.06)',
                  color: 'var(--destructive)',
                  border: '1px solid rgba(212, 24, 61, 0.15)',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="instructor-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-150 mt-1 disabled:opacity-60"
              style={{
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Увійти
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-5" style={{ color: 'var(--muted-foreground)' }}>
          Проблеми з доступом?{' '}
          <button
            id="instructor-contact-support"
            type="button"
            className="font-medium hover:underline"
            style={{ color: 'var(--foreground)' }}
          >
            Зв'яжіться з адміністратором
          </button>
        </p>
      </div>
    </div>
  );
}
