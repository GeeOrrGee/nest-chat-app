import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type IUser = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken: string;

  @Prop()
  conversations: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
