import { Injectable } from '@nestjs/common';
import { CreateDebitDto } from './dto/create-debit.dto';
import { Repository } from 'typeorm';
import { Debit } from './entities/debit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDebitDto } from './dto/update-debit.dto';

@Injectable()
export class DebitsService {
  constructor(
    @InjectRepository(Debit) private debitRepository: Repository<Debit>,
  ) {}
  async create(createDebitDto: CreateDebitDto) {
    const debit = this.debitRepository.create(createDebitDto);

    return this.debitRepository.save(debit);
  }

  async update(id: string, updateDebitDto: UpdateDebitDto) {
    const debit = this.debitRepository.create(updateDebitDto);

    return this.debitRepository.save({ id: id, ...debit });
  }
}
