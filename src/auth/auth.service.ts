import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthenticationDto } from './dto/authenticationDto';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationOutputDto } from './dto/authenticationOutputDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(
    authenticationDto: AuthenticationDto,
  ): Promise<AuthenticationOutputDto> {
    const [user] = await this.userService.findBy([
      { taxpayerNumber: authenticationDto.uniqueKey },
      { email: authenticationDto.uniqueKey },
    ]);
    if (!user) {
      throw new UnauthorizedException({ message: 'Login or password invalid' });
    }

    const passwordCorrect = await user.comparePassword(
      authenticationDto.password,
    );

    if (!passwordCorrect) {
      throw new UnauthorizedException({ message: 'Login or password invalid' });
    }
    const token = await this.jwtService.signAsync({ userId: user.id });
    return {
      user: {
        id: user.id,
        firstName: user.person.firstName,
        lastName: user.person.lastName,
        email: user.email,
        taxpayerNumber: user.taxpayerNumber,
        phoneNumber: user.phoneNumber,
      },
      token,
    };
  }
}
