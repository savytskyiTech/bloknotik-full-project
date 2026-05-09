import { useState } from 'react';
import { Eye, EyeOff, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface LoginPageProps {
  onLogin?: (user: { id: string; name: string; role: string; assigned_instructor_id?: string }) => void;
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
      onLogin?.(data.user);
    } catch (err: any) {
      setError(err.message || 'Помилка входу');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'var(--gradient-primary)' }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)' }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: 'var(--gradient-primary)', boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.4)' }}
          >
            <GraduationCap size={36} className="text-white" />
          </div>
          <h1 className="text-foreground text-center">Вітаємо</h1>
          <p className="text-muted-foreground text-sm mt-1 text-center">
            Увійдіть до свого облікового запису студента
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-6 shadow-xl"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 20px 60px -15px rgba(139, 92, 246, 0.15)',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="student-login-form">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="student-email" className="text-foreground text-sm font-semibold">
                Email
              </label>
              <input
                id="student-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'var(--input-background)',
                  color: 'var(--foreground)',
                  border: '1.5px solid transparent',
                }}
                onFocus={(e) => (e.target.style.border = '1.5px solid var(--primary)')}
                onBlur={(e) => (e.target.style.border = '1.5px solid transparent')}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="student-password" className="text-foreground text-sm font-semibold">
                  Пароль
                </label>
                <button
                  type="button"
                  id="student-forgot-password"
                  className="text-xs font-semibold transition-colors"
                  style={{ color: 'var(--primary)' }}
                >
                  Забули пароль?
                </button>
              </div>
              <div className="relative">
                <input
                  id="student-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl px-4 py-3.5 pr-12 text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'var(--input-background)',
                    color: 'var(--foreground)',
                    border: '1.5px solid transparent',
                  }}
                  onFocus={(e) => (e.target.style.border = '1.5px solid var(--primary)')}
                  onBlur={(e) => (e.target.style.border = '1.5px solid transparent')}
                />
                <button
                  type="button"
                  id="student-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-xl transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-2xl px-4 py-3 text-sm font-medium"
                style={{
                  background: 'rgba(255, 71, 87, 0.08)',
                  color: 'var(--destructive)',
                  border: '1px solid rgba(255, 71, 87, 0.2)',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="student-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl py-4 flex items-center justify-center gap-2.5 text-sm font-semibold text-white transition-all duration-200 mt-1 disabled:opacity-70"
              style={{
                background: 'var(--gradient-primary)',
                boxShadow: '0 8px 24px -4px rgba(139, 92, 246, 0.45)',
              }}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Увійти
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: 'var(--muted-foreground)' }}>
          Ще немає акаунту?{' '}
          <button
            id="student-register-link"
            type="button"
            className="font-semibold transition-colors"
            style={{ color: 'var(--primary)' }}
          >
            Звернутись до адміністратора
          </button>
        </p>
      </div>
    </div>
  );
}
