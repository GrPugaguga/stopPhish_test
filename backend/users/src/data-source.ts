import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ENV } from '@shared/config';
import { User } from './entity/User.js';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.USERS_DB_HOST,
  port: ENV.USERS_DB_PORT,
  username: ENV.USERS_DB_USER,
  password: ENV.USERS_DB_PASSWORD,
  database: ENV.USERS_DB_NAME,
  entities: [User],
  migrations: ['backend/users/src/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
