import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { DebitsService } from './debits.service';
import { CreateDebitDto } from './dto/create-debit.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from 'src/decorators/userId.decorator';
import { UpdateDebitDto } from './dto/update-debit.dto';

@Controller('debits')
export class DebitsController {
  constructor(private readonly debitsService: DebitsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createDebitDto: CreateDebitDto, @UserId() userId: string) {
    return this.debitsService.create({
      ...createDebitDto,
      owner: userId,
      status: 'OPEN',
    });
  }
  @Patch('/:debitId')
  @UseGuards(AuthGuard)
  update(
    @Body() updateDebitDto: UpdateDebitDto,
    @UserId() userId: string,
    @Param('debitId') debitId: string,
  ) {
    return this.debitsService.update(debitId, updateDebitDto);
  }
}
