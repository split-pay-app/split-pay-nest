import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentMadeRequestDto } from './dto/create-payment-made-request.dto';
import { Repository } from 'typeorm';
import { PaymentMadeRequest } from './entities/payment-made-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Debit } from 'src/debits/entities/debit.entity';
import { DebitPayer } from 'src/debits/entities/debitPayer.entity';

@Injectable()
export class PaymentMadeRequestService {
  constructor(
    @InjectRepository(PaymentMadeRequest)
    private paymentMadeRequestRepository: Repository<PaymentMadeRequest>,
    @InjectRepository(Debit)
    private debitRepository: Repository<Debit>,
    @InjectRepository(DebitPayer)
    private debitPayerRepository: Repository<DebitPayer>,
  ) {}
  async create(
    userId: string,
    createPaymentMadeRequestDto: CreatePaymentMadeRequestDto,
  ) {
    const debit = await this.debitRepository.findOne({
      where: { id: createPaymentMadeRequestDto.debitId },
      relations: { payers: { user: true } },
    });
    if (!debit) {
      throw new NotFoundException({ message: 'Debit not found' });
    }
    const isAPayer = debit?.payers.find((payer) => payer.user.id === userId);

    if (!isAPayer) {
      throw new BadRequestException({ message: 'You are not a debit payer' });
    }

    const alreadyRequested = await this.paymentMadeRequestRepository.findOne({
      where: { payer: { id: isAPayer.id } },
    });

    if (alreadyRequested) {
      throw new BadRequestException({ message: 'Already requested' });
    }
    return await this.paymentMadeRequestRepository.save({
      payer: isAPayer,
      status: 'PENDING',
    });
  }

  async replyPaymentMadeRequest({
    userId,
    requestId,
    answer,
  }: {
    userId: string;
    requestId: string;
    answer: string;
  }) {
    const isUserOwner = await this.debitRepository.findOne({
      where: { owner: { id: userId } },
    });

    if (!isUserOwner) {
      throw new UnauthorizedException({
        message: 'You are not the owner of the debit',
      });
    }

    const paymentMadeRequest = await this.paymentMadeRequestRepository.findOne({
      where: { id: requestId },
      relations: { payer: true },
    });

    if (!paymentMadeRequest) {
      throw new NotFoundException({ message: 'Request not exists' });
    }
    if (answer === 'accept') {
      await this.debitPayerRepository.update(
        {
          id: paymentMadeRequest.payer.id,
        },
        { paymentStatus: 'PAID' },
      );
      await this.paymentMadeRequestRepository.save({
        ...paymentMadeRequest,
        status: 'ACCEPTED',
      });
    }
    await this.paymentMadeRequestRepository.save({
      ...paymentMadeRequest,
      status: 'REJECTED',
    });
  }
}
