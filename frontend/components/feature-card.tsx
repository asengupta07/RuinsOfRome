import { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative border border-stone-800 hover:border-stone-700 transition-all p-8">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-stone-800/50 text-stone-300">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-serif mb-3">{title}</h3>
      <p className="text-stone-400">{description}</p>
    </div>
  )
}

