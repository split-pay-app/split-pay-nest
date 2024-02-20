import { Module } from '@nestjs/common';
import { encrypterProviders } from './encrypter.provider';
@Module({
  imports: [...encrypterProviders],
  providers: [],
  exports: [...encrypterProviders],
})
export class EncrypterModule {}
