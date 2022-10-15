import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { RootController } from './root/root.controller';

@Module({
  imports: [UserModule, PostModule],
  controllers: [RootController],
})
export class AppModule { }
