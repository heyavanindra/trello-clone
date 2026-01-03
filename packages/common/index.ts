import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string(),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(100, "Workspace name must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;

export const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .max(100, "Board name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  workspaceSlug: z.string().min(1, "Workspace ID is required"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;

export const updateBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .max(100, "Board name must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;

export const createColumnSchema = z.object({
  title: z
    .string()
    .min(1, "Column title is required")
    .max(100, "Column title must be less than 100 characters"),
  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be non-negative")
    .optional(),
  boardSlug: z.string().min(1, "Board ID is required"),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;

export const updateColumnSchema = z.object({
  title: z
    .string()
    .min(1, "Column title is required")
    .max(100, "Column title must be less than 100 characters")
    .optional(),
  order: z
    .number()
    .int("Order must be an integer")
    .min(0, "Order must be non-negative")
    .optional(),
});

export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;

// Task schemas
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must be less than 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  columnId: z.string().min(1, "Column ID is required"),
  boardId: z.string().min(1, "Board ID is required"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  columnId: z.string().optional(),
  status: z.enum(["Backlog", "In Progress", "Done"]).optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
