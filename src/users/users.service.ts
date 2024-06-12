import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ConfigService } from '@nestjs/config';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { v4 as uuidv4 } from 'uuid';

// TODO: Fix the firebase admin import such that it detects the service account file
// and initializes the firebase admin SDK with the service account file,
// so calling .bucket() will use the default bucket.
const bucketName = 'regenera-da102.appspot.com';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async create(createUserDto: CreateUserDto, id?: string) {
    let hashedPassword;

    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(
        createUserDto.password,
        Number(this.configService.get<string>('BCRYPT_ROUNDS_OF_HASHING')),
      );
    }

    const user = await this.prisma.user.create({
      data: {
        id,
        ...createUserDto,
        password: hashedPassword,
      },
    });

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

  async findAllByRating(page: number, limit: number) {
    const users = await this.prisma.user.findMany({
      where: { rating: { not: null } },
      take: 10,
      skip: (page - 1) * limit,
      orderBy: {
        rating: 'desc',
      },
    });

    const usersTotal = await this.prisma.user.count({
      where: { rating: { not: null } },
    });

    return { users, usersTotal };
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        Number(this.configService.get<string>('BCRYPT_ROUNDS_OF_HASHING')),
      );
    }

    if (updateUserDto.image) {
      const user = await this.findOne(id);

      if (user.imageUrl) {
        await this.firebase.storage
          .bucket(bucketName)
          .file(
            user.imageUrl.replace(
              `https://storage.googleapis.com/${bucketName}/`,
              '',
            ),
          )
          .delete();
      }

      const fileName = `users/${id}/images/${uuidv4()}.${updateUserDto.image.mimetype.replace('image/', '')}`;

      await this.firebase.storage
        .bucket(bucketName)
        .file(fileName)
        .save(updateUserDto.image.buffer, {});

      const fileRef = this.firebase.storage.bucket(bucketName).file(fileName);

      fileRef.makePublic();

      const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      // Delete the image property from the updateUserDto object
      // and add imageUrl property to the object
      delete updateUserDto.image;
      updateUserDto.imageUrl = imageUrl;
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

  async updateProfile(id: string, updateUserProfileDto: UpdateUserProfileDto) {
    if (updateUserProfileDto.banner) {
      const userProfile = await this.findOneProfile(id);

      if (userProfile.bannerUrl) {
        await this.firebase.storage
          .bucket(bucketName)
          .file(
            userProfile.bannerUrl.replace(
              `https://storage.googleapis.com/${bucketName}/`,
              '',
            ),
          )
          .delete();
      }

      const fileName = `users/${id}/banners/${uuidv4()}.${updateUserProfileDto.banner.mimetype.replace('image/', '')}`;

      await this.firebase.storage
        .bucket(bucketName)
        .file(fileName)
        .save(updateUserProfileDto.banner.buffer, {});

      const fileRef = this.firebase.storage.bucket(bucketName).file(fileName);

      fileRef.makePublic();

      const bannerUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      // Delete the banner property from the updateUserDto object
      // and add bannerUrl property to the object
      delete updateUserProfileDto.banner;
      updateUserProfileDto.bannerUrl = bannerUrl;
    }

    return this.prisma.userProfile.update({
      where: { userId: id },
      data: updateUserProfileDto,
    });
  }
}
