import { Router } from "express";
import {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  updateBoard,
  deleteBoard,
  getRole,
} from "../controller/board.controller";
import authMiddleware from "../middleware/auth.middleware";

const boardRouter: Router = Router();

// All board routes require authentication
boardRouter.use(authMiddleware);

// Create a new board
boardRouter.post("/", createBoard);

// Get all boards for a specific workspace
boardRouter.get("/workspace/:workspaceSlug", getBoardsByWorkspace);


boardRouter.get("/role/:workspaceSlug", getRole);

// Get a specific board by slug
boardRouter.get("/:slug", getBoardById);

// Update a board
boardRouter.put("/:slug", updateBoard);

// Delete a board
boardRouter.delete("/:slug", deleteBoard);

// Get role


export default boardRouter;
