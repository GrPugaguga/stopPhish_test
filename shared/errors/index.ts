import { Errors } from 'moleculer';

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
