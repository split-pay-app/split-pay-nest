import { Injectable } from '@nestjs/common';
import { CreateDebitDto } from './dto/create-debit.dto';
import { UpdateDebitDto } from './dto/update-debit.dto';

@Injectable()
export class DebitsService {
  create(createDebitDto: CreateDebitDto) {
    return 'This action adds a new debit';
  }

  findAll() {
    return `This action returns all debits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} debit`;
  }

  update(id: number, updateDebitDto: UpdateDebitDto) {
    return `This action updates a #${id} debit`;
  }

  remove(id: number) {
    return `This action removes a #${id} debit`;
  }
}
