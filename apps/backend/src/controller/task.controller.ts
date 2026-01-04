import { createTaskSchema, updateTaskSchema } from "@repo/common";
import { Task, Column, Board, Workspace } from "@repo/database";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createTask = async (req: Request, res: Response) => {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.message,
    });
  }

  try {
    const { title, description, columnId, boardId } = result.data;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(400).json({ message: "Invalid column ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const column = await Column.findById(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    if (column.boardId.toString() !== boardId) {
      return res
        .status(400)
        .json({ message: "Column does not belong to this board" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const workspace = await Workspace.findOne({
      _id: board.workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You don't have permission to create tasks in this board",
      });
    }

    const newTask = new Task({
      title,
      description,
      columnId,
      boardId,
    });

    await newTask.save();

    return res.status(201).json({
      message: "Task created successfully",
      task: {
        _id: newTask._id,
        id: newTask._id,
        title: newTask.title,
        description: newTask.description,
        columnId: newTask.columnId,
        boardId: newTask.boardId,
        status: newTask.status,
        createdBy: newTask.createdBy,
        createdAt: newTask.createdAt,
        updatedAt: newTask.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasksByBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

  
    const tasks = await Task.find({ boardId })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.message,
    });
  }

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const updateData = result.data;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const board = await Board.findById(existingTask.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const workspace = await Workspace.findOne({
      _id: board.workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You don't have permission to update this task",
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-__v");

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const board = await Board.findById(existingTask.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const workspace = await Workspace.findOne({
      _id: board.workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You don't have permission to delete this task",
      });
    }

    const task = await Task.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Task deleted successfully",
      task: {
        id: task?._id,
        title: task?.title,
      },
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskColumn = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { columnId } = req.body;

    if (
      (taskId && !mongoose.Types.ObjectId.isValid(taskId)) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      return res.status(400).json({ message: "Invalid IDs" });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { columnId: columnId },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({
      message: "Task updated",
      task,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
