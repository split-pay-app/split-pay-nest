import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';

import { EncrypterModule } from 'src/encrypter/encrypter.module';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [EncrypterModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
