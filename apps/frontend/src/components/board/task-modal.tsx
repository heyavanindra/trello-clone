import React from 'react'

type TaskModalProps = {
    setShowTaskModal: (show: boolean) => void;
    creatingTask: boolean;
    taskTitle: string;
    taskDescription: string;
    setTaskTitle: (title: string) => void;
    setTaskDescription: (description: string) => void;
    handleCreateTask: (e: React.FormEvent) => void;
    selectedColumnId: string;
}

const TaskModal = ({
    setShowTaskModal,
    creatingTask,
    taskTitle,
    taskDescription,
    setTaskTitle,
    setTaskDescription,
    handleCreateTask,
    selectedColumnId
}: TaskModalProps) => {
  return (
     <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!creatingTask) {
                setShowTaskModal(false);
                setTaskTitle("");
                setTaskDescription("");
              }
            }}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,1)] border border-neutral-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Create New Task
              </h2>

              <form onSubmit={handleCreateTask} className="space-y-5">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g., Design homepage mockup"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white transition-all"
                    autoFocus
                    disabled={creatingTask}
                    required
                  />
                </div>

                {/* Task Description */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Add more details about this task..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white transition-all resize-none"
                    disabled={creatingTask}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTaskModal(false);
                      setTaskTitle("");
                      setTaskDescription("");
                    }}
                    disabled={creatingTask}
                    className="flex-1 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingTask || !taskTitle.trim()}
                    className="flex-1 py-3 rounded-xl bg-neutral-900 text-white font-medium shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingTask ? "Creating..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
  )
}

export default TaskModal