import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { ServiceBroker } from 'moleculer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '@shared/config';

vi.mock('../data-source.js', () => ({
  default: {
    getRepository: vi.fn(),
  },
}));

import AppDataSource from '../data-source.js';
import UsersService from '../users.service.js';

const mockRepo = {
  findOneBy: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
};

let broker: ServiceBroker;

beforeAll(async () => {
  vi.mocked(AppDataSource.getRepository).mockReturnValue(mockRepo as never);
  broker = new ServiceBroker({ logger: false });
  broker.createService(UsersService);
  await broker.start();
});

afterAll(() => broker.stop());

describe('users.register', () => {
  it('creates user and returns token', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    mockRepo.create.mockReturnValue({ id: 1, email: 'test@example.com' });
    mockRepo.save.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const result = (await broker.call('users.register', {
      email: 'test@example.com',
      password: 'password123',
    })) as { token: string };

    expect(result).toHaveProperty('token');
    expect(typeof result.token).toBe('string');
  });

  it('throws if email already registered', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, email: 'test@example.com' });

    await expect(
      broker.call('users.register', { email: 'test@example.com', password: 'password123' }),
    ).rejects.toThrow('Email already registered');
  });
});

describe('users.login', () => {
  it('returns token for valid credentials', async () => {
    const hashed = await bcrypt.hash('password123', 10);
    mockRepo.findOneBy.mockResolvedValue({ id: 1, email: 'test@example.com', password: hashed });

    const result = (await broker.call('users.login', {
      email: 'test@example.com',
      password: 'password123',
    })) as { token: string };

    expect(result).toHaveProperty('token');
  });

  it('throws for invalid password', async () => {
    const hashed = await bcrypt.hash('correct', 10);
    mockRepo.findOneBy.mockResolvedValue({ id: 1, email: 'test@example.com', password: hashed });

    await expect(
      broker.call('users.login', { email: 'test@example.com', password: 'wrongpassword' }),
    ).rejects.toThrow('Invalid credentials');
  });
});

describe('users.validateToken', () => {
  it('returns payload for valid token', async () => {
    const token = jwt.sign({ id: 1, email: 'test@example.com' }, ENV.JWT_SECRET);

    const result = (await broker.call('users.validateToken', { token })) as {
      id: number;
      email: string;
    };

    expect(result.id).toBe(1);
    expect(result.email).toBe('test@example.com');
  });

  it('throws for invalid token', async () => {
    await expect(broker.call('users.validateToken', { token: 'bad.token.here' })).rejects.toThrow();
  });
});
