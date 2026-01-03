import { Router } from "express";
import {
  createColumn,
  getColumnsByBoard,
  getColumnById,
  updateColumn,
  deleteColumn,
} from "../controller/column.controller";
import authMiddleware from "../middleware/auth.middleware";

const columnRouter: Router = Router();

// All column routes require authentication
columnRouter.use(authMiddleware);

// Create a new column
columnRouter.post("/", createColumn);

// Get all columns for a specific board
columnRouter.get("/board/:boardId", getColumnsByBoard);

// Get a specific column by ID
columnRouter.get("/:id", getColumnById);

// Update a column
columnRouter.put("/:id", updateColumn);

// Delete a column
columnRouter.delete("/:id", deleteColumn);

export default columnRouter;
