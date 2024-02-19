import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { Person } from 'src/persons/entities/person.entity';
export enum UserType {
  PERSON = 'PERSON',
  ORGANIZATION = 'ORGANIZATION',
}
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  taxpayerNumber: string;

  @Column({ unique: true })
  email: string;

  @Column({ enum: UserType, default: UserType.PERSON })
  type: UserType;

  @Column()
  phoneNumber: string;

  @OneToOne(() => Person, (person) => person.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  person: Person;

  constructor(createUserDto: CreateUserDto) {
    Object.assign(this, createUserDto);
  }
}
