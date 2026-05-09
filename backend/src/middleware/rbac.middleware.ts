import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

/**
 * RBAC middleware factory.
 * Returns middleware that checks if the authenticated user has one of the allowed roles.
 * 
 * Usage:
 *   router.post('/slots', authenticate, authorize('instructor', 'manager'), controller);
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Необхідна автентифікація');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Доступ заборонено. Потрібна роль: ${allowedRoles.join(' або ')}`
      );
    }

    next();
  };
}
