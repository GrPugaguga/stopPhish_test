import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'http';
import { createAuthMiddleware } from '../middleware';

const mockBroker = {
  call: vi.fn(),
};

const makeReq = (authHeader?: string) =>
  ({ headers: { authorization: authHeader } }) as unknown as IncomingMessage;

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
    mockBroker.call.mockResolvedValue({ id: 1, email: 'test@example.com' });
    const middleware = createAuthMiddleware(mockBroker as never);
    const req = makeReq('Bearer valid.token.here');
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(mockBroker.call).toHaveBeenCalledWith('users.validateToken', {
      token: 'valid.token.here',
    });
    expect(next).toHaveBeenCalledWith();
    expect(res.writeHead).not.toHaveBeenCalled();
  });

  it('returns 401 when Authorization header is missing', async () => {
    const middleware = createAuthMiddleware(mockBroker as never);
    const req = makeReq();
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.writeHead).toHaveBeenCalledWith(401, expect.any(Object));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', async () => {
    mockBroker.call.mockRejectedValue(new Error('Invalid token'));
    const middleware = createAuthMiddleware(mockBroker as never);
    const req = makeReq('Bearer bad.token');
    const res = makeRes();
    const next = vi.fn();

    await middleware(req, res, next);

    expect(res.writeHead).toHaveBeenCalledWith(401, expect.any(Object));
    expect(next).not.toHaveBeenCalled();
  });
});
