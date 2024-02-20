import { User } from 'src/users/entities/user.entity';

export class AuthenticationOutputDto {
  user: User;
  token: string;
}
