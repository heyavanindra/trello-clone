"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Plus, LayoutGrid, Calendar, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";

type Board = {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

type Member = {
  name: string;
  role: string;
  email: string;
};

const WorkspacePage = () => {
  const params = useParams();
  const router = useRouter();
  const workspaceSlug = params.workspaceId as string;
  console.log("workspace slug", workspaceSlug);

  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userToInvite, setUserToInvite] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [boardName, setBoardName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState<"OWNER" | "ADMIN" | "MEMBER">("OWNER");
  const getWorkspaceAndBoards = async () => {
    try {
      setLoading(true);

      // Fetch workspace details
      const workspaceResponse = await api.get(
        `/boards/workspace/${workspaceSlug}`
      );
      setBoards(workspaceResponse.data.boards);
    } catch (error) {
      console.error("Failed to fetch boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRole = async () => {
    try {
      const response = await api.get(`/boards/role/${workspaceSlug}`);
      console.log("role is ", response.data);
      setRole(response.data.role);
    } catch (error) {
      console.error("Failed to get role:", error);
    }
  };

  const changeRole = async ({
    email,
    role,
  }: {
    email: string;
    role: string;
  }) => {
    try {
      setLoading(true);
      const response = await api.put(`/workspaces/${workspaceSlug}/members`, {
        email: email,
        role: role,
      });

      console.log("Invite response:", response.data);
      getWorkspaceMembers();
      toast.success("User invited successfully");
    } catch (error) {
      console.error("Failed to invite user:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Failed to invite user");
    } finally {
      setLoading(false);
    }
  };

  const getWorkspaceMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/workspaces/${workspaceSlug}/members`);
      setMembers(response.data.members);
      console.log("Workspace members:", response.data);
    } catch (error) {
      console.error("Failed to fetch workspace members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkspaceAndBoards();
    getWorkspaceMembers();
  }, [workspaceSlug]);

  const handleInvite = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/workspaces/${workspaceSlug}/invite`, {
        email: userToInvite,
      });
      console.log("Invite response:", response.data);
      toast.success("User invited successfully");
    } catch (error) {
      console.error("Failed to invite user:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data.message || "Failed to invite user");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/boards`, {
        name: boardName,
        description: description,
        workspaceSlug: workspaceSlug,
      });

      await getWorkspaceAndBoards();
      setShowCreateModal(false);
      console.log("Board created successfully:", response.data);
      toast.success("Board created successfully");
    } catch (error) {
      console.error("Failed to create board:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(
        axiosError.response?.data.message || "Failed to create board"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceSlug) {
      handleGetRole();
    }
  }, [workspaceSlug]);

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/dashboard/workspace"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Workspaces</span>
        </Link>
        {role === "OWNER" && (
          <div className="flex items-center gap-2">
            <input
              onChange={(e) => setUserToInvite(e.target.value)}
              type="text"
              placeholder="Search boards..."
              className="w-full p-2 border border-neutral-200 rounded"
            />
            <button
              onClick={handleInvite}
              className="p-2 border border-neutral-200 rounded"
            >
              Invite
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 rounded-2xl bg-neutral-100 animate-pulse border border-neutral-200"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {role === "OWNER" && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="group h-48 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-white hover:border-neutral-400 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                  >
                    <div className="w-14 h-14 rounded-xl bg-neutral-900 flex items-center justify-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-neutral-900 font-semibold text-lg">
                        Create Board
                      </p>
                      <p className="text-neutral-500 text-sm">
                        Start a new board
                      </p>
                    </div>
                  </button>
                )}

                {boards.map((board) => (
                  <Link
                    key={board._id}
                    href={`/dashboard/workspace/${workspaceSlug}/board/${board.slug}`}
                    className="group block"
                  >
                    <div className="h-48 rounded-2xl bg-white border border-neutral-200 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300">
                          <LayoutGrid className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(board.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors line-clamp-1">
                          {board.name}
                        </h3>
                        <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">
                          {board.description || "No description provided"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                        <div className="text-neutral-400 text-xs">Board</div>
                        <div className="text-neutral-900 font-medium text-sm group-hover:translate-x-1 transition-transform">
                          Open →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-24 shadow-sm">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Members
              </h3>

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100"
                  >
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {member.name}
                      </p>
                      {role === "OWNER" ? (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            changeRole({
                              email: member.email,
                              role: e.target.value,
                            })
                          }
                          className="mt-1 block w-full text-xs p-1 border border-neutral-200 rounded text-neutral-600 bg-white"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="MEMBER">Member</option>
                        </select>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider text-[10px]">
                          {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {members.length === 0 && !loading && (
                  <p className="text-neutral-400 text-sm text-center py-4">
                    No members found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {!loading && boards.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
              <LayoutGrid className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">
              No boards yet
            </h3>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              Create your first board to start organizing tasks and managing
              your workflow.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 hover:-translate-y-px transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Board
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,1)] border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Create New Board
            </h2>
            <div>
              <input
                type="text"
                placeholder="Board Name"
                onChange={(event) => {
                  setBoardName(event.target.value);
                }}
              />
              <textarea
                placeholder="Board Description"
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
              <button onClick={handleCreateBoard}>Create</button>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full py-3 rounded-xl bg-neutral-900 text-white font-medium shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspacePage;
