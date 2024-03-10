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
import { AddressModule } from './address/address.module';
import { TokensModule } from './tokens/tokens.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    DebitsModule,
    PersonsModule,
    AuthModule,
    PaymentMadeRequestModule,
    AddressModule,
    TokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
