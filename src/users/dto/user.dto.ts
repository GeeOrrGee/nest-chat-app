import { Types } from 'mongoose';

export type UserDTO = {
  username: string;
  password: string;
  _id: Types.ObjectId;
};
