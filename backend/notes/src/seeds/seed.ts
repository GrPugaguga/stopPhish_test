import 'reflect-metadata';
import AppDataSource from '../data-source.js';
import { Category } from '../entity/Category.js';
import { Note } from '../entity/Note.js';

await AppDataSource.initialize();

const categoryRepo = AppDataSource.getRepository(Category);
const noteRepo = AppDataSource.getRepository(Note);

const userId = 1;

const work = categoryRepo.create({ name: 'Work', userId });
const personal = categoryRepo.create({ name: 'Personal', userId });
await categoryRepo.save([work, personal]);

await noteRepo.save([
  noteRepo.create({
    title: 'Project plan',
    content: 'Define milestones...',
    userId,
    categoryId: work.id,
  }),
  noteRepo.create({
    title: 'Meeting notes',
    content: 'Discussed roadmap...',
    userId,
    categoryId: work.id,
  }),
  noteRepo.create({
    title: 'Ideas',
    content: 'Side project ideas...',
    userId,
    categoryId: personal.id,
  }),
]);

console.log('Notes seed complete');
await AppDataSource.destroy();
