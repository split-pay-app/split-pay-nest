import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DebitsModule } from './debits/debits.module';

import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { PersonsModule } from './persons/persons.module';
import { AuthModule } from './auth/auth.module';
import { PaymentMadeRequestModule } from './payment-made-request/payment-made-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    DebitsModule,
    PersonsModule,
    AuthModule,
    PaymentMadeRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
