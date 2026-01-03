import { Router } from "express";
import {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteUserToWorkspace,
  getWorkspaceMembers,
  getAllWorkspacesByMember,
  changeRole,
} from "../controller/workspace.controller";
import authMiddleware from "../middleware/auth.middleware";

const workspaceRouter: Router = Router();

// All workspace routes require authentication
workspaceRouter.use(authMiddleware);

// Create a new workspace
workspaceRouter.post("/", createWorkspace);

// Get all workspaces for authenticated user
workspaceRouter.get("/", getAllWorkspaces);

workspaceRouter.get("/members", getAllWorkspacesByMember);


// Get a specific workspace by slug
workspaceRouter.get("/:slug", getWorkspaceById);

// Update a workspace
workspaceRouter.put("/:slug", updateWorkspace);

// Delete a workspace
workspaceRouter.delete("/:slug", deleteWorkspace);

workspaceRouter.post("/:slug/invite", inviteUserToWorkspace);

workspaceRouter.get("/:slug/members", getWorkspaceMembers);

workspaceRouter.put("/:workspaceSlug/members", changeRole);




export default workspaceRouter;