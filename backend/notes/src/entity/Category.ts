import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Note } from './Note.js';

@Entity('categories')
@Index(['userId', 'name'], { unique: true })
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Index()
  @Column({ type: 'int' })
  userId!: number;

  @OneToMany(() => Note, (note) => note.category)
  notes!: Note[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
