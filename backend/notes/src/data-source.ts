import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ENV } from '@shared/config';
import { Note } from './entity/Note.js';
import { Category } from './entity/Category.js';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.NOTES_DB_HOST,
  port: ENV.NOTES_DB_PORT,
  username: ENV.NOTES_DB_USER,
  password: ENV.NOTES_DB_PASSWORD,
  database: ENV.NOTES_DB_NAME,
  entities: [Note, Category],
  migrations: ['backend/notes/src/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
