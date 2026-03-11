import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './Category.js';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Index()
  @Column({ type: 'int' })
  userId!: number;

  @Index()
  @Column({ type: 'int', nullable: true })
  categoryId!: number | null;

  @ManyToOne(() => Category, (category) => category.notes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category!: Category | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
