import { type Context, Errors, type ServiceBroker } from 'moleculer';
import type { IncomingMessage, ServerResponse } from 'http';
import type { UserPayload, UserTokenPayload } from '@shared/schemas';

export function createAuthMiddleware(broker: ServiceBroker) {
  return async function authMiddleware(
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: Error) => void,
  ) {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ message: 'Missing or invalid Authorization header', code: 'UNAUTHORIZED' }),
      );
      return;
    }

    const token = authHeader.slice(7);
    try {
      const user = await broker.call<UserPayload, UserTokenPayload>('users.validateToken', {
        token,
      });
      (req as IncomingMessage & { $ctx?: Partial<Context> }).$ctx = { meta: { user } };
      next();
    } catch (err) {
      const status = err instanceof Errors.MoleculerClientError ? err.code : 500;
      const message = status === 500 ? 'Internal server error' : 'Invalid or expired token';
      const code = status === 500 ? 'INTERNAL_ERROR' : 'UNAUTHORIZED';
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message, code }));
    }
  };
}
