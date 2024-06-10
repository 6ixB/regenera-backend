import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'nestjs-prisma';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const chatId = uuidv4();
    const chatRoomData = {
      ...createChatDto
    };

    if(createChatDto.image){
      const imageUrl = await this.uploadImage(
        chatId,
        createChatDto.image,
      );

      createChatDto.image = imageUrl

    }

    return this.prisma.chat.create({data: createChatDto, include:{user: true}});
  }

  async findAllByChatRoomId(chatRoomId: string) {
    const chatRoomExist = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoomExist) {
      throw new NotFoundException(`Chat Room with id ${chatRoomId} not found`);
    }

    return await this.prisma.chat.findMany({
      where: { chatRoomId },
      include: { user: true },
    });;
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const bucketName = 'regenera-da102.appspot.com';

    const fileName = `chats/${id}/images/${uuidv4()}.${file.mimetype.replace('image/', '')}`;

    await this.firebase.storage
      .bucket(bucketName)
      .file(fileName)
      .save(file.buffer, {});

    const fileRef = this.firebase.storage.bucket(bucketName).file(fileName);

    fileRef.makePublic();

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return imageUrl;
  }

}
