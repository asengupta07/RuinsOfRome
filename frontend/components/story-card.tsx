import Image from "next/image"

interface StoryCardProps {
  image: string
  title: string
  description: string
}

export default function StoryCard({ image, title, description }: StoryCardProps) {
  return (
    <div className="group relative overflow-hidden border border-stone-800 hover:border-stone-700 transition-all">
      <div className="aspect-[4/3] relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="text-2xl font-serif mb-2">{title}</h3>
        <p className="text-stone-400">{description}</p>
      </div>
    </div>
  )
}

