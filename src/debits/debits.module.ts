import { Module } from '@nestjs/common';
import { DebitsService } from './debits.service';
import { DebitsController } from './debits.controller';

@Module({
  controllers: [DebitsController],
  providers: [DebitsService],
})
export class DebitsModule {}
