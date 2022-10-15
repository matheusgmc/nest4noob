import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
describe('AppController (e2e) - /user', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    const prisma = new PrismaService();

    await prisma.cleanup();
  });
  it('/ (POST) - create new user', () => {
    return request(app.getHttpServer())
      .post('/user')
      .send({
        email: 'test@test.com',
        name: 'test',
        password: 'senha123',
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect({
        email: 'test@test.com',
        name: 'test',
      });
  });

  it('/ (GET) - receive all users', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(200)
      .expect([
        {
          email: 'test@test.com',
          name: 'test',
        },
      ]);
  });
});
