import bcrypt from 'bcryptjs';
import AppDataSource from '../data-source.js';
import { User } from '../entity/User.js';

const users = [
  { email: 'test@example.com', password: 'password123' },
  { email: 'admin@example.com', password: 'admin123' },
];

await AppDataSource.initialize();
const repo = AppDataSource.getRepository(User);

for (const u of users) {
  const exists = await repo.findOneBy({ email: u.email });
  if (!exists) {
    const hashed = await bcrypt.hash(u.password, 10);
    await repo.save(repo.create({ email: u.email, password: hashed }));
    console.log(`Created user: ${u.email}`);
  } else {
    console.log(`Skipped (exists): ${u.email}`);
  }
}

await AppDataSource.destroy();
