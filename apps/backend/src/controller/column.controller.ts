import { createColumnSchema, updateColumnSchema } from "@repo/common";
import { Column, Board, Workspace } from "@repo/database";
import { Request, Response } from "express";
import mongoose from "mongoose";


export const createColumn = async (req: Request, res: Response) => {
  const result = createColumnSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.message,
    });
  }

  try {
    const { title, order, boardSlug } = result.data;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

   

    const board = await Board.findOne({ slug: boardSlug });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Verify the user owns the workspace that contains this board
    const workspace = await Workspace.findOne({
      _id: board.workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You don't have permission to create columns in this board",
      });
    }

    let columnOrder = order;
    if (columnOrder === undefined) {
      const lastColumn = await Column.findOne({ boardId: board._id }).sort({ order: -1 });
      columnOrder = lastColumn ? lastColumn.order + 1 : 0;
    }

    const newColumn = new Column({
      title,
      order: columnOrder,
      boardId: board._id,
    });

    await newColumn.save();

    return res.status(201).json({
      message: "Column created successfully",
      column: {
        id: newColumn._id,
        title: newColumn.title,
        order: newColumn.order,
        boardId: newColumn.boardId,
        createdAt: newColumn.createdAt,
        updatedAt: newColumn.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create column error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getColumnsByBoard = async (req: Request, res: Response) => {
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

  

    const columns = await Column.find({ boardId })
      .sort({ order: 1 })
      .select("-__v");

    return res.status(200).json({
      message: "Columns retrieved successfully",
      columns,
    });
  } catch (error) {
    console.error("Get columns error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getColumnById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!id) {
      return res.status(400).json({ message: "Column ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid column ID" });
    }

    const column = await Column.findById(id).select("-__v");

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    const board = await Board.findById(column.boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const workspace = await Workspace.findOne({
      _id: board.workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You don't have permission to access this column",
      });
    }

    return res.status(200).json({
      message: "Column retrieved successfully",
      column,
    });
  } catch (error) {
    console.error("Get column error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateColumn = async (req: Request, res: Response) => {
  const result = updateColumnSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.message,
    });
  }

  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Column ID is required" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid column ID" });
    }

    const updateData = result.data;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const existingColumn = await Column.findById(id);

    if (!existingColumn) {
      return res.status(404).json({ message: "Column not found" });
    }

    const board = await Board.findById(existingColumn.boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const workspace = await Workspace.findOne({
      _id: board.workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You don't have permission to update this column",
      });
    }

    const column = await Column.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-__v");

    return res.status(200).json({
      message: "Column updated successfully",
      column,
    });
  } catch (error) {
    console.error("Update column error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Column ID is required" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid column ID" });
    }

    const existingColumn = await Column.findById(id);

    if (!existingColumn) {
      return res.status(404).json({ message: "Column not found" });
    }

    const board = await Board.findById(existingColumn.boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const workspace = await Workspace.findOne({
      _id: board.workspaceId,
      ownerId: userId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You don't have permission to delete this column",
      });
    }

    const column = await Column.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Column deleted successfully",
      column: {
        id: column?._id,
        title: column?.title,
      },
    });
  } catch (error) {
    console.error("Delete column error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
