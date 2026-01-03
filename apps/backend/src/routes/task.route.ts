import { Router } from "express";
import {
  createTask,
  getTasksByBoard,
  updateTask,
  deleteTask,
  updateTaskColumn,
} from "../controller/task.controller";
import authMiddleware from "../middleware/auth.middleware";

const taskRouter: Router = Router();

// All task routes require authentication
taskRouter.use(authMiddleware);

// Create a new task
taskRouter.post("/", createTask);

// Get all tasks for a specific board
taskRouter.get("/board/:boardId", getTasksByBoard);

// Update a task
taskRouter.put("/:id", updateTask);

// Delete a task
taskRouter.delete("/:id", deleteTask);

taskRouter.patch("/:taskId/move", updateTaskColumn);



export default taskRouter;
