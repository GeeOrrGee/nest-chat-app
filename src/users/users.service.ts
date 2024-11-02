import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: UserDTO, refreshToken: string): Promise<UserDTO> {
    const userExists = await this.findByUsername(createUserDto.username);
    if (userExists) throw new ConflictException('User already exists');

    const hashedPass = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      refreshToken,
      password: hashedPass,
    });

    return (await createdUser.save()).toObject();
  }

  async findAll(): Promise<UserDTO[]> {
    return this.userModel.find().exec();
  }

  async findById(id: Types.ObjectId): Promise<UserDTO> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<UserDTO> {
    return (await this.userModel.findOne({ username }).exec()).toObject();
  }

  async remove(id: string): Promise<UserDTO> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
