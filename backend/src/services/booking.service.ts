import { PrismaClient, BookingStatus, SlotStatus } from '@prisma/client';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  GoneError,
} from '../utils/errors';
import {
  isMoreThan24HoursAway,
  isSlotPast,
  getSlotDurationHours,
  getWeekStart,
  getWeekEnd,
} from '../utils/date';

const prisma = new PrismaClient();

export class BookingService {
  async create(studentId: string, slotId: string, assignedInstructorId?: string) {
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) throw new NotFoundError('Слот не знайдено');
    if (isSlotPast(slot.start_time)) throw new GoneError('Цей слот більше не доступний для змін');
    if (assignedInstructorId && slot.instructor_id !== assignedInstructorId) {
      throw new ForbiddenError('Ви можете бронювати тільки у свого інструктора');
    }
    if (slot.status !== SlotStatus.available) throw new ConflictError('Слот вже зайнято');

    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: { slot_id: slotId, student_id: studentId, status: BookingStatus.confirmed },
        include: { slot: true, student: { select: { id: true, name: true, email: true } } },
      }),
      prisma.slot.update({ where: { id: slotId }, data: { status: SlotStatus.booked } }),
    ]);
    return booking;
  }

  async getBookings(userId: string, userRole: string) {
    const where: any = {};
    if (userRole === 'student') where.student_id = userId;
    else if (userRole === 'instructor') where.slot = { instructor_id: userId };

    return prisma.booking.findMany({
      where,
      include: {
        slot: { include: { instructor: { select: { id: true, name: true } } } },
        student: { select: { id: true, name: true, email: true } },
        lesson_note: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async cancel(bookingId: string, userId: string, userRole: string, reason?: string, cancelledBy?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }, include: { slot: true },
    });
    if (!booking) throw new NotFoundError('Бронювання не знайдено');
    if (booking.status !== BookingStatus.confirmed) {
      throw new ValidationError('Можна скасувати тільки підтверджене бронювання');
    }

    if (userRole === 'student') {
      if (booking.student_id !== userId) throw new ForbiddenError('Ви можете скасовувати тільки свої бронювання');
      if (!isMoreThan24HoursAway(booking.slot.start_time)) {
        throw new ValidationError('До заняття менше 24 годин. Самостійне скасування недоступне. Зверніться до адміністрації.');
      }
    }
    if (userRole === 'instructor' && booking.slot.instructor_id !== userId) {
      throw new ForbiddenError('Ви можете скасовувати тільки заняття своїх учнів');
    }

    const [updatedBooking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.cancelled, cancelled_by: cancelledBy || userRole, cancel_reason: reason },
      }),
      prisma.slot.update({ where: { id: booking.slot_id }, data: { status: SlotStatus.available } }),
    ]);
    return updatedBooking;
  }

  async complete(bookingId: string, userId: string, userRole: string, status: 'completed' | 'no_show', notes?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }, include: { slot: true },
    });
    if (!booking) throw new NotFoundError('Бронювання не знайдено');
    if (booking.status !== BookingStatus.confirmed) throw new ValidationError('Можна закрити тільки підтверджене бронювання');
    if (userRole === 'instructor' && booking.slot.instructor_id !== userId) {
      throw new ForbiddenError('Ви можете закривати тільки свої заняття');
    }
    if (status === 'completed' && (!notes || notes.trim() === '')) {
      throw new ValidationError('Нотатка про прогрес обовʼязкова');
    }

    const slotDuration = getSlotDurationHours(booking.slot.start_time, booking.slot.end_time);
    const bStatus = status === 'completed' ? BookingStatus.completed : BookingStatus.no_show;
    const sStatus = status === 'completed' ? SlotStatus.completed : SlotStatus.no_show;

    const ops: any[] = [
      prisma.booking.update({
        where: { id: bookingId }, data: { status: bStatus, notes },
        include: { slot: true, student: { select: { id: true, name: true } }, lesson_note: true },
      }),
      prisma.slot.update({ where: { id: booking.slot_id }, data: { status: sStatus } }),
    ];

    if (status === 'completed') {
      ops.push(prisma.user.update({ where: { id: booking.student_id }, data: { total_hours_driven: { increment: slotDuration } } }));
      if (notes) {
        ops.push(prisma.lessonNote.create({
          data: { booking_id: bookingId, instructor_id: booking.slot.instructor_id, student_id: booking.student_id, text: notes },
        }));
      }
    }

    const [updatedBooking] = await prisma.$transaction(ops);
    return updatedBooking;
  }

  async getAvailability(studentId: string, assignedInstructorId?: string) {
    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd();

    const lessonsThisWeek = await prisma.booking.count({
      where: {
        student_id: studentId,
        status: { in: [BookingStatus.confirmed, BookingStatus.completed] },
        slot: { start_time: { gte: weekStart, lte: weekEnd } },
      },
    });

    let waitlistPosition: number | undefined;
    if (assignedInstructorId) {
      const entry = await prisma.waitlistEntry.findFirst({
        where: { student_id: studentId, instructor_id: assignedInstructorId, status: 'waiting' },
      });
      if (entry) {
        waitlistPosition = await prisma.waitlistEntry.count({
          where: { instructor_id: assignedInstructorId, date: entry.date, status: 'waiting', created_at: { lte: entry.created_at } },
        });
      }
    }

    return {
      can_book: true,
      has_priority: lessonsThisWeek < 2,
      lessons_this_week: lessonsThisWeek,
      min_required: 2,
      waitlist_position: waitlistPosition,
    };
  }
}
