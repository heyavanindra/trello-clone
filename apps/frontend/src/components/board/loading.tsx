import React from 'react'

const Loading = () => {
  return (
     <div className="min-h-screen w-full bg-neutral-50 text-neutral-900 p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded mb-2"></div>
            <div className="h-4 w-64 bg-neutral-200 animate-pulse rounded"></div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start h-full">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full md:w-80 h-96 bg-neutral-200 animate-pulse rounded-2xl"
              ></div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default Loading