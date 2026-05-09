import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ForbiddenError, NotFoundError, ConflictError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Student/User management service (§2.2, §6).
 * Manager-only operations for instructor/student CRUD.
 */
export class StudentService {
  /** §2.2: Reassign student to a different instructor (manager only) */
  async reassignInstructor(studentId: string, newInstructorId: string) {
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundError('Учня не знайдено');
    if (student.role !== 'student') throw new NotFoundError('Користувач не є учнем');

    const instructor = await prisma.user.findUnique({ where: { id: newInstructorId } });
    if (!instructor) throw new NotFoundError('Інструктора не знайдено');
    if (instructor.role !== 'instructor') throw new NotFoundError('Користувач не є інструктором');

    return prisma.user.update({
      where: { id: studentId },
      data: { assigned_instructor_id: newInstructorId },
      select: { id: true, name: true, email: true, assigned_instructor_id: true },
    });
  }

  /** Get all students (manager) */
  async getAllStudents() {
    return prisma.user.findMany({
      where: { role: 'student' },
      select: {
        id: true, name: true, email: true, assigned_instructor_id: true,
        total_hours_driven: true, created_at: true,
        assigned_instructor: { select: { id: true, name: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  /** Get a single student */
  async getStudent(studentId: string) {
    const student = await prisma.user.findUnique({
      where: { id: studentId, role: 'student' },
      select: {
        id: true, name: true, email: true, assigned_instructor_id: true,
        total_hours_driven: true, created_at: true,
        assigned_instructor: { select: { id: true, name: true } },
      },
    });
    if (!student) throw new NotFoundError('Учня не знайдено');
    return student;
  }

  /** Get all instructors (manager) */
  async getAllInstructors() {
    return prisma.user.findMany({
      where: { role: 'instructor' },
      select: {
        id: true, name: true, email: true, created_at: true,
        students: { select: { id: true, name: true }, where: { role: 'student' } },
      },
      orderBy: { name: 'asc' },
    });
  }

  /** Create an instructor account (manager only) */
  async createInstructor(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError('Користувач з таким email вже існує');

    const passwordHash = await bcrypt.hash(password, 12);
    return prisma.user.create({
      data: { name, email, password_hash: passwordHash, role: 'instructor' },
      select: { id: true, name: true, email: true, role: true, created_at: true },
    });
  }

  /** Create a student account (manager only) */
  async createStudent(name: string, email: string, password: string, assignedInstructorId: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictError('Користувач з таким email вже існує');

    const instructor = await prisma.user.findUnique({ where: { id: assignedInstructorId } });
    if (!instructor || instructor.role !== 'instructor') throw new NotFoundError('Інструктора не знайдено');

    const passwordHash = await bcrypt.hash(password, 12);
    return prisma.user.create({
      data: { name, email, password_hash: passwordHash, role: 'student', assigned_instructor_id: assignedInstructorId },
      select: { id: true, name: true, email: true, role: true, assigned_instructor_id: true, created_at: true },
    });
  }

  /** Get instructor's students */
  async getInstructorStudents(instructorId: string) {
    return prisma.user.findMany({
      where: { role: 'student', assigned_instructor_id: instructorId },
      select: { id: true, name: true, email: true, total_hours_driven: true, created_at: true },
      orderBy: { name: 'asc' },
    });
  }
}
