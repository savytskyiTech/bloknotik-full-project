import { PrismaClient, BookingStatus } from '@prisma/client';
import { getWeekStart, getWeekEnd } from '../utils/date';

const prisma = new PrismaClient();

/**
 * Progress service — student progress tracking (§5).
 */
export class ProgressService {
  /** Get student progress: total hours and completed lessons count */
  async getProgress(studentId: string) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { total_hours_driven: true },
    });

    const lessonsCompleted = await prisma.booking.count({
      where: { student_id: studentId, status: BookingStatus.completed },
    });

    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd();
    const lessonsThisWeek = await prisma.booking.count({
      where: {
        student_id: studentId,
        status: { in: [BookingStatus.confirmed, BookingStatus.completed] },
        slot: { start_time: { gte: weekStart, lte: weekEnd } },
      },
    });

    return {
      total_hours_driven: student?.total_hours_driven ?? 0,
      lessons_completed: lessonsCompleted,
      lessons_this_week: lessonsThisWeek,
    };
  }

  /** Get lesson notes for a student */
  async getNotes(studentId: string) {
    return prisma.lessonNote.findMany({
      where: { student_id: studentId },
      include: {
        instructor: { select: { id: true, name: true } },
        booking: { include: { slot: { select: { start_time: true, end_time: true } } } },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
