import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';
import { createBookingSchema, cancelBookingSchema, completeLessonSchema } from '../utils/validators';

const bookingService = new BookingService();

/**
 * Booking controller — handles booking CRUD and lesson completion (§2, §3, §5, §8).
 */
export class BookingController {
  /** GET /bookings */
  async getBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const bookings = await bookingService.getBookings(user.sub, user.role);
      res.json(bookings);
    } catch (err) {
      next(err);
    }
  }

  /** GET /bookings/availability */
  async getAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const availability = await bookingService.getAvailability(
        user.sub,
        user.assigned_instructor_id
      );
      res.json(availability);
    } catch (err) {
      next(err);
    }
  }

  /** POST /bookings */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { slot_id } = createBookingSchema.parse(req.body);
      const user = req.user!;

      // Students pass their assigned_instructor_id for validation
      const assignedInstructorId =
        user.role === 'student' ? user.assigned_instructor_id : undefined;

      const booking = await bookingService.create(user.sub, slot_id, assignedInstructorId);
      res.status(201).json(booking);
    } catch (err) {
      next(err);
    }
  }

  /** DELETE /bookings/:id */
  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const body = cancelBookingSchema.parse(req.body);
      const user = req.user!;

      await bookingService.cancel(
        req.params.id,
        user.sub,
        user.role,
        body.reason,
        body.cancelled_by
      );
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  /** PATCH /bookings/:id/complete */
  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, notes } = completeLessonSchema.parse(req.body);
      const user = req.user!;

      const booking = await bookingService.complete(
        req.params.id,
        user.sub,
        user.role,
        status,
        notes
      );
      res.json(booking);
    } catch (err) {
      next(err);
    }
  }
}
