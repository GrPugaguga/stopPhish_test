import { Context, Service, ServiceBroker } from 'moleculer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '@shared/config';
import {
  credentialsSchema,
  validateTokenSchema,
  type CredentialsDto,
  type ValidateTokenDto,
} from '@shared/schemas';
import { UserRepository, UserRepositoryImpl } from './repository';
import AppDataSource from './data-source.js';
import { UserPayload, UserTokenPayload, createAction } from '@shared/schemas';

export default class UsersService extends Service {
  private repo!: UserRepository;

  constructor(broker: ServiceBroker) {
    super(broker);
    this.parseServiceSchema({
      name: 'users',
      created: this.onCreated,
      actions: {
        register: createAction<CredentialsDto, UserTokenPayload>(credentialsSchema, (ctx) =>
          this.register(ctx),
        ),
        login: createAction<CredentialsDto, UserTokenPayload>(credentialsSchema, (ctx) =>
          this.login(ctx),
        ),
        validateToken: createAction<ValidateTokenDto, UserPayload>(validateTokenSchema, (ctx) =>
          this.validateToken(ctx),
        ),
      },
    });
  }

  onCreated() {
    this.repo = new UserRepositoryImpl(AppDataSource);
  }

  async register(ctx: Context<CredentialsDto>): Promise<UserTokenPayload> {
    const { email, password } = ctx.params;

    const user = await this.repo.findByEmail(email);
    if (user) throw new Error('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await this.repo.create({ email, password: hashed });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, ENV.JWT_SECRET, {
      expiresIn: '7d',
    });
    return { token };
  }

  async login(ctx: Context<CredentialsDto>): Promise<UserTokenPayload> {
    const { email, password } = ctx.params;

    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id, email: user.email }, ENV.JWT_SECRET, {
      expiresIn: '7d',
    });
    return { token };
  }

  async validateToken(ctx: Context<ValidateTokenDto>): Promise<UserPayload> {
    const { token } = ctx.params;
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { id: number; email: string };
    return { id: payload.id, email: payload.email };
  }
}
