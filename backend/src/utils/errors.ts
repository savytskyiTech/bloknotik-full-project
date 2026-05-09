/**
 * Custom error classes for the API.
 * Maps to the error format from business_rules.md §7.
 */

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/** 400 — Невалідні вхідні дані */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'VALIDATION_ERROR', message);
  }
}

/** 401 — Відсутній або протухший JWT */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Необхідна автентифікація') {
    super(401, 'UNAUTHORIZED', message);
  }
}

/** 403 — Немає прав (RBAC) */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Немає прав доступу') {
    super(403, 'FORBIDDEN', message);
  }
}

/** 404 — Ресурс не знайдено */
export class NotFoundError extends AppError {
  constructor(message: string = 'Ресурс не знайдено') {
    super(404, 'NOT_FOUND', message);
  }
}

/** 409 — Race condition (слот вже зайнято) */
export class ConflictError extends AppError {
  constructor(message: string = 'Конфлікт даних') {
    super(409, 'CONFLICT', message);
  }
}

/** 410 — Read-only слот (час минув) */
export class GoneError extends AppError {
  constructor(message: string = 'Ресурс більше не доступний') {
    super(410, 'GONE', message);
  }
}
