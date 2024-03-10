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
import { TokensService } from 'src/tokens/tokens.service';
import { ConfigService } from '@nestjs/config';

@Controller('persons')
export class PersonsController {
  constructor(
    private readonly personsService: PersonsService,
    private readonly userService: UsersService,
    private readonly tokenService: TokensService,
    private readonly config: ConfigService,
  ) {}
  async checkTokens(createPersonDto: CreatePersonDto) {
    const [emailToken, phoneToken] = await Promise.all([
      this.tokenService.verify({
        entity: createPersonDto.email,
        token: createPersonDto.emailToken,
      }),
      this.tokenService.verify({
        entity: createPersonDto.phoneNumber,
        token: createPersonDto.phoneToken,
      }),
    ]);
    if (
      (!emailToken || !phoneToken) &&
      this.config.get('NODE_ENV') !== 'development'
    ) {
      return false;
    }

    return true;
  }
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

    const checkedToken = await this.checkTokens(createPersonDto);

    if (!checkedToken) {
      throw new UnauthorizedException({
        message: 'Invalid email or phone token',
      });
    }
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
