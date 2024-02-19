import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DebitsService } from './debits.service';
import { CreateDebitDto } from './dto/create-debit.dto';
import { UpdateDebitDto } from './dto/update-debit.dto';

@Controller('debits')
export class DebitsController {
  constructor(private readonly debitsService: DebitsService) {}

  @Post()
  create(@Body() createDebitDto: CreateDebitDto) {
    return this.debitsService.create(createDebitDto);
  }

  @Get()
  findAll() {
    return this.debitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debitsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebitDto: UpdateDebitDto) {
    return this.debitsService.update(+id, updateDebitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debitsService.remove(+id);
  }
}
