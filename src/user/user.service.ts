import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ValidationError } from 'class-validator';
import { transformAndValidate } from 'class-transformer-validator';

import { PrismaService } from '../database/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserEntity } from './entity/user.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  readonly validator = transformAndValidate;
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      ...params,
      select: {
        email: true,
        name: true,
      },
    });
  }

  async createUser(data: CreateUserDTO): Promise<UserEntity> {
    try {
      await this.validator(CreateUserDTO, data);
      const hashPassword = await this.auth.hashPassword(data.password);
      const newUser = await this.prisma.user.create({
        data: {
          ...data,
          password: hashPassword,
        },
      });
      return UserEntity.create(newUser);
    } catch (error: any) {
      const constraints = this.constraintsErrors(error);
      if (constraints.length > 0) {
        throw new BadRequestException({
          message: constraints,
        });
      }

      throw new InternalServerErrorException();
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserEntity> {
    const { where, data } = params;
    if (!(await this.user(where))) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'NotFound',
          message: 'user not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.prisma.user.update({ data, where });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserEntity> {
    return this.prisma.user.delete({ where });
  }

  private constraintsErrors(data: ValidationError[]): string[] {
    return data.map((elem) => Object.values(elem.constraints || {})).flat();
  }
}
