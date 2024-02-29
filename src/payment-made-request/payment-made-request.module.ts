import { Module } from '@nestjs/common';
import { PaymentMadeRequestService } from './payment-made-request.service';
import { PaymentMadeRequestController } from './payment-made-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMadeRequest } from './entities/payment-made-request.entity';
import { Debit } from 'src/debits/entities/debit.entity';
import { JwtModule } from '@nestjs/jwt';
import { DebitPayer } from 'src/debits/entities/debitPayer.entity';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([PaymentMadeRequest, Debit, DebitPayer]),
  ],
  controllers: [PaymentMadeRequestController],
  providers: [PaymentMadeRequestService],
})
export class PaymentMadeRequestModule {}
