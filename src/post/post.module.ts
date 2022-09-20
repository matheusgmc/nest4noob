import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from 'src/user/user.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PrismaService, PostService, UserService]
})
export class PostModule { }
