import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CreateDebitDto } from '../dto/create-debit.dto';

@Entity('debits')
export class Debit {
  constructor(data: CreateDebitDto) {
    Object.assign(this, data);
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  date: Date;

  @Column()
  description: string;

  @Column({ nullable: false })
  category: string;

  @Column()
  image: string;

  @Column({ nullable: false, type: 'float' })
  totalValue: number;

  @ManyToOne(() => User, (user) => user.debits, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: false })
  status: string;
}
