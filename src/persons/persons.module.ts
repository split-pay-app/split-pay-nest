import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { User } from 'src/users/entities/user.entity';

import { UsersModule } from 'src/users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { EncrypterModule } from 'src/encrypter/encrypter.module';

@Module({
  imports: [
    EncrypterModule,
    TokensModule,
    TypeOrmModule.forFeature([Person, User]),
    UsersModule,
  ],
  controllers: [PersonsController],
  providers: [PersonsService],
})
export class PersonsModule {}
