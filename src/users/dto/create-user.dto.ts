import { UserType } from '../entities/user.entity';

export class CreateUserDto {
  password: string;
  taxpayerNumber: string;
  email: string;
  type: UserType;
  phoneNumber: string;
}
