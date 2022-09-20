import { IsEmail } from 'class-validator';
import { Prisma } from "@prisma/client";

export class CreateUserDTO implements Prisma.UserCreateInput {
  @IsEmail() readonly email: string;
  readonly name?: string | null | undefined;
}
