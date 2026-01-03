import FeatureCard from '@/components/dashboard/features-cards'
import { Layout, Users, Zap } from 'lucide-react'

const Features = () => {
  return (
      <section
        id="features"
        className="py-24 bg-white border-t border-neutral-100"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-neutral-700" />}
              title="Real-time Sync"
              description="Changes reflect instantly on your phone, tablet, and desktop. No refresh buttons, ever."
            />
            <FeatureCard
              icon={<Layout className="w-6 h-6 text-neutral-700" />}
              title="Focus Mode"
              description="A clutter-free interface that lets you zero in on what matters most: your current task."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6 text-neutral-700" />}
              title="Team Collaboration"
              description="Share lists and assign tasks seamlessly. Perfect for small teams moving fast."
            />
          </div>
        </div>
      </section>
  )
}

export default Features