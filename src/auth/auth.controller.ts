import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationDto } from './dto/authenticationDto';
import { AuthenticationOutputDto } from './dto/authenticationOutputDto';

@Controller('sessions')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  async signIn(
    @Body() authenticationDto: AuthenticationDto,
  ): Promise<AuthenticationOutputDto> {
    return this.authService.authenticate(authenticationDto);
  }
}
