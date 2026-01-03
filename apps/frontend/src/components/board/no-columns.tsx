import { Plus } from 'lucide-react'
import React from 'react'

type NoColumnProps = {
    setShowCreateModal:(value:boolean)=>void
}

const NoColumns = ({setShowCreateModal}:NoColumnProps) => {
  return (
   <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
              <Plus className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">
              No columns yet
            </h3>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">
              Create your first column to start organizing tasks on this board.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 hover:-translate-y-px transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Column
            </button>
          </div>
  )
}

export default NoColumns