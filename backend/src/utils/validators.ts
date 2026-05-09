import { z } from 'zod';

// ─── Auth ──────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Невірний формат email'),
  password: z.string().min(1, 'Пароль обовʼязковий'),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token обовʼязковий'),
});

// ─── Slots ─────────────────────────────────────────────

export const createSlotSchema = z.object({
  start_time: z.string().datetime({ message: 'Невірний формат дати (ISO 8601)' }),
  end_time: z.string().datetime({ message: 'Невірний формат дати (ISO 8601)' }),
});

export const getSlotsQuerySchema = z.object({
  instructor_id: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат дати: YYYY-MM-DD').optional(),
});

// ─── Bookings ──────────────────────────────────────────

export const createBookingSchema = z.object({
  slot_id: z.string().uuid('Невірний slot_id'),
});

export const cancelBookingSchema = z.object({
  reason: z.string().optional(),
  cancelled_by: z.enum(['student', 'instructor', 'manager']).optional(),
});

export const completeLessonSchema = z.object({
  status: z.enum(['completed', 'no_show'], {
    errorMap: () => ({ message: 'Статус має бути "completed" або "no_show"' }),
  }),
  notes: z.string().optional(),
});

// ─── Waitlist ──────────────────────────────────────────

export const createWaitlistSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат дати: YYYY-MM-DD'),
  instructor_id: z.string().uuid('Невірний instructor_id'),
});

// ─── Users ─────────────────────────────────────────────

export const updateStudentSchema = z.object({
  assigned_instructor_id: z.string().uuid('Невірний instructor_id'),
});

export const createInstructorSchema = z.object({
  name: z.string().min(1, 'Імʼя обовʼязкове'),
  email: z.string().email('Невірний формат email'),
  password: z.string().min(6, 'Пароль має бути мінімум 6 символів'),
});

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Імʼя обовʼязкове'),
  email: z.string().email('Невірний формат email'),
  password: z.string().min(6, 'Пароль має бути мінімум 6 символів'),
  assigned_instructor_id: z.string().uuid('Невірний instructor_id'),
});
