import Image from "next/image"

interface StoryCardProps {
  image: string
  title: string
  description: string
}

export default function StoryCard({ image, title, description }: StoryCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 group hover:border-purple-500/30 transition-all duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
      <div className="p-6 bg-gradient-to-b from-zinc-900/80 to-black backdrop-blur-sm">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-zinc-400">{description}</p>
      </div>
    </div>
  )
}

