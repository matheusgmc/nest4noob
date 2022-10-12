import { IsEmail, IsNotEmpty } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateUserDTO implements Prisma.UserCreateInput {
  @IsEmail() readonly email: string;
  @IsNotEmpty() readonly password: string;
  readonly name?: string | null | undefined;
}
