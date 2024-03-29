import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebitDto } from './dto/create-debit.dto';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Debit } from './entities/debit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDebitDto } from './dto/update-debit.dto';
import { AddPayerDto } from './dto/add-payer-dto';
import { DebitPayer } from './entities/debitPayer.entity';
import { SearchDebitsDto } from './dto/search-debits.dto';
import { EditPayerDto } from './dto/edit-payer-dto';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class DebitsService {
  constructor(
    @InjectRepository(Debit) private debitRepository: Repository<Debit>,
    @InjectRepository(DebitPayer)
    private debitPayerRepository: Repository<DebitPayer>,
    private addressService: AddressService,
  ) {}

  async toReceive(userId: string) {
    const result = await this.debitPayerRepository.find({
      where: {
        debit: { owner: { id: userId } },
        paymentStatus: 'WAITING',
      },
      relations: { debit: { payers: { user: true } }, user: true },
    });

    const toReceive = result.reduce(
      (acc, payer) =>
        acc + this.calculateShouldPay(payer.user.id, payer.debit).shouldPay,
      0,
    );

    return toReceive;
  }
  async create(createDebitDto: CreateDebitDto) {
    const [address] =
      (createDebitDto.address &&
        (await this.addressService.upsertAddress(createDebitDto.address))) ||
      [];

    const debit = this.debitRepository.create(createDebitDto);
    debit.address = address?.id;

    const debitSaved = await this.debitRepository.save(debit);

    return debitSaved;
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

  async getDebit(userId: string, debitId: string) {
    const debit = await this.debitRepository.findOne({
      where: [
        { id: debitId, payers: { user: { id: userId } } },
        { id: debitId, owner: { id: userId } },
      ],
      relations: {
        payers: { user: { person: true } },
        owner: { person: true },
        address: true,
      },
    });
    if (!debit) {
      throw new NotFoundException({ message: 'Debit not found' });
    }
    return this.calculateShouldPay(userId, debit);
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

  private calculateShouldPay(userId: string, debit: Debit) {
    const userPayer = debit.payers.find((payer) => payer.user.id === userId);

    return {
      ...debit,
      shouldPay: Number(
        (
          (debit.totalValue / (debit.payers.length || 1)) *
          (userPayer?.weight || 0)
        ).toFixed(2),
      ),
      isOwner: debit.owner?.id === userId,
      paid: userPayer?.paymentStatus === 'PAID',
    };
  }
  async listByFilters(userId: string, search: SearchDebitsDto) {
    const dateFilter = this.resolveDateFilter(search);

    const statusFilter = { status: search.status?.toUpperCase() };

    const roles = {
      owner: { owner: { id: userId } },
      payer: { payers: { id: userId } },
      all: [{ owner: { id: userId } }, { payers: { user: { id: userId } } }],
    };

    const choosedRole = roles[search.role];

    const filter =
      search.role === 'all' || !search.role || choosedRole
        ? [
            { ...roles.all[0], ...dateFilter, ...statusFilter },
            { ...roles.all[1], ...dateFilter, ...statusFilter },
          ]
        : { ...dateFilter, ...choosedRole, ...statusFilter };

    const debits = await this.debitRepository.find({
      where: filter,
      relations: {
        owner: { person: true },
        payers: { user: { person: true } },
      },
      skip: search.offset,
      take: search.limit,
    });

    return debits.map((debit) => this.calculateShouldPay(userId, debit));
  }

  async editPayer(userId: string, payerId: string, payer: EditPayerDto) {
    const payerFound = await this.debitPayerRepository.findOne({
      where: { id: payerId, debit: { owner: { id: userId } } },
      relations: { debit: { owner: true } },
    });
    if (!payerFound) {
      throw new NotFoundException({ message: 'Payer not found' });
    }

    return await this.debitPayerRepository.save({ id: payerId, ...payer });
  }

  async getAllDebitors(userId: string, limit: number, offset: number) {
    const result = await this.debitPayerRepository.find({
      where: {
        debit: { owner: { id: userId } },
        paymentStatus: 'WAITING',
      },
      relations: { debit: { payers: { user: true } }, user: true },
      skip: offset,
      take: limit,
    });

    const toReceive = result.map((payer) => ({
      ...payer,
      shouldPay: this.calculateShouldPay(payer.user.id, payer.debit).shouldPay,
    }));

    return toReceive;
  }
}
