"use client";

import Column from "@/components/column";
import socket from "@/lib/socket";
import { ColumnType, TaskType } from "@/lib/types";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import Loading from "@/components/board/loading";
import NoColumns from "@/components/board/no-columns";
import ColumnModal from "@/components/board/column-modal";
import TaskModal from "@/components/board/task-modal";

const BoardPage = () => {
  const params = useParams();
  const workspaceSlug = params.workspaceId as string;
  const boardSlug = params.boardId as string;

  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [boardName, setBoardName] = useState<string>("");
  const [boardId, setBoardId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");

  // Task creation states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");
  const [role,setRole] = useState<"OWNER" | "ADMIN" | "MEMBER">("OWNER");

  const fetchBoardData = async () => {
    try {
      setLoading(true);

      const boardResponse = await api.get(`/boards/${boardSlug}`);
      setBoardName(boardResponse.data.board.name);
      setBoardId(boardResponse.data.board._id);

      const columnsResponse = await api.get(
        `/columns/board/${boardResponse.data.board._id}`
      );
      setColumns(columnsResponse.data.columns || []);

      const tasksResponse = await api.get(
        `/tasks/board/${boardResponse.data.board._id}`
      );
      setTasks(tasksResponse.data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch board data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateColumn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!columnTitle.trim()) {
      return;
    }

    try {
      setCreating(true);
      await api.post("/columns", {
        title: columnTitle,
        boardSlug: boardSlug,
      });

      // Refresh columns
      await fetchBoardData();

      // Reset and close modal
      setColumnTitle("");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create column:", error);
      alert("Failed to create column. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setShowTaskModal(true);
  };


  const handleGetRole = async () => {
    try {
      const response = await api.get(`/boards/role/${workspaceSlug}`);
      console.log("role is ",response.data)
      setRole(response.data.role);
    } catch (error) {
      console.error("Failed to get role:", error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      return;
    }

    try {
      setCreatingTask(true);
      // await api.post("/tasks", {
      //   title: taskTitle,
      //   description: taskDescription,
      //   columnId: selectedColumnId,
      //   boardId: boardId,
      // });


    socket.emit("task-created", {
      task :{
        title: taskTitle,
        description: taskDescription,
        columnId: selectedColumnId,
        boardId: boardId,
      },
      boardSlug: boardSlug,
    });

      // Refresh tasks
      // await fetchBoardData();

      // Reset and close modal
      setTaskTitle("");
      setTaskDescription("");
      setShowTaskModal(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Failed to create task. Please try again.");
    } finally {
      setCreatingTask(false);
    }
  };

  useEffect(() => { 
    fetchBoardData();
  }, [boardSlug]);

  useEffect(() => {
    if (boardId) {
      handleGetRole();
    }
  }, [boardId]);

  useEffect(() => {
    socket.emit("join-board", boardSlug);

    socket.on(
      "task-updated",
      (data: { taskId: string; newColumnId: string }) => {
        console.log("Received task update from another user:", data);

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === data.taskId
              ? { ...task, columnId: data.newColumnId }
              : task
          )
        );
      }
    );

    socket.on("task-deleted",(data:{taskId:string})=>{

      console.log("prev tasks",data);
      console.log("Received task delete from another user:", data);
      setTasks((prevTasks) => prevTasks.filter((task:{_id:string}) => task._id !== data.taskId));
    })  

    socket.on("task-created",({task}:{task:TaskType})=>{
      console.log("Received task create from another user:", task);
      setTasks((prevTasks) => [...prevTasks, task]);
    })

    return () => {
      socket.off("task-updated");
      socket.off("task-deleted");
      socket.off("task-created");
    };
  }, [boardSlug]);

  function handleDrag(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id as string;
    const newColumnId = over.id as string;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, columnId: newColumnId } : task
      )
    );

    socket.emit("task-moved", {
      taskId,
      newColumnId,
      boardId: boardSlug,
    });


  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Link
          href={`/dashboard/workspace/${workspaceSlug}`}
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Boards</span>
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">
              {boardName || "Board"}
            </h1>
            <p className="text-neutral-500 text-sm">
              Drag and drop cards to manage progress
            </p>
          </div>
         {role === "OWNER" ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:bg-neutral-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Column
          </button>
         ) : null}
        </div>

        {/* Columns */}
        {columns.length === 0 ? (
          <NoColumns setShowCreateModal={setShowCreateModal} />
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-start h-full overflow-x-auto pb-4">
            <DndContext onDragEnd={handleDrag}>
              {columns.map((column) => (
                <Column
                role={role}
                boardSlug={boardSlug}
                  key={column._id}
                  column={column}
                  tasks={tasks.filter((t) => t.columnId === column._id)}
                  onAddTask={handleAddTask}
                />
              ))}
            </DndContext>
          </div>
        )}

        {/* Create Column Modal */}
        {showCreateModal && (
          <ColumnModal
            setShowCreateModal={setShowCreateModal}
            creating={creating}
            setColumnTitle={setColumnTitle}
            columnTitle={columnTitle}
            handleCreateColumn={handleCreateColumn}
          />
        )}

        {/* Create Task Modal */}
        {showTaskModal && (
         <TaskModal setShowTaskModal={setShowTaskModal} creatingTask={creatingTask} taskTitle={taskTitle} taskDescription={taskDescription} setTaskTitle={setTaskTitle} setTaskDescription={setTaskDescription} handleCreateTask={handleCreateTask} selectedColumnId={selectedColumnId}/>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
