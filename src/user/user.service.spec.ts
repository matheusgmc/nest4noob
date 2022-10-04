import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';

const mockUser: User[] = [
  {
    email: "test@test.com",
    name: "test1",
    id: 1
  },
  {
    email: "example@example.com",
    name: "test2",
    id: 2
  }
]

describe("UserService", () => {
  let suit: UserService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(null).mockResolvedValueOnce(mockUser[0]),
              findMany: jest.fn().mockResolvedValue(mockUser),
              create: jest.fn().mockResolvedValue(
                {
                  email: "user@user.com",
                  name: "user test",
                  id: 3
                }
              ),
              update: jest.fn(),
              delete: jest.fn()
            }
          }
        }
      ]
    }).compile();

    suit = moduleRef.get<UserService>(UserService);

  });

  it("should be defined", () => {
    expect(suit).toBeDefined();
  });

  describe("users", () => {
    it("should return a list of all users", async () => {
      expect(await suit.users({})).toEqual(mockUser);
    });
  });

  describe("user", () => {
    it("should return a user by id", async () => {
      await expect(suit.user({
        id: 1
      })).resolves.toEqual(mockUser[0]);
    });

    it("should have an exception when the user is not found", async () => {
      await expect(suit.user({
        id: 10
      })).rejects.toThrowError("user not found");
    });
  });

  describe("create user", () => {
    it("should create a user with success", async () => {
      await expect(suit.createUser({
        email: "user@user.com",
        name: "user test"
      })).resolves.toEqual(
        {
          email: "user@user.com",
          name: "user test",
          id: 3
        }
      );
    });

    it("should return an exception in the absence of a param", async () => {
      await expect(suit.createUser({
        email: "",
        name: "user test"
      })).rejects.toThrowError("missing params");
    });

  });
});