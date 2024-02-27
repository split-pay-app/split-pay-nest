import { Module } from '@nestjs/common';
import { DebitsService } from './debits.service';
import { DebitsController } from './debits.controller';
import { EncrypterModule } from 'src/encrypter/encrypter.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debit } from './entities/debit.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Debit, User]), EncrypterModule],
  controllers: [DebitsController],
  providers: [DebitsService],
})
export class DebitsModule {}
