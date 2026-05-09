import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { authenticate } from './middleware/auth.middleware';
import { authorize } from './middleware/rbac.middleware';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { SlotController } from './controllers/slot.controller';
import { BookingController } from './controllers/booking.controller';
import { WaitlistController } from './controllers/waitlist.controller';
import { UserController } from './controllers/user.controller';

const app = express();

// ─── Global Middleware ────────────────────────────────

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// ─── Health Check ─────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Controller instances ─────────────────────────────

const auth = new AuthController();
const slots = new SlotController();
const bookings = new BookingController();
const waitlist = new WaitlistController();
const users = new UserController();

// ─── Auth Routes (§8 Auth) ────────────────────────────

const authRouter = express.Router();
authRouter.post('/login', (req, res, next) => auth.login(req, res, next));
authRouter.post('/refresh', (req, res, next) => auth.refresh(req, res, next));
authRouter.post('/logout', authenticate, (req, res, next) => auth.logout(req, res, next));
app.use('/auth', authRouter);

// ─── Slot Routes (§8 Slots) ──────────────────────────

const slotRouter = express.Router();
slotRouter.use(authenticate);
slotRouter.get('/', (req, res, next) => slots.getSlots(req, res, next));
slotRouter.post(
  '/',
  authorize('instructor', 'manager'),
  (req, res, next) => slots.create(req, res, next)
);
slotRouter.delete(
  '/:id',
  authorize('instructor', 'manager'),
  (req, res, next) => slots.delete(req, res, next)
);
app.use('/slots', slotRouter);

// ─── Booking Routes (§8 Bookings) ────────────────────

const bookingRouter = express.Router();
bookingRouter.use(authenticate);
bookingRouter.get('/', (req, res, next) => bookings.getBookings(req, res, next));
bookingRouter.get(
  '/availability',
  authorize('student'),
  (req, res, next) => bookings.getAvailability(req, res, next)
);
bookingRouter.post(
  '/',
  authorize('student', 'manager'),
  (req, res, next) => bookings.create(req, res, next)
);
bookingRouter.delete(
  '/:id',
  (req, res, next) => bookings.cancel(req, res, next)
);
bookingRouter.patch(
  '/:id/complete',
  authorize('instructor', 'manager'),
  (req, res, next) => bookings.complete(req, res, next)
);
app.use('/bookings', bookingRouter);

// ─── Waitlist Routes (§8 Waitlist) ───────────────────

const waitlistRouter = express.Router();
waitlistRouter.use(authenticate);
waitlistRouter.post(
  '/',
  authorize('student'),
  (req, res, next) => waitlist.add(req, res, next)
);
waitlistRouter.get(
  '/status',
  authorize('student'),
  (req, res, next) => waitlist.getStatus(req, res, next)
);
waitlistRouter.post(
  '/:id/confirm',
  authorize('student'),
  (req, res, next) => waitlist.confirm(req, res, next)
);
waitlistRouter.delete(
  '/:id',
  authorize('student', 'manager'),
  (req, res, next) => waitlist.remove(req, res, next)
);
app.use('/waitlist', waitlistRouter);

// ─── Student Routes (§8 Users) ──────────────────────

const studentRouter = express.Router();
studentRouter.use(authenticate);
studentRouter.get(
  '/',
  authorize('manager'),
  (req, res, next) => users.getAllStudents(req, res, next)
);
studentRouter.post(
  '/',
  authorize('manager'),
  (req, res, next) => users.createStudent(req, res, next)
);
studentRouter.get(
  '/:id',
  authorize('manager', 'instructor'),
  (req, res, next) => users.getStudent(req, res, next)
);
studentRouter.patch(
  '/:id',
  authorize('manager'),
  (req, res, next) => users.updateStudent(req, res, next)
);
studentRouter.get(
  '/:id/progress',
  (req, res, next) => users.getProgress(req, res, next)
);
studentRouter.get(
  '/:id/notes',
  (req, res, next) => users.getNotes(req, res, next)
);
app.use('/students', studentRouter);

// ─── Instructor Routes (§8 Users) ───────────────────

const instructorRouter = express.Router();
instructorRouter.use(authenticate);
instructorRouter.get(
  '/',
  authorize('manager'),
  (req, res, next) => users.getAllInstructors(req, res, next)
);
instructorRouter.post(
  '/',
  authorize('manager'),
  (req, res, next) => users.createInstructor(req, res, next)
);
instructorRouter.get(
  '/:id/students',
  authorize('instructor', 'manager'),
  (req, res, next) => users.getInstructorStudents(req, res, next)
);
app.use('/instructors', instructorRouter);

// ─── Global Error Handler (must be last) ─────────────

app.use(errorHandler);

export default app;
