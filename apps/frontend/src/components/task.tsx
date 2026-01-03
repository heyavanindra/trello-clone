import socket from "@/lib/socket";
import { TaskType } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";

const Task = ({ role, task,boardSlug }: { role:string; task: TaskType; boardSlug: string }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  const handleDeleteTask = async (taskId: string) => {
    console.log("Deleting task")
    try {
      console.log("Deleting task:", taskId);
      socket.emit("task-deleted", {
        taskId,
        boardSlug,
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative p-4 rounded-xl cursor-grab active:cursor-grabbing
        transition-all duration-200 ease-out
        bg-white group
        border-t border-t-white
        border-b border-b-neutral-200
        border-x border-x-transparent
        ${isDragging 
          ? "z-20 shadow-[0_10px_20px_rgba(0,0,0,0.1)] scale-105 rotate-2 opacity-90" 
          : "shadow-sm hover:shadow-md hover:-translate-y-0.5"
        }
      `}
    >
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none" />

      <h3 className="font-semibold text-neutral-800 mb-1 leading-tight">
        {task.title}
      </h3>
      <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">
        {task.description}
      </p>
     
      
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-white to-transparent opacity-50 pointer-events-none rounded-b-xl" />
      {role === "OWNER" || role === "ADMIN" ? (
        <button className="absolute z-50 top-2 right-2 cursor-pointer p-2 rounded-full bg-red-500 text-white" onClick={() => handleDeleteTask(task._id)}>Delete</button>
      ) : null}
    </div>
  );
};

export default Task;