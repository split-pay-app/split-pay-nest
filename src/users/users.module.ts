import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Person } from 'src/persons/entities/person.entity';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [TokensModule, TypeOrmModule.forFeature([Person, User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
