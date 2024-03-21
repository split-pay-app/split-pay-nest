import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { VerifyTokenDto } from './dto/update-token.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class TokensService {
  constructor(
    @InjectQueue('token') private tokenQueue: Queue,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}
  async create(createTokenDto: CreateTokenDto) {
    await this.tokenQueue.add('generate_token', createTokenDto);
  }

  async verify(verifyTokenDto: VerifyTokenDto) {
    return !!(await this.tokenRepository.findOne({
      where: { entity: verifyTokenDto.entity, token: verifyTokenDto.token },
    }));
  }
}
