import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';

import { Repository } from 'typeorm';
import { Person } from './entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person) private personRepository: Repository<Person>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Person> {
    const person = await this.personRepository.save(createPersonDto);
    return person;
  }

  findAll() {
    return `This action returns all persons`;
  }
}
