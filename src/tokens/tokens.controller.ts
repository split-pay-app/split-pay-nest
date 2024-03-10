import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { VerifyTokenDto } from './dto/update-token.dto';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post()
  create(@Body() createTokenDto: CreateTokenDto) {
    if (!['PHONE', 'EMAIL'].includes(createTokenDto.type)) {
      throw new BadRequestException({ message: 'Invalid token type' });
    }
    return this.tokensService.create(createTokenDto);
  }

  @Post('verify')
  async verify(@Body() verifyTokenDto: VerifyTokenDto) {
    return { verified: await this.tokensService.verify(verifyTokenDto) };
  }
}
