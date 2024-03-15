import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';

import { DataSource } from 'typeorm';
import { Person } from './entities/person.entity';

import { User, UserType } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UpdatePersonDto } from './dto/update-person.dto';

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

  async update(
    userId: string,
    createPersonDto: UpdatePersonDto,
  ): Promise<Person> {
    const user = await this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId }, relations: { person: true } });
    if (!user) {
      throw new ForbiddenException({
        message: 'Unauthorized to perform this operation',
      });
    }
    let person = null;
    let savedUser = null;
    const userParams = {
      id: userId,
      password: createPersonDto.password,
      taxpayerNumber: createPersonDto.taxpayerNumber,
    };
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      savedUser = await queryRunner.manager.save(User, userParams);
      person = await queryRunner.manager.save(Person, {
        ...createPersonDto,
        id: user.person.id,
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

  async getPerson(userId: string) {
    return this.dataSource
      .getRepository(User)
      .findOne({ where: { id: userId }, relations: { person: true } });
  }
}
