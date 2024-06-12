import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class SearchEntity {
  constructor({ users, ...data }: Partial<SearchEntity>) {
    Object.assign(this, data);

    if (users) {
      this.users = users.map((user) => new UserEntity(user));
    }
  }

  @ApiProperty()
  users: UserEntity[];

  @ApiProperty()
  usersTotal: number;

  @ApiProperty()
  projects: ProjectEntity[];

  @ApiProperty()
  projectsTotal: number;
}
