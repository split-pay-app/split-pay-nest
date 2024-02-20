import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UsersService } from 'src/users/users.service';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('persons')
export class PersonsController {
  constructor(
    private readonly personsService: PersonsService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  async create(@Body() createPersonDto: CreatePersonDto) {
    const [userExists] = await this.userService.findBy(
      [
        {
          email: createPersonDto.email,
        },
        {
          taxpayerNumber: createPersonDto.taxpayerNumber,
        },
      ],
      { limit: 1, offset: 0 },
    );

    if (userExists) {
      throw new UnauthorizedException({ message: 'User already exists' });
    }
    const person = this.personsService.create(createPersonDto);
    return person;
  }

  @Patch()
  async update(@Body() updatePersonDto: UpdatePersonDto) {
    const person = await this.personsService.update(updatePersonDto);
    return person;
  }
}
