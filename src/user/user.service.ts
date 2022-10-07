import { HttpException, HttpStatus, Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { User, Prisma } from "@prisma/client";
import { ValidationError } from 'class-validator';
import { transformAndValidate } from "class-transformer-validator";

import { PrismaService } from '../database/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  readonly validator = transformAndValidate;
  constructor(private prisma: PrismaService) { }

  async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput
    });

    if (!user) {
      throw new NotFoundException("user not found");
    }
    return user
  }

  async users(params: {
    skip?: number,
    take?: number,
    cursor?: Prisma.UserWhereUniqueInput,
    where?: Prisma.UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    return this.prisma.user.findMany(params);
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    try {
      await this.validator(CreateUserDTO, data);
      return this.prisma.user.create({ data });
    } catch (error: any) {
      const constraints = this.constraintsErrors(error)
      if (constraints.length > 0) {
        throw new BadRequestException({
          message: constraints
        })
      }

      throw new InternalServerErrorException();
    }
  }

  async updateUser(params: { where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput }): Promise<User> {
    const { where, data } = params;
    if (!await this.user(where)) {
      throw new HttpException({
        statusCode: HttpStatus.NOT_FOUND,
        error: "NotFound",
        message: "user not found"
      }, HttpStatus.NOT_FOUND)
    }
    return this.prisma.user.update({ data, where });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }

  private constraintsErrors(data: ValidationError[]): string[] {
    return data.map(elem => Object.values(elem.constraints || {})).flat();
  }
}









