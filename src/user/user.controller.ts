import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { User as UserModel } from "@prisma/client";
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUsersDTO } from './dto/get-users.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getUsers(
    @Query() params: GetUsersDTO
  ): Promise<UserModel[]> {
    const { skip, take, search } = params
    return this.userService.users({
      skip, take,
      where: search ? {
        OR: [
          {
            email: {
              contains: search
            },
          },
          {
            name: {
              contains: search
            }
          },
        ],
      } : {},
    });
  }

  @Get(":id")
  async getUser(@Param("id", new ParseIntPipe()) id: number): Promise<UserModel | null> {
    return this.userService.user({
      id
    })
  }

  @Post()
  async signUpUser(@Body() userData: CreateUserDTO): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
