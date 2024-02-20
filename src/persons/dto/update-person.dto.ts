import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDto } from './create-person.dto';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {
  firstName: string;
  lastName: string;
  password: string;
  taxpayerNumber: string;
  birthDate: Date;
}
