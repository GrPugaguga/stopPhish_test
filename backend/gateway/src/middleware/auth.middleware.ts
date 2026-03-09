import type { Context, ServiceBroker } from 'moleculer';
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
      res.end(JSON.stringify({ message: 'Missing or invalid Authorization header' }));
      return;
    }

    const token = authHeader.slice(7);
    try {
      const user = await broker.call<UserPayload, UserTokenPayload>('users.validateToken', {
        token,
      });
      (req as IncomingMessage & { $ctx?: Partial<Context> }).$ctx = { meta: { user } };
      next();
    } catch {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid or expired token' }));
    }
  };
}
