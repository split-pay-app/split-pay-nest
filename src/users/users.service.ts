import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';

import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  private saltsOrRounds: number;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private config: ConfigService,
  ) {
    this.saltsOrRounds = Number(this.config.get('SALTS') || 10);
  }

  async generateUser({
    email,
    password,
    phoneNumber,
    taxpayerNumber,
    type,
  }: CreateUserDto): Promise<User> {
    const user = new User({
      email,
      phoneNumber,
      taxpayerNumber,
      type,
      password,
    });
    return await user.normalize();
  }
  private generateFilters(data: Record<string, any>) {
    return Object.keys(data).reduce((acc, value) => {
      if (data[value] !== undefined) return { ...acc, [value]: data[value] };
      return { ...acc };
    }, {});
  }
  findBy(
    data: Record<string, any>[],
    options?: { limit?: number; offset?: number },
  ): Promise<User[]> {
    const filters = this.generateFilters(data);
    return this.userRepository.find({
      where: filters,
      take: options?.limit,
      skip: options?.offset,
    });
  }
}
