import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;

    const user = await this.prisma.user.create({ data: createUserDto });

    const createUserProfileDto: CreateUserProfileDto = {
      bio: null,
      birthDate: null,
    };

    await this.createProfile(user.id, createUserProfileDto);

    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  createProfile(userId: string, createUserProfileDto: CreateUserProfileDto) {
    const userProfileData = {
      ...createUserProfileDto,
      userId: userId,
    };

    return this.prisma.userProfile.create({ data: userProfileData });
  }

  findOneProfile(id: string) {
    return this.prisma.userProfile.findUnique({
      where: { userId: id },
      include: { user: true },
    });
  }

  updateProfile(id: string, updateUserProfileDto: UpdateUserProfileDto) {
    return this.prisma.userProfile.update({
      where: { userId: id },
      data: updateUserProfileDto,
    });
  }
}
