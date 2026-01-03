"use client";
import { ColumnType, TaskType } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import Task from "./task";
import { Plus } from "lucide-react";

const Column = ({

  boardSlug,
  role, 
  column,
  tasks,
  onAddTask,
}: {
  boardSlug: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  column: ColumnType;
  tasks: TaskType[];
  onAddTask: (columnId: string) => void;
}) => {
  const { setNodeRef } = useDroppable({
    id: column._id,
  });

  return (
    <div className="flex flex-col w-full md:w-80 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-600">
          {column.title}
        </h2>
        <span className="bg-neutral-200 text-neutral-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-col gap-3 min-h-[500px] bg-neutral-100/50 p-3 rounded-2xl border border-neutral-200/60 shadow-inner"
      >
        {tasks.map((task) => (
          <Task role={role} boardSlug={boardSlug} key={task._id} task={task} />
        ))}

        {/* Add Task Button */}
       {role === "OWNER" || role === "ADMIN" ? (
        <button
          onClick={() => onAddTask(column._id)}
          className="mt-2 w-full py-2 px-3 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
       ) : null}
      </div>
    </div>
  );
};

export default Column;
