import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebitDto } from './dto/create-debit.dto';
import { Repository } from 'typeorm';
import { Debit } from './entities/debit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDebitDto } from './dto/update-debit.dto';
import { AddPayerDto } from './dto/add-payer-dto';
import { DebitPayer } from './entities/debitPayer.entity';

@Injectable()
export class DebitsService {
  constructor(
    @InjectRepository(Debit) private debitRepository: Repository<Debit>,
    @InjectRepository(DebitPayer)
    private debitPayerRepository: Repository<DebitPayer>,
  ) {}
  async create(createDebitDto: CreateDebitDto) {
    const debit = this.debitRepository.create(createDebitDto);

    return this.debitRepository.save(debit);
  }

  async update(id: string, updateDebitDto: UpdateDebitDto) {
    const debitExists = await this.debitRepository.findOne({ where: { id } });
    if (!debitExists) {
      throw new NotFoundException({ message: 'Debit not exists' });
    }
    const debit = this.debitRepository.create({
      id,
      ...debitExists,
      ...updateDebitDto,
    });
    const result = await this.debitRepository.save(debit);
    return result;
  }

  async addPayer(id: string, payers: AddPayerDto[]) {
    const debitExists = await this.debitRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!debitExists) {
      throw new NotFoundException({ message: 'Debit not exists' });
    }
    const payersCreated = payers.map((payer) =>
      this.debitPayerRepository.create({
        ...payer,
        debit: debitExists,
        user: payer.userId,
      }),
    );
    await this.debitPayerRepository.save(payersCreated);
    return this.debitRepository.findOne({
      where: { id },
      relations: {
        payers: { user: { person: true } },
        owner: { person: true },
      },
    });
  }
}
