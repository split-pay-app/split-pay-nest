import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Debit } from './debit.entity';

@Entity('debit_payers')
export class DebitPayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.payers)
  user: User;

  @Column({ default: 1, type: 'float' })
  weight: number;

  @ManyToOne(() => Debit, (debit) => debit.payers)
  @JoinColumn()
  debit: Debit;

  @Column({ default: 'ACCEPTED' })
  paymentRequestStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';

  @Column({ default: 'WAITING' })
  paymentStatus: 'WAITING' | 'PAID' | 'UNPAID';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
