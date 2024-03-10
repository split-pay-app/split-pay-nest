import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { TokenProcessor } from './queue/token.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    BullModule.registerQueue({
      name: 'token',
    }),
  ],
  controllers: [TokensController],
  providers: [TokenProcessor, TokensService],
})
export class TokensModule {}
