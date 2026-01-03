
const ValueSection = () => {
  return (
        <section className="py-32 bg-neutral-900 text-neutral-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#404040 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            Stop managing the tool.
            <br />
            Start managing the work.
          </h2>
          <p className="text-neutral-400 text-lg mb-12 max-w-xl mx-auto">
            Most task managers are too complex. We removed the features you
            don't need so the ones you do use feel magical.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-3xl mx-auto">
            {[
              { label: "Latency", value: "< 50ms" },
              { label: "Uptime", value: "99.9%" },
              { label: "Platforms", value: "All" },
              { label: "Price", value: "$0 / mo" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500 font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default ValueSection