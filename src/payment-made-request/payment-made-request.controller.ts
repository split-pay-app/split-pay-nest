import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  HttpCode,
} from '@nestjs/common';
import { PaymentMadeRequestService } from './payment-made-request.service';
import { CreatePaymentMadeRequestDto } from './dto/create-payment-made-request.dto';
import { UserId } from 'src/decorators/userId.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('paymentMade')
export class PaymentMadeRequestController {
  constructor(
    private readonly paymentMadeRequestService: PaymentMadeRequestService,
  ) {}

  @Post('request')
  @UseGuards(AuthGuard)
  async create(
    @Body() createPaymentMadeRequestDto: CreatePaymentMadeRequestDto,
    @UserId() userId: string,
  ) {
    const result = await this.paymentMadeRequestService.create(
      userId,
      createPaymentMadeRequestDto,
    );
    return { request: result };
  }

  @Post('/reply/:requestId/:answer')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async reply(
    @Param('requestId')
    requestId: string,
    @Param('answer')
    answer: string,
    @UserId() userId: string,
  ) {
    const result = await this.paymentMadeRequestService.replyPaymentMadeRequest(
      { userId, requestId, answer },
    );
    return { request: result };
  }
}
