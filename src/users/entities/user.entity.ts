import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { Person } from 'src/persons/entities/person.entity';
import * as bcrypt from 'bcrypt';

export enum UserType {
  PERSON = 'PERSON',
  ORGANIZATION = 'ORGANIZATION',
}
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
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
  async normalize(): Promise<User> {
    const cryptoSalts = 10;
    this.password = await bcrypt.hash(this.password, cryptoSalts);
    return this;
  }
  async comparePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
