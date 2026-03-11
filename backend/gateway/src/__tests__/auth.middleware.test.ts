import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ServerResponse } from 'http';
import { createAuthMiddleware, type MoleculerRequest } from '../middleware';

const mockCtxCall = vi.fn();

const makeReq = (authHeader?: string) =>
  ({
    headers: { authorization: authHeader },
    $ctx: { call: mockCtxCall, meta: {} },
  }) as unknown as MoleculerRequest;

const makeRes = () => {
  const res = {
    writeHead: vi.fn(),
    end: vi.fn(),
  };
  return res as unknown as ServerResponse;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('auth middleware', () => {
  it('calls next() and attaches user when token is valid', async () => {
    mockCtxCall.mockResolvedValue({ id: 1, email: 'test@example.com' });
    const middleware = createAuthMiddleware();
    const req = makeReq('Bearer valid.token.here');
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(mockCtxCall).toHaveBeenCalledWith('users.validateToken', {
      token: 'valid.token.here',
    });
    expect(next).toHaveBeenCalledWith();
    expect(res.writeHead).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header is missing', async () => {
    const middleware = createAuthMiddleware();
    const req = makeReq();
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.writeHead).toHaveBeenCalledWith(401, expect.any(Object));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', async () => {
    mockCtxCall.mockRejectedValue(new Error('Invalid token'));
    const middleware = createAuthMiddleware();
    const req = makeReq('Bearer bad.token');
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.writeHead).toHaveBeenCalledWith(500, expect.any(Object));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for MoleculerClientError', async () => {
    const { Errors } = await import('moleculer');
    const err = new Errors.MoleculerClientError('Unauthorized', 401, 'UNAUTHORIZED');
    mockCtxCall.mockRejectedValue(err);
    const middleware = createAuthMiddleware();
    const req = makeReq('Bearer expired.token');
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.writeHead).toHaveBeenCalledWith(401, expect.any(Object));
    expect(next).not.toHaveBeenCalled();
  });
});
