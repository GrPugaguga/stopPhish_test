import { Service, ServiceBroker } from 'moleculer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '@shared/config';
import {
  credentialsSchema,
  validateTokenSchema,
  type CredentialsDto,
  type ValidateTokenDto,
} from '@shared/schemas';
import AppDataSource from './data-source.js';
import { User } from './entity/User.js';

export default class UsersService extends Service {
  constructor(broker: ServiceBroker) {
    super(broker);
    this.parseServiceSchema({
      name: 'users',
      actions: {
        register: { handler: this.register },
        login: { handler: this.login },
        validateToken: { handler: this.validateToken },
      },
    });
  }

  async register(ctx: { params: CredentialsDto }) {
    const { email, password } = credentialsSchema.parse(ctx.params);

    const repo = AppDataSource.getRepository(User);
    const existing = await repo.findOneBy({ email });
    if (existing) throw new Error('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const user = repo.create({ email, password: hashed });
    await repo.save(user);

    const token = jwt.sign({ id: user.id, email: user.email }, ENV.JWT_SECRET, {
      expiresIn: '7d',
    });
    return { token };
  }

  async login(ctx: { params: CredentialsDto }) {
    const { email, password } = credentialsSchema.parse(ctx.params);

    const repo = AppDataSource.getRepository(User);
    const user = await repo.findOneBy({ email });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id, email: user.email }, ENV.JWT_SECRET, {
      expiresIn: '7d',
    });
    return { token };
  }

  async validateToken(ctx: { params: ValidateTokenDto }) {
    const { token } = validateTokenSchema.parse(ctx.params);
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { id: number; email: string };
    return { id: payload.id, email: payload.email };
  }
}
