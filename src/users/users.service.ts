import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import { User } from './entities/user.entity';

import { ConfigService } from '@nestjs/config';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class UsersService {
  private saltsOrRounds: number;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private config: ConfigService,
    private tokenService: TokensService,
  ) {
    this.saltsOrRounds = Number(this.config.get('SALTS') || 10);
  }
  async forgotPassword(email: string) {
    await this.tokenService.create({ type: 'EMAIL', entity: email });
  }
  async findUsers({
    term,
    offset,
    limit,
  }: {
    term: string;
    offset: number;
    limit: number;
  }) {
    const conditions = [
      { taxpayerNumber: term },
      { phoneNumber: term },
      { email: term },
      { person: { firstName: Like(`%${term}%`) } },
      { person: { lastName: Like(`%${term}%`) } },
      { person: { lastName: Like(`%${term}%`) } },
    ];
    return this.userRepository.find({
      where: conditions,
      relations: { person: true },
      take: limit,
      skip: offset,
    });
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
    const filters = data.map(this.generateFilters);
    return this.userRepository.find({
      where: filters,
      select: {
        id: true,
        password: true,
        email: true,
        phoneNumber: true,
        taxpayerNumber: true,
        type: true,
      },
      take: options?.limit,
      skip: options?.offset,
      relations: { person: true },
    });
  }
}
