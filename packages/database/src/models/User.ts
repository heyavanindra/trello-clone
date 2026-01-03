import mongoose, { Document, Schema } from "mongoose";


export interface IUser extends Document {
  email: string;
  name: string;
  password: string; 
  createdAt: Date;
  updatedAt: Date;
}


const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false, 
  }
);




export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
