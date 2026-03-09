import { UserPayload, CredentialsDto } from '@shared/schemas';
import { User } from '../entity/User.js';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create({ email, password }: CredentialsDto): Promise<UserPayload>;
}
