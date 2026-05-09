import { Request, Response, NextFunction } from 'express';
import { WaitlistService } from '../services/waitlist.service';
import { createWaitlistSchema } from '../utils/validators';

const waitlistService = new WaitlistService();

/**
 * Waitlist controller — handles smart queue operations (§4, §8).
 */
export class WaitlistController {
  /** POST /waitlist */
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, instructor_id } = createWaitlistSchema.parse(req.body);
      const user = req.user!;
      const result = await waitlistService.add(user.sub, instructor_id, date);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  /** GET /waitlist/status */
  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const status = await waitlistService.getStatus(user.sub);
      res.json(status);
    } catch (err) {
      next(err);
    }
  }

  /** POST /waitlist/:id/confirm */
  async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const booking = await waitlistService.confirm(req.params.id, user.sub);
      res.json(booking);
    } catch (err) {
      next(err);
    }
  }

  /** DELETE /waitlist/:id */
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      await waitlistService.remove(req.params.id, user.sub, user.role);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
