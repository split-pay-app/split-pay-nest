import { DebitPayer } from 'src/debits/entities/debitPayer.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_made_request')
export class PaymentMadeRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DebitPayer)
  @JoinColumn()
  payer: DebitPayer;

  @Column({ default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
