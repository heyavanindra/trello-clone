import React from 'react'

const CTASection = () => {
  return (
   <section className="py-24 bg-neutral-50 text-center px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">
            Ready to get in sync?
          </h2>
          <p className="text-neutral-500 mb-8">
            Join 10,000+ users organizing their life with SyncTask.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 px-4 rounded-xl border border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
            <button className="h-12 px-6 rounded-xl bg-neutral-900 text-white font-medium shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-neutral-800 transition-colors">
              Get Started
            </button>
          </div>
          <p className="mt-4 text-xs text-neutral-400">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>
  )
}

export default CTASection