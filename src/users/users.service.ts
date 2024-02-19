import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private saltsOrRounds: number;
  constructor(private config: ConfigService) {
    this.saltsOrRounds = Number(this.config.get('SALTS') || 10);
  }

  async generateUser({
    email,
    password,
    phoneNumber,
    taxpayerNumber,
    type,
  }: CreateUserDto): Promise<User> {
    const passwordHashed = await bcrypt.hash(password, this.saltsOrRounds);
    const user = new User({
      email,
      phoneNumber,
      taxpayerNumber,
      type,
      password: passwordHashed,
    });
    return user;
  }
}
