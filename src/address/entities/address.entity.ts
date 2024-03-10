import { Debit } from 'src/debits/entities/debit.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('address')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  number: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  complement: string;

  @Column({ nullable: true })
  referencePoint: string;

  @Column({ nullable: true })
  neighborhood: string;

  @Column({ nullable: true })
  country: string;

  @OneToOne(() => Debit, (debit) => debit.address)
  debit: Debit;
}
