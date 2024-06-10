import { UserEntity } from 'src/users/entities/user.entity';

export class SearchEntity {
  constructor({ users, ...data }: Partial<SearchEntity>) {
    Object.assign(this, data);

    if (users) {
      this.users = users.map((user) => new UserEntity(user));
    }
  }

  users: UserEntity[];
}
