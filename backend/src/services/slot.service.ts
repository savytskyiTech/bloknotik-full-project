import { PrismaClient, SlotStatus } from '@prisma/client';
import { ValidationError, GoneError, NotFoundError, ForbiddenError } from '../utils/errors';
import { isValidSlotDuration, isSlotPast, parseDate } from '../utils/date';
import { startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

/**
 * Slot management service.
 * Implements business rules from §1 (slot duration, overlap, read-only).
 */
export class SlotService {
  /**
   * Create a new slot for an instructor.
   * Validates duration (1-2 hours) and checks for overlaps.
   */
  async create(
    instructorId: string,
    startTime: string,
    endTime: string
  ) {
    const start = parseDate(startTime);
    const end = parseDate(endTime);

    // §1.1: Validate duration (1-2 hours)
    if (!isValidSlotDuration(start, end)) {
      throw new ValidationError('Тривалість слота має бути від 1 до 2 годин');
    }

    // §1.3: Cannot create slots in the past
    if (isSlotPast(start)) {
      throw new ValidationError('Не можна створити слот у минулому');
    }

    // §1.2: Check for overlaps
    const overlapping = await prisma.slot.count({
      where: {
        instructor_id: instructorId,
        status: { not: SlotStatus.cancelled },
        start_time: { lt: end },
        end_time: { gt: start },
      },
    });

    if (overlapping > 0) {
      throw new ValidationError('Цей час перетинається з іншим слотом');
    }

    return prisma.slot.create({
      data: {
        instructor_id: instructorId,
        start_time: start,
        end_time: end,
        status: SlotStatus.available,
      },
    });
  }

  /**
   * Get slots for an instructor, optionally filtered by date.
   */
  async getSlots(
    instructorId?: string,
    date?: string,
    userRole?: string,
    userId?: string
  ) {
    const where: Record<string, unknown> = {};

    // Role-based filtering (§6.2)
    if (userRole === 'student' || userRole === 'instructor') {
      // Students and instructors can only see slots for their instructor
      where.instructor_id = instructorId;
    } else if (instructorId) {
      // Manager can filter by instructor_id
      where.instructor_id = instructorId;
    }

    // Date filter
    if (date) {
      const dayStart = startOfDay(parseDate(date));
      const dayEnd = endOfDay(parseDate(date));
      where.start_time = { gte: dayStart, lte: dayEnd };
    }

    return prisma.slot.findMany({
      where,
      include: {
        booking: {
          include: {
            student: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { start_time: 'asc' },
    });
  }

  /**
   * Delete a slot.
   * Only available slots that haven't started can be deleted.
   */
  async delete(slotId: string, userId: string, userRole: string) {
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });

    if (!slot) {
      throw new NotFoundError('Слот не знайдено');
    }

    // §1.3: Read-only check
    if (isSlotPast(slot.start_time)) {
      throw new GoneError('Цей слот більше не доступний для змін');
    }

    // Only owner instructor or manager can delete
    if (userRole === 'instructor' && slot.instructor_id !== userId) {
      throw new ForbiddenError('Ви можете видаляти тільки свої слоти');
    }

    // Can only delete available slots
    if (slot.status !== SlotStatus.available) {
      throw new ValidationError('Можна видалити тільки вільний слот');
    }

    return prisma.slot.update({
      where: { id: slotId },
      data: { status: SlotStatus.cancelled },
    });
  }
}
