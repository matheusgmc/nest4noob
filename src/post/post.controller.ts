import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
import { UserService } from '../user/user.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private userService: UserService,
  ) { }

  @Get('feed/')
  async getPublishedPosts(
    @Query('search') search: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        published: true,
        OR: [
          {
            title: { contains: search },
          },
          {
            content: { contains: search },
          },
        ],
      },
    });
  }

  @Get(':id')
  async getPostById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<PostModel | null> {
    return this.postService.post({
      id: Number(id),
    });
  }

  @Post()
  async createDraft(@Body() postData: CreatePostDTO): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    if (
      await this.userService.users({
        where: {
          email: authorEmail,
        },
      })
    ) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'user not found',
          error: 'NotFound',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: {
          email: authorEmail,
        },
      },
    });
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: {
        id: Number(id),
      },
      data: {
        published: true,
      },
    });
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({
      id: Number(id),
    });
  }
}
