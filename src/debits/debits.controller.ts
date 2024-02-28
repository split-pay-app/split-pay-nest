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
import { AddPayerDto } from './dto/add-payer-dto';

@Controller('debits')
export class DebitsController {
  constructor(private readonly debitsService: DebitsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createDebitDto: CreateDebitDto,
    @UserId() userId: string,
  ) {
    const debit = await this.debitsService.create({
      ...createDebitDto,
      owner: userId,
      status: 'OPEN',
    });
    return { debit };
  }
  @Patch('/:debitId')
  @UseGuards(AuthGuard)
  async update(
    @Body() updateDebitDto: UpdateDebitDto,
    @UserId() userId: string,
    @Param('debitId') debitId: string,
  ) {
    const debit = await this.debitsService.update(debitId, updateDebitDto);

    return { debit };
  }

  @Post('/:debitId/payers')
  @UseGuards(AuthGuard)
  async addPayer(
    @Body('payers') addPayerDto: AddPayerDto[],
    @UserId() userId: string,
    @Param('debitId') debitId: string,
  ) {
    const debit = await this.debitsService.addPayer(debitId, addPayerDto);

    return { debit };
  }
}
