import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private saltsOrRounds: number;
  constructor(
    @Inject(ConfigService)
    config: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.saltsOrRounds = Number(config.get('SALTS') || 10);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await bcrypt.hash(
      createUserDto.password,
      this.saltsOrRounds,
    );

    const user = new User({ ...createUserDto, password });
    return this.userRepository.save(user);
  }
}
