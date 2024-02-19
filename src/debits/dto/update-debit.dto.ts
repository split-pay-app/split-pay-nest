import { PartialType } from '@nestjs/mapped-types';
import { CreateDebitDto } from './create-debit.dto';

export class UpdateDebitDto extends PartialType(CreateDebitDto) {}
