import { User } from 'src/users/entities/user.entity';

export class AuthenticationDto {
  user: User;
  token: string;
}
