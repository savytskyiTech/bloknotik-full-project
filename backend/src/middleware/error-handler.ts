import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import pino from 'pino';

const logger = pino({ name: 'error-handler' });

/**
 * Global error handler middleware.
 * Converts all errors to the standard ApiError format from business_rules.md §7.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Custom AppError (ValidationError, ForbiddenError, etc.)
  if (err instanceof AppError) {
    res.status(err.status).json({
      status: err.status,
      code: err.code,
      message: err.message,
    });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join(', ');
    res.status(400).json({
      status: 400,
      code: 'VALIDATION_ERROR',
      message,
    });
    return;
  }

  // Prisma unique constraint violation (race condition protection)
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === 'P2002'
  ) {
    res.status(409).json({
      status: 409,
      code: 'CONFLICT',
      message: 'Слот вже зайнято',
    });
    return;
  }

  // Unknown errors
  logger.error(err, 'Unhandled error');
  res.status(500).json({
    status: 500,
    code: 'INTERNAL_ERROR',
    message: 'Внутрішня помилка сервера',
  });
}
