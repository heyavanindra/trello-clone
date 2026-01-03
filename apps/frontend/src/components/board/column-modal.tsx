import React from 'react'
type ColumnModalProps = {
    setShowCreateModal:(value:boolean)=>void
    creating:boolean
    setColumnTitle:(value:string)=>void
    columnTitle:string
    handleCreateColumn:(e:React.FormEvent<HTMLFormElement>)=>void
}
const ColumnModal = ({setShowCreateModal,creating,setColumnTitle,columnTitle,handleCreateColumn}:ColumnModalProps) => {
  return (
     <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!creating) {
                setShowCreateModal(false);
                setColumnTitle("");
              }
            }}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,1)] border border-neutral-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Create New Column
              </h2>

              <form onSubmit={handleCreateColumn} className="space-y-5">
                {/* Column Title */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Column Title
                  </label>
                  <input
                    type="text"
                    value={columnTitle}
                    onChange={(e) => setColumnTitle(e.target.value)}
                    placeholder="e.g., To Do, In Progress, Done"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:bg-white transition-all"
                    autoFocus
                    disabled={creating}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setColumnTitle("");
                    }}
                    disabled={creating}
                    className="flex-1 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !columnTitle.trim()}
                    className="flex-1 py-3 rounded-xl bg-neutral-900 text-white font-medium shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? "Creating..." : "Create Column"}
                  </button>
                </div>
              </form>
            </div>
          </div>
  )
}

export default ColumnModal