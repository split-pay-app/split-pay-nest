import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUsersDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('search')
  async findUsers(@Body() data: FindUsersDto) {
    const page = data.page || 1;
    const limit = data.limit || 10;
    const offset = (page - 1) * limit;
    const users = await this.usersService.findUsers({ ...data, offset, limit });

    return { users, page, limit };
  }
}
