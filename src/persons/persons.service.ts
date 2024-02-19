import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';

import { DataSource } from 'typeorm';
import { Person } from './entities/person.entity';

import { User, UserType } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PersonsService {
  constructor(
    private dataSource: DataSource,
    private userService: UsersService,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    let person = null;
    let savedUser = null;
    const user = await this.userService.generateUser({
      ...createPersonDto,
      type: UserType.PERSON,
    });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      savedUser = await queryRunner.manager.save(User, user);
      person = await queryRunner.manager.save(Person, {
        ...createPersonDto,
        user: savedUser,
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        message: 'An error occured',
      });
    } finally {
      await queryRunner.release();
    }

    return { ...person, user: savedUser };
  }

  findAll() {
    return `This action returns all persons`;
  }
}
