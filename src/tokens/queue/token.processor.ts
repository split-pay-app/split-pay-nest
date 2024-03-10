import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Token } from '../entities/token.entity';
import { Repository } from 'typeorm';
import { CreateTokenDto } from '../dto/create-token.dto';

@Processor('token')
export class TokenProcessor {
  private readonly logger = new Logger(TokenProcessor.name);
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  @Process('generate_token')
  async generateToken(job: Job<unknown>) {
    const { entity, type } = job.data as CreateTokenDto;
    const sixDigitToken = String(Math.floor(100000 + Math.random() * 900000));
    await this.tokenRepository.delete({ entity: entity });

    await this.tokenRepository.save({
      token: sixDigitToken,
      type,
      entity,
    });

    if (type === 'PHONE') {
      this.logger.log(
        `Bem vindo ao splitpay, seu codigo de verificação é: ${sixDigitToken}`,
      );
    } else {
      this.logger.log(
        JSON.stringify({
          from: 'splitpay@splitpay.com',
          to: entity,
          variables: { name: 'name', token: sixDigitToken },
        }),
      );
    }
  }
}
