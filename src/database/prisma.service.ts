import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  //used only in tests
  async cleanup() {
    const deleteUser = this.user.deleteMany();
    const deletePost = this.post.deleteMany();

    await this.$transaction([deleteUser, deletePost]);
  }
}
