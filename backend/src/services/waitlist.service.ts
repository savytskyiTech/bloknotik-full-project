import { PrismaClient, WaitlistStatus, SlotStatus } from '@prisma/client';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors';
import { getWeekStart, getWeekEnd } from '../utils/date';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

const prisma = new PrismaClient();

/**
 * Waitlist service — "Smart Queue" algorithm (§4).
 */
export class WaitlistService {
  /** §4.1: Add student to waitlist for a date */
  async add(studentId: string, instructorId: string, dateStr: string) {
    const date = parseISO(dateStr);

    // Check if already in waitlist for this date+instructor
    const existing = await prisma.waitlistEntry.findFirst({
      where: { student_id: studentId, instructor_id: instructorId, date, status: WaitlistStatus.waiting },
    });
    if (existing) throw new ValidationError('Ви вже в черзі на цю дату');

    // Check if there are really no available slots
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const availableSlots = await prisma.slot.count({
      where: {
        instructor_id: instructorId, status: SlotStatus.available,
        start_time: { gte: dayStart, lte: dayEnd },
      },
    });
    if (availableSlots > 0) throw new ValidationError('Є вільні слоти на цю дату. Забронюйте напряму.');

    const entry = await prisma.waitlistEntry.create({
      data: { student_id: studentId, instructor_id: instructorId, date, status: WaitlistStatus.waiting },
    });

    // Calculate position
    const position = await prisma.waitlistEntry.count({
      where: { instructor_id: instructorId, date, status: WaitlistStatus.waiting, created_at: { lte: entry.created_at } },
    });

    return { id: entry.id, position };
  }

  /** Get waitlist status for a student */
  async getStatus(studentId: string) {
    const entries = await prisma.waitlistEntry.findMany({
      where: { student_id: studentId, status: { in: [WaitlistStatus.waiting, WaitlistStatus.notified] } },
      orderBy: { date: 'asc' },
    });

    if (entries.length === 0) {
      return { in_waitlist: false, entries: [] };
    }

    const enriched = await Promise.all(
      entries.map(async (entry) => {
        const position = await prisma.waitlistEntry.count({
          where: {
            instructor_id: entry.instructor_id, date: entry.date, status: WaitlistStatus.waiting,
            created_at: { lte: entry.created_at },
          },
        });
        return { id: entry.id, position, date: entry.date.toISOString().split('T')[0], instructor_id: entry.instructor_id, status: entry.status };
      })
    );

    return { in_waitlist: true, entries: enriched };
  }

  /** §4.3: Process freed slot — find and notify waitlisted students */
  async processFreedSlot(slotId: string, instructorId: string, slotDate: Date) {
    const date = startOfDay(slotDate);
    const entries = await prisma.waitlistEntry.findMany({
      where: { instructor_id: instructorId, date, status: WaitlistStatus.waiting },
      include: { student: true },
      orderBy: { created_at: 'asc' },
    });

    if (entries.length === 0) return;

    const weekStart = getWeekStart(slotDate);
    const weekEnd = getWeekEnd(slotDate);

    // §4.3 step 2-3: Prioritize by weekly minimum, then by total_hours_driven
    const enriched = await Promise.all(
      entries.map(async (entry) => {
        const lessonsThisWeek = await prisma.booking.count({
          where: {
            student_id: entry.student_id,
            status: { in: ['confirmed', 'completed'] },
            slot: { start_time: { gte: weekStart, lte: weekEnd } },
          },
        });
        return { ...entry, lessonsThisWeek, totalHours: entry.student.total_hours_driven };
      })
    );

    enriched.sort((a, b) => {
      const aPriority = a.lessonsThisWeek < 2 ? 0 : 1;
      const bPriority = b.lessonsThisWeek < 2 ? 0 : 1;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.totalHours - b.totalHours;
    });

    // Mark top entries as notified (in production, send Telegram/Push here)
    const topN = enriched.slice(0, 3);
    await prisma.waitlistEntry.updateMany({
      where: { id: { in: topN.map((e) => e.id) } },
      data: { status: WaitlistStatus.notified },
    });
  }

  /** §4.3 step 5: Confirm from waitlist — first come first served */
  async confirm(waitlistEntryId: string, studentId: string) {
    const entry = await prisma.waitlistEntry.findUnique({ where: { id: waitlistEntryId } });
    if (!entry) throw new NotFoundError('Запис у черзі не знайдено');
    if (entry.student_id !== studentId) throw new ValidationError('Це не ваш запис у черзі');
    if (entry.status !== WaitlistStatus.notified) throw new ValidationError('Ви ще не отримали сповіщення');

    // Find available slot for this date+instructor
    const dayStart = startOfDay(entry.date);
    const dayEnd = endOfDay(entry.date);
    const availableSlot = await prisma.slot.findFirst({
      where: {
        instructor_id: entry.instructor_id, status: SlotStatus.available,
        start_time: { gte: dayStart, lte: dayEnd },
      },
      orderBy: { start_time: 'asc' },
    });

    if (!availableSlot) throw new ConflictError('На жаль, вільних слотів вже немає');

    // Book the slot and mark waitlist entry as confirmed
    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: { slot_id: availableSlot.id, student_id: studentId, status: 'confirmed' },
        include: { slot: true },
      }),
      prisma.slot.update({ where: { id: availableSlot.id }, data: { status: SlotStatus.booked } }),
      prisma.waitlistEntry.update({ where: { id: waitlistEntryId }, data: { status: WaitlistStatus.confirmed } }),
    ]);

    return booking;
  }

  /** Remove from waitlist */
  async remove(entryId: string, userId: string, userRole: string) {
    const entry = await prisma.waitlistEntry.findUnique({ where: { id: entryId } });
    if (!entry) throw new NotFoundError('Запис у черзі не знайдено');
    if (userRole === 'student' && entry.student_id !== userId) {
      throw new ValidationError('Це не ваш запис у черзі');
    }
    await prisma.waitlistEntry.delete({ where: { id: entryId } });
  }
}
