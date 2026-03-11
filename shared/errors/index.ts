import { Errors } from 'moleculer';

export class BadRequestError extends Errors.MoleculerClientError {
  constructor(message = 'Bad request', details?: Record<string, unknown>) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class ValidationError extends Errors.MoleculerClientError {
  constructor(message = 'Validation error', details?: Record<string, unknown>) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends Errors.MoleculerClientError {
  constructor(message = 'Not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends Errors.MoleculerClientError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ConflictError extends Errors.MoleculerClientError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}
