import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebitDto } from './dto/create-debit.dto';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Debit } from './entities/debit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDebitDto } from './dto/update-debit.dto';
import { AddPayerDto } from './dto/add-payer-dto';
import { DebitPayer } from './entities/debitPayer.entity';
import { SearchDebitsDto } from './dto/search-debits.dto';

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

  private resolveDateFilter({
    fromDate,
    toDate,
  }: {
    fromDate: Date;
    toDate: Date;
  }) {
    if (fromDate && toDate) {
      return { date: Between(fromDate, toDate) };
    }
    if (fromDate) {
      return { date: MoreThanOrEqual(fromDate) };
    }
    if (toDate) {
      return { date: LessThanOrEqual(toDate) };
    }
    return {};
  }
  async listByFilters(userId: string, search: SearchDebitsDto) {
    const roles = {
      owner: { owner: { id: userId } },
      payer: { payers: { id: userId } },
    };

    const choosedRole = roles[search.role ?? 'all'] ?? {};
    const dateFilter = this.resolveDateFilter(search);

    const statusFilter = { status: search.status?.toUpperCase() };
    return await this.debitRepository.find({
      where: { ...dateFilter, ...choosedRole, ...statusFilter },
      relations: {
        owner: { person: true },
        payers: { user: { person: true } },
      },
      skip: search.offset,
      take: search.limit,
    });
  }
}
