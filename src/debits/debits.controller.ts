import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
  Get,
  HttpCode,
} from '@nestjs/common';
import { DebitsService } from './debits.service';
import { CreateDebitDto } from './dto/create-debit.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from 'src/decorators/userId.decorator';
import { UpdateDebitDto } from './dto/update-debit.dto';
import { AddPayerDto } from './dto/add-payer-dto';
import { SearchDebitsDto } from './dto/search-debits.dto';
import { EditPayerDto } from './dto/edit-payer-dto';

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

  @Get('/:debitId')
  @UseGuards(AuthGuard)
  async getDebit(@UserId() userId: string, @Param('debitId') debitId: string) {
    const debit = await this.debitsService.getDebit(userId, debitId);

    return { debit };
  }

  @Post('/show')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async list(@Body() search: SearchDebitsDto, @UserId() userId: string) {
    const offset = (search.page - 1) * search.limit;
    const debits = await this.debitsService.listByFilters(userId, {
      ...search,
      offset,
    });

    return { debits, page: search.page, limit: search.limit };
  }

  @Patch('/payers/:payerId')
  @UseGuards(AuthGuard)
  async editPayer(
    @Body() payer: EditPayerDto,
    @Param('payerId') payerId: string,
    @UserId() userId: string,
  ) {
    const result = await this.debitsService.editPayer(userId, payerId, payer);
    return result;
  }
}
