import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  boardId: mongoose.Types.ObjectId;
  columnId: mongoose.Types.ObjectId;
  title: string;
  status: "Backlog" | "Done" | "In Progress";
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      required: [true, "Board ID is required"],
      ref: "Board",
    },
    columnId: {
      type: Schema.Types.ObjectId,
      required: [true, "Column ID is required"],
      ref: "Column",
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
    },
    description: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, "Created by is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Task =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
