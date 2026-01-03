import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspaceMember extends Document {
  workspaceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: string;
}

const WorkspaceMemberSchema = new Schema<IWorkspaceMember>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Workspace",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    role: {
      type: String,
      required: true,
      enum: ["OWNER", "ADMIN", "MEMBER"],
      default: "MEMBER",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const WorkspaceMember =
  mongoose.models.WorkspaceMember ||
  mongoose.model<IWorkspaceMember>("WorkspaceMember", WorkspaceMemberSchema);
