import { describe, it, expect, vi } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'http';
import { onError } from '../gateway.service';

function makeRes() {
  return {
    statusCode: 0,
    setHeader: vi.fn(),
    end: vi.fn(),
  } as unknown as ServerResponse;
}

const req = {} as IncomingMessage;

describe('gateway onError', () => {
  it('sets status from numeric err.code', () => {
    const res = makeRes();
    onError(req, res, { code: 404, message: 'Not found', type: 'NOT_FOUND' });

    expect(res.statusCode).toBe(404);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    const body = JSON.parse((res.end as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(body.message).toBe('Not found');
    expect(body.code).toBe('NOT_FOUND');
  });

  it('sets 409 for ConflictError', () => {
    const res = makeRes();
    onError(req, res, { code: 409, message: 'Conflict', type: 'CONFLICT' });

    expect(res.statusCode).toBe(409);
  });

  it('falls back to 500 when err.code is missing', () => {
    const res = makeRes();
    onError(req, res, { message: 'Something broke' });

    expect(res.statusCode).toBe(500);
    const body = JSON.parse((res.end as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(body.message).toBe('Something broke');
    expect(body.code).toBe('UNKNOWN_ERROR');
  });

  it('falls back to 500 when err.code is a string (e.g. "23505")', () => {
    const res = makeRes();
    onError(req, res, { code: '23505', message: 'duplicate key' });

    expect(res.statusCode).toBe(500);
  });
});
