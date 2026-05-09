import { Request, Response, NextFunction } from 'express';
import { SlotService } from '../services/slot.service';
import { createSlotSchema, getSlotsQuerySchema } from '../utils/validators';
import { ForbiddenError } from '../utils/errors';

const slotService = new SlotService();

/**
 * Slot controller — handles slot CRUD (§1, §8).
 */
export class SlotController {
  /** GET /slots?instructor_id=&date= */
  async getSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const query = getSlotsQuerySchema.parse(req.query);
      const user = req.user!;

      // §6.2: Students can only see their instructor's slots
      let instructorId = query.instructor_id;
      if (user.role === 'student') {
        instructorId = user.assigned_instructor_id;
        if (!instructorId) {
          throw new ForbiddenError('Вам не призначено інструктора');
        }
      } else if (user.role === 'instructor') {
        instructorId = user.sub; // Instructors see only their own slots
      }

      const slots = await slotService.getSlots(instructorId, query.date, user.role, user.sub);
      res.json(slots);
    } catch (err) {
      next(err);
    }
  }

  /** POST /slots */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { start_time, end_time } = createSlotSchema.parse(req.body);
      const user = req.user!;

      // Instructor creates for self, manager must specify (uses own id for now)
      const instructorId = user.role === 'instructor' ? user.sub : req.body.instructor_id || user.sub;

      const slot = await slotService.create(instructorId, start_time, end_time);
      res.status(201).json(slot);
    } catch (err) {
      next(err);
    }
  }

  /** DELETE /slots/:id */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      await slotService.delete(req.params.id, user.sub, user.role);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
