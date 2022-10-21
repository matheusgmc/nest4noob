import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../database/prisma.service';
import { UserService } from '../user/user.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PrismaService, PostService, UserService, AuthService],
})
export class PostModule {}
