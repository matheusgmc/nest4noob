import { User as UserModel } from '@prisma/client';
export class UserEntity implements Omit<UserModel, 'id' | 'password'> {
  readonly name: string | null;
  readonly email: string;
  constructor(name: string | null, email: string) {
    this.name = name;
    this.email = email;

    Object.freeze(this);
  }

  static create({ name, email }: UserModel) {
    return new UserEntity(name, email);
  }
}
