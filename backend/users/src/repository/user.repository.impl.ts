import { UserPayload, CredentialsDto } from '@shared/schemas';
import { UserRepository } from './user.repository.js';
import { DataSource } from 'typeorm';
import { User } from '../entity/User.js';

export class UserRepositoryImpl extends UserRepository {
  private readonly users;

  constructor(dataSource: DataSource) {
    super();
    this.users = dataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.findOneBy({ email });
  }

  async create({ email, password }: CredentialsDto): Promise<UserPayload> {
    const user = this.users.create({ email, password });
    await this.users.save(user);
    return { id: user.id, email: user.email };
  }
}
