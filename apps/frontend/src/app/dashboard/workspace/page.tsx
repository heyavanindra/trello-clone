"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Plus, Briefcase, Users, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WorkspaceCard from "@/components/workspace/workspace-card";
import { Workspace, WorkspaceMember } from "@/lib/types";
import { CreateWorkspaceInput } from "@repo/common";

const WorkspacePage = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>(
    []
  );
  const [WorkSpaceName, setWorkSpaceName] = useState<CreateWorkspaceInput>({
    name: "",
    description: "",
  });

  const getWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await api.get("/workspaces");
      console.log(response.data.workspaces);
      setWorkspaces(response.data.workspaces);
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    } finally {
      setLoading(false);
    }
  };
  const getWorkspacebyMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/workspaces/members`);
      console.log("Workspace members:", response.data.workspaces);
      setWorkspaceMembers(response.data.workspaces);
    } catch (error) {
      console.error("Failed to fetch workspace members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkspaces();
    getWorkspacebyMembers();
  }, []);

  const handleCreateWorkSpace = async () => {
    try {
      if (!WorkSpaceName.name.trim()) return;
      setLoading(true);
      const response = await api.post("/workspaces", {
        name: WorkSpaceName.name,
        description: WorkSpaceName.description,
      });
      console.log(response.data.workspace);
      setWorkSpaceName({ name: "", description: "" });
      setShowCreateModal(false);
      getWorkspaces();
    } catch (error) {
      console.error("Failed to create workspace:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Your Workspaces
          </h1>
          <p className="text-neutral-500 text-lg">
            Organize your projects and collaborate with your team
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-neutral-100 animate-pulse border border-neutral-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="group h-48 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-white hover:border-neutral-400 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
            >
              <div className="w-14 h-14 rounded-xl bg-neutral-900 flex items-center justify-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-neutral-900 font-semibold text-lg">
                  Create Workspace
                </p>
                <p className="text-neutral-500 text-sm">Start a new project</p>
              </div>
            </button>

            {/* Workspace Cards */}
            {workspaces.map((workspace) => (
              <WorkspaceCard key={workspace._id} workspace={workspace} />
            ))}
            {workspaceMembers.map((workspaceMember) => (
              <Link
                key={workspaceMember.slug}
                href={`/dashboard/workspace/${workspaceMember.slug}`}
                className="group block"
              >
                <div className="h-48 rounded-2xl bg-white border border-neutral-200 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-50 to-violet-100 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="px-2 py-1 rounded bg-violet-50 text-violet-700 text-xs font-semibold border border-violet-100 uppercase tracking-wider">
                      {workspaceMember.role}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors line-clamp-1">
                      {workspaceMember.name}
                    </h3>
                    <p className="text-neutral-500 text-sm">Workspace Member</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                    <div className="text-neutral-400 text-xs">
                      Joined Workspace
                    </div>
                    <div className="text-neutral-900 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Open</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading &&
          workspaces.length === 0 &&
          workspaceMembers.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                <Briefcase className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                No workspaces yet
              </h3>
              <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                Create your first workspace to start organizing your projects
                and collaborating with your team.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 hover:-translate-y-px transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Workspace
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
              Create New Workspace
            </h2>
            <div>
              <input
                type="text"
                placeholder="Workspace Name"
                value={WorkSpaceName.name}
                className="w-full mb-4 p-2 border rounded"
                onChange={(e) =>
                  setWorkSpaceName({ ...WorkSpaceName, name: e.target.value })
                }
              />
                  <textarea
                    placeholder="Workspace Description"
                    value={WorkSpaceName.description}
                    className="w-full mb-4 p-2 border rounded"
                    onChange={(e) =>
                      setWorkSpaceName({
                        ...WorkSpaceName,
                        description: e.target.value,
                      })
                    }
                  />

              <button onClick={handleCreateWorkSpace}>Create</button>
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
