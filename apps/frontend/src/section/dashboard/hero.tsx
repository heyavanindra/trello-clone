import { Check, Cloud, Plus } from "lucide-react"

const HeroSection = () => {
  return (
       <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600 mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Now with real-time sync v2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 mb-6">
            Focus on work.<br />
            <span className="text-neutral-400">Let us handle the sync.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A minimalist task manager built for flow. Zero clutter, instant synchronization across all your devices, and a design that gets out of your way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="h-12 px-8 rounded-xl bg-neutral-900 text-neutral-50 font-medium shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              Start for free
            </button>
            <button className="h-12 px-8 rounded-xl bg-white border border-neutral-200 text-neutral-700 font-medium shadow-[0_2px_4px_rgba(0,0,0,0.02),inset_0_-2px_0_rgba(0,0,0,0.02)] hover:bg-neutral-50 transition-colors">
              View Changelog
            </button>
          </div>
        </div>

      
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-linear-to-b from-neutral-200 to-transparent rounded-4xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-neutral-100 rounded-2xl border border-neutral-200 p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]">
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200/50 overflow-hidden min-h-[500px] flex">
              
              {/* Sidebar */}
              <div className="w-64 bg-neutral-50 border-r border-neutral-100 hidden md:flex flex-col p-4">
                <div className="flex items-center gap-2 mb-8 px-2">
                   <div className="h-2 w-2 bg-neutral-300 rounded-full" />
                   <div className="h-2 w-2 bg-neutral-300 rounded-full" />
                   <div className="h-2 w-2 bg-neutral-300 rounded-full" />
                </div>
                <div className="space-y-1">
                  {['Inbox', 'Today', 'Upcoming'].map((item, i) => (
                    <div key={item} className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${i === 0 ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'}`}>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-xs font-semibold text-neutral-400 px-3 mb-2 uppercase tracking-wider">Projects</div>
                <div className="space-y-1">
                  {['Q4 Marketing', 'Design System', 'Personal'].map((item) => (
                    <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neutral-500 hover:bg-neutral-50 cursor-pointer">
                      <div className="w-2 h-2 rounded-sm bg-neutral-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-8">
                  <h3 className="font-semibold text-neutral-800">Today</h3>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Cloud className="w-4 h-4" />
                    <span className="text-xs">Synced</span>
                  </div>
                </div>

                <div className="p-8 space-y-3">
                  <div className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-neutral-100 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all cursor-pointer">
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-200 group-hover:border-neutral-400 transition-colors" />
                    <div className="flex-1">
                      <p className="text-neutral-800 font-medium">Review Q4 roadmap with engineering team</p>
                    </div>
                    <div className="px-2 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-500">10:00 AM</div>
                  </div>

                  <div className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-neutral-100 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all cursor-pointer">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900 border-2 border-neutral-900 text-white">
                      <Check className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-neutral-400 line-through">Finalize design system colors</p>
                    </div>
                  </div>
                   
                   <div className="group flex items-center gap-4 p-4 rounded-xl bg-neutral-50 border border-transparent opacity-60">
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-200" />
                    <div className="flex-1">
                      <p className="text-neutral-600">Prepare keynote slides</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-neutral-400 pl-4 cursor-pointer hover:text-neutral-600 transition-colors">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm font-medium">Add task</span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default HeroSection