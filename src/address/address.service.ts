import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { UpsertAddressDto } from './dto/upsert-address.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  async upsertAddress(address: UpsertAddressDto) {
    return (await this.addressRepository.upsert(address, ['id'])).raw;
  }
}
