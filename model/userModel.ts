import { model, Schema, Document } from "mongoose";

interface iUser {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isVerifiedToken: string;
}

interface IUserData extends iUser, Document {}

const userModel = new Schema<IUserData>({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  isVerifiedToken: {
    type: String,
  },
});

export default model<IUserData>("users", userModel);
