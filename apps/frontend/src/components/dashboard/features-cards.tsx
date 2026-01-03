// Reusable Feature Card Component to keep code clean
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="group p-8 rounded-2xl bg-neutral-50 border border-neutral-100 transition-all duration-300
      hover:bg-white hover:border-neutral-200 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]
      shadow-[inset_0_1px_0_rgba(255,255,255,1)]"
    >
      <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-3">{title}</h3>
      <p className="text-neutral-500 leading-relaxed">{description}</p>
    </div>
  );
}
export default FeatureCard;