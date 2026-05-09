import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import { ProgressService } from '../services/progress.service';
import {
  updateStudentSchema,
  createInstructorSchema,
  createStudentSchema,
} from '../utils/validators';
import { ForbiddenError } from '../utils/errors';

const studentService = new StudentService();
const progressService = new ProgressService();

/**
 * User controller — handles student/instructor management and progress (§6, §8).
 */
export class UserController {
  /** GET /students */
  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await studentService.getAllStudents();
      res.json(students);
    } catch (err) {
      next(err);
    }
  }

  /** GET /students/:id */
  async getStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      // Instructors can only see their own students
      if (user.role === 'instructor') {
        const students = await studentService.getInstructorStudents(user.sub);
        const found = students.find((s) => s.id === req.params.id);
        if (!found) throw new ForbiddenError('Цей учень не належить до вашого списку');
        res.json(found);
        return;
      }
      const student = await studentService.getStudent(req.params.id);
      res.json(student);
    } catch (err) {
      next(err);
    }
  }

  /** PATCH /students/:id — reassign instructor (manager only) */
  async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { assigned_instructor_id } = updateStudentSchema.parse(req.body);
      const result = await studentService.reassignInstructor(
        req.params.id,
        assigned_instructor_id
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /** POST /students — create student (manager only) */
  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createStudentSchema.parse(req.body);
      const student = await studentService.createStudent(
        data.name,
        data.email,
        data.password,
        data.assigned_instructor_id
      );
      res.status(201).json(student);
    } catch (err) {
      next(err);
    }
  }

  /** GET /instructors */
  async getAllInstructors(req: Request, res: Response, next: NextFunction) {
    try {
      const instructors = await studentService.getAllInstructors();
      res.json(instructors);
    } catch (err) {
      next(err);
    }
  }

  /** POST /instructors — create instructor (manager only) */
  async createInstructor(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createInstructorSchema.parse(req.body);
      const instructor = await studentService.createInstructor(
        data.name,
        data.email,
        data.password
      );
      res.status(201).json(instructor);
    } catch (err) {
      next(err);
    }
  }

  /** GET /instructors/:id/students */
  async getInstructorStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      // Instructor can only see their own students
      if (user.role === 'instructor' && user.sub !== req.params.id) {
        throw new ForbiddenError('Ви можете переглядати тільки своїх учнів');
      }
      const students = await studentService.getInstructorStudents(req.params.id);
      res.json(students);
    } catch (err) {
      next(err);
    }
  }

  /** GET /students/:id/progress */
  async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const studentId = req.params.id;

      // Students can only see their own progress
      if (user.role === 'student' && user.sub !== studentId) {
        throw new ForbiddenError('Ви можете переглядати тільки свій прогрес');
      }

      const progress = await progressService.getProgress(studentId);
      res.json(progress);
    } catch (err) {
      next(err);
    }
  }

  /** GET /students/:id/notes */
  async getNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const studentId = req.params.id;

      // Students can only see their own notes
      if (user.role === 'student' && user.sub !== studentId) {
        throw new ForbiddenError('Ви можете переглядати тільки свої нотатки');
      }

      const notes = await progressService.getNotes(studentId);
      res.json(notes);
    } catch (err) {
      next(err);
    }
  }
}
