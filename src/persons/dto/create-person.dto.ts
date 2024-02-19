import { User } from 'src/users/entities/user.entity';

export class CreatePersonDto {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  taxpayerNumber: string;
  phoneNumber: string;
  emailToken: string;
  phoneToken: string;
  birthDate: Date;
  address?: {
    number: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  user: User;
}
