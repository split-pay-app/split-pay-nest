import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('sessions')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signIn() {}
}
