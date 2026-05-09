import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        role: Role;
        name: string;
        assigned_instructor_id?: string;
      };
    }
  }
}

export {};
