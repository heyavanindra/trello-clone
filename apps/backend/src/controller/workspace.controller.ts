import { createWorkspaceSchema, updateWorkspaceSchema } from "@repo/common";
import { User, Workspace, WorkspaceMember } from "@repo/database";
import { Request, Response } from "express";

export const createWorkspace = async (req: Request, res: Response) => {
  const result = createWorkspaceSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.message,
    });
  }

  try {
    const { name, description } = result.data;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newWorkspace = new Workspace({
      name,
      description,
      ownerId: userId,
      slug: name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    });

    await newWorkspace.save();

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace: {
        id: newWorkspace._id,
        _id: newWorkspace._id,
        name: newWorkspace.name,
        slug: newWorkspace.slug,
        description: newWorkspace.description,
        ownerId: newWorkspace.ownerId,
        createdAt: newWorkspace.createdAt,
        updatedAt: newWorkspace.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create workspace error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllWorkspaces = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const workspaces = await Workspace.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.status(200).json({
      message: "Workspaces retrieved successfully",
      workspaces,
    });
  } catch (error) {
    console.error("Get workspaces error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkspaceById = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!slug) {
      return res.status(400).json({ message: "Workspace slug is required" });
    }

    const workspace = await Workspace.findOne({
      slug: slug,
      ownerId: userId,
    }).select("-__v");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    return res.status(200).json({
      message: "Workspace retrieved successfully",
      workspace,
    });
  } catch (error) {
    console.error("Get workspace error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  const result = updateWorkspaceSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.message,
    });
  }

  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: "Workspace slug is required" });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updateData = result.data;

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const workspace = await Workspace.findOneAndUpdate(
      { slug: slug, ownerId: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    return res.status(200).json({
      message: "Workspace updated successfully",
      workspace,
    });
  } catch (error) {
    console.error("Update workspace error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const userId = req.userId;

    if (!slug) {
      return res.status(400).json({ message: "Workspace slug is required" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const workspace = await Workspace.findOneAndDelete({
      slug: slug,
      ownerId: userId,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    return res.status(200).json({
      message: "Workspace deleted successfully",
      workspace: {
        id: workspace._id,
        name: workspace.name,
      },
    });
  } catch (error) {
    console.error("Delete workspace error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const inviteUserToWorkspace = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { email, role = "MEMBER" } = req.body;
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const requesterId = req.userId;

    const workspace = await Workspace.findOne({ slug });
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    console.log("email", email);

    if (workspace.ownerId.toString() !== requesterId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the owner can invite users" });
    }

    const userToInvite = await User.findOne({ email });
    console.log("user to invite", userToInvite);
    if (!userToInvite) {
      return res
        .status(404)
        .json({ message: "User with this email not found" });
    }

    const existingMember = await WorkspaceMember.findOne({
      workspaceId: workspace._id,
      userId: userToInvite._id,
    });
    if (existingMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    await WorkspaceMember.create({
      workspaceId: workspace._id,
      userId: userToInvite._id,
      role: role,
    });
    return res.status(200).json({ message: "User invited successfully" });
  } catch (error) {
    console.error("Invite error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWorkspaceMembers = async (req: Request, res: Response) => {
  console.log("req");
  try {
    const { slug } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!slug) {
      return res.status(400).json({ message: "Workspace slug is required" });
    }

    const workspace = await Workspace.findOne({
      slug: slug,
    }).select("-__v");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const membersData = await WorkspaceMember.find({
      workspaceId: workspace._id,
    })
      .populate("userId", "name email")
      .select("role userId");

    const members = membersData.map((member: any) => ({
      name: member.userId?.name,
      email: member.userId?.email,
      role: member.role,
    }));

    return res.status(200).json({
      message: "Workspace members retrieved successfully",
      members,
    });
  } catch (error) {
    console.error("Get workspace members error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllWorkspacesByMember = async (req: Request, res: Response) => {
  console.log("req");
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const members = await WorkspaceMember.find({ userId })
      .populate("workspaceId", "name slug")
      .select("role workspaceId");

    const workspaces = members
      .map((member: any) => {
        if (!member.workspaceId) return null;
        return {
          role: member.role,
          name: member.workspaceId.name,
          slug: member.workspaceId.slug,
        };
      })
      .filter((w) => w !== null);

    console.log("members ", workspaces);
    return res.status(200).json({
      message: "Workspaces retrieved successfully",
      workspaces,
    });
  } catch (error) {
    console.error("Get all workspaces error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const changeRole = async (req: Request, res: Response) => {
  try {
    const { workspaceSlug } = req.params;
    const { email, role } = req.body;
    const workspace = await Workspace.findOne({ slug: workspaceSlug }).select(
      "_id"
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const userId = await User.findOne({ email }).select("_id");

    const workspaceMember = await WorkspaceMember.findOne({
      workspaceId: workspace._id,
      userId: userId._id,
    });
    if (!workspaceMember) {
      return res.status(404).json({ message: "Workspace member not found" });
    }
    workspaceMember.role = role;
    await workspaceMember.save();
    return res
      .status(200)
      .json({ message: "Workspace member role updated successfully" });
  } catch (error) {
    console.error("Change role error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
