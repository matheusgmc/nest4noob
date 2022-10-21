import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../database/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService, AuthService],
})
export class UserModule {}
