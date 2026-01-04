import { createBoardSchema, updateBoardSchema } from "@repo/common";
import { Board, Workspace, WorkspaceMember } from "@repo/database";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createBoard = async (req: Request, res: Response) => {
  const result = createBoardSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.message,
    });
  }

  try {
    const { name, description, workspaceSlug } = result.data;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the workspace exists and the user owns it
    const workspace = await Workspace.findOne({
      slug: workspaceSlug,
    });

    if (!workspace) {
      return res.status(404).json({
        message:
          "Workspace not found or you don't have permission to create boards in it",
      });
    }

    const newBoard = new Board({
      name,
      description,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      workspaceSlug,
      workspaceId: workspace._id as string,
      createdBy: userId,
    });

    await newBoard.save();

    return res.status(201).json({
      message: "Board created successfully",
      board: {
        id: newBoard._id,
        _id: newBoard._id,
        name: newBoard.name,
        slug: newBoard.slug,
        description: newBoard.description,
        workspaceId: newBoard.workspaceId,
        createdBy: newBoard.createdBy,
        createdAt: newBoard.createdAt,
        updatedAt: newBoard.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create board error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBoardsByWorkspace = async (req: Request, res: Response) => {
  try {
    const { workspaceSlug } = req.params;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!workspaceSlug) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }

    const workspace = await Workspace.findOne({
      slug: workspaceSlug,
    });

    if (!workspace) {
      return res.status(404).json({
        message:
          "Workspace not found or you don't have permission to access it",
      });
    }

    const boards = await Board.find({ workspaceId: workspace._id })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      message: "Boards retrieved successfully",
      boards,
    });
  } catch (error) {
    console.error("Get boards error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBoardById = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!slug) {
      return res.status(400).json({ message: "Board slug is required" });
    }

    const board = await Board.findOne({ slug }).select("-__v");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.status(200).json({
      message: "Board retrieved successfully",
      board,
    });
  } catch (error) {
    console.error("Get board error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBoard = async (req: Request, res: Response) => {
  const result = updateBoardSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.message,
    });
  }

  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Board slug is required" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updateData = result.data;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const existingBoard = await Board.findOne({ slug });

    if (!existingBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    const workspace = await Workspace.findOne({
      _id: existingBoard.workspaceId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You don't have permission to update this board",
      });
    }

    const board = await Board.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-__v");

    return res.status(200).json({
      message: "Board updated successfully",
      board,
    });
  } catch (error) {
    console.error("Update board error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Board slug is required" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the board first
    const existingBoard = await Board.findOne({ slug });

    if (!existingBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    const workspace = await Workspace.findOne({
      _id: existingBoard.workspaceId,
    });

    if (!workspace) {
      return res.status(403).json({
        message: "You don't have permission to delete this board",
      });
    }

    const board = await Board.findOneAndDelete({ slug });

    return res.status(200).json({
      message: "Board deleted successfully",
      board: {
        id: board?._id,
        name: board?.name,
      },
    });
  } catch (error) {
    console.error("Delete board error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRole = async (req: Request, res: Response) => {
  try {
    const { workspaceSlug } = req.params;

    if (!workspaceSlug) {
      return res.status(400).json({ message: "Workspace slug is required" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const workspace = await Workspace.findOne({ slug: workspaceSlug });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.ownerId.toString() === userId) {
      return res.status(200).json({
        message: "You are the owner of this board",
        role: "OWNER",
      });
    }

    const role = await WorkspaceMember.findOne({
      workspaceId: workspace._id,
      userId,
    });

    if (!role) {
      return res.status(403).json({
        message: "You don't have permission to access this board",
      });
    }

    return res.status(200).json({
      message: "Role retrieved successfully",
      role: role?.role,
    });
  } catch (error) {
    console.error("Get role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
