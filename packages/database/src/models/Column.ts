import mongoose, { Schema, Document } from "mongoose";

export interface IColumn extends Document {
  title: string;
  boardId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>(
  {
    title: {
      type: String,
      required: [true, "Column name is required"],
    },
    boardId: {
      type: mongoose.Types.ObjectId,
      required: [true, "Board ID is required"],
      ref: "Board",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Column =
  mongoose.models.Column || mongoose.model<IColumn>("Column", ColumnSchema);
