import { databaseProviders } from './database.provider';
import { Module } from '@nestjs/common';
@Module({
  imports: [...databaseProviders],
  providers: [],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
