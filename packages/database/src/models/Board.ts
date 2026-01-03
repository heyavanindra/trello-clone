import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  slug: string;
  description?: string;
  workspaceId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: [true, "Board name is required"],
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
    workspaceId: {
      type: Schema.Types.ObjectId,
      required: [true, "Workspace ID is required"],
      ref: "Workspace",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, "Creator ID is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Board =
  mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema);
