import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: [true, "Owner ID is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Workspace =
  mongoose.models.Workspace ||
  mongoose.model<IWorkspace>("Workspace", WorkspaceSchema);
