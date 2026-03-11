import { type Context, Errors } from 'moleculer';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Meta, UserPayload, UserTokenPayload } from '@shared/schemas';

export type MoleculerRequest = IncomingMessage & { $ctx: Context<unknown, Meta> };

export function createAuthMiddleware() {
  return async function authMiddleware(
    req: MoleculerRequest,
    res: ServerResponse,
    next: (err?: Error) => void,
  ) {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          message: 'Missing or invalid Authorization header',
          code: 'UNAUTHORIZED',
        }),
      );
      return;
    }

    const token = authHeader.slice(7);
    try {
      const user = await req.$ctx!.call<UserPayload, UserTokenPayload>('users.validateToken', {
        token,
      });
      req.$ctx!.meta.user = user;
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
