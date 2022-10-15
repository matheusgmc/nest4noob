import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUsersDTO } from './dto/get-users.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsers(@Query() params: GetUsersDTO): Promise<UserEntity[]> {
    const { skip, take, search } = params;
    return this.userService.users({
      skip,
      take,
      where: search
        ? {
          OR: [
            {
              email: {
                contains: search,
              },
            },
            {
              name: {
                contains: search,
              },
            },
          ],
        }
        : {},
    });
  }

  @Get(':id')
  async getUser(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UserEntity> {
    return this.userService.user({
      id,
    });
  }

  @Post()
  async signUpUser(@Body() userData: CreateUserDTO): Promise<UserEntity> {
    return this.userService.createUser(userData);
  }

  @Put()
  async updateUser(@Body() updateData: UpdateUserDTO): Promise<UserEntity> {
    const { name, id } = updateData;
    return this.userService.updateUser({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }
}
