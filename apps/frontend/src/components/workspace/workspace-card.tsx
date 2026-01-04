import { Workspace } from "@/lib/types";
import { Briefcase, Clock, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Link
      key={workspace._id}
      href={`/dashboard/workspace/${workspace.slug}`}
      className="group block"
    >
      <div className=" rounded-2xl bg-white border border-neutral-200 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-neutral-100 to-neutral-200 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300">
            <Briefcase className="w-5 h-5 text-neutral-700" />
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-400">
            <Clock className="w-3 h-3" />
            <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors line-clamp-1">
            {workspace.name}
          </h3>
          <p className="text-neutral-500 text-sm line-clamp-2 leading-relaxed">
            {workspace.description || "No description provided"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 text-xs font-medium px-2 py-1 rounded hover:bg-neutral-100 transition-all z-20"
          >
            <Users className="w-4 h-4" />
            <span>Invite</span>
          </button>
          <div className="text-neutral-900 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Open</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkspaceCard;
