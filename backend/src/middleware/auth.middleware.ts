import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../utils/errors';
import { Role } from '@prisma/client';

interface JWTPayload {
  sub: string;
  role: Role;
  name: string;
  assigned_instructor_id?: string;
  iat: number;
  exp: number;
}

/**
 * JWT authentication middleware.
 * Extracts and verifies the Bearer token from the Authorization header.
 * Populates req.user with the decoded JWT payload.
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Токен автентифікації відсутній');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    req.user = {
      sub: decoded.sub,
      role: decoded.role,
      name: decoded.name,
      assigned_instructor_id: decoded.assigned_instructor_id,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Токен протух');
    }
    throw new UnauthorizedError('Невалідний токен');
  }
}
