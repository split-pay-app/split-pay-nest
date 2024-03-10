import { UpsertAddressDto } from 'src/address/dto/upsert-address.dto';

export class CreateDebitDto {
  title: string;
  date: Date;
  description: string;
  category: string;
  image: string;
  totalValue: number;
  status: string;
  owner: string;
  address: UpsertAddressDto;
}
