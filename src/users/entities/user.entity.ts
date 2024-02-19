import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
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

  constructor(createUserDto: CreateUserDto) {
    Object.assign(this, createUserDto);
  }
}
