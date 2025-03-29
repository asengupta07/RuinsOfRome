"use client"

import { Scroll, Book, Compass, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { Canvas } from "@react-three/fiber"
import { ScrollControls } from "@react-three/drei"
import Scene3D from "@/components/Scene3D"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4 md:px-8 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
              shadows
              camera={{ position: [0, 0, 5], fov: 45 }}
            >
              <ScrollControls pages={3} damping={0.1}>
                <Scene3D />
              </ScrollControls>
            </Canvas>
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            The History of
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-stone-200 via-stone-100 to-stone-300">
              Sculpture
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto mb-10 leading-relaxed font-serif">
            Journey through time exploring the magnificent artworks that shaped human civilization
          </p>

          <Button className="bg-stone-800 hover:bg-stone-700 text-stone-100 px-8 py-6 rounded-none text-lg font-serif">
            Begin the Journey
          </Button>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative overflow-hidden border border-stone-800 hover:border-stone-700 transition-all">
            <div className="aspect-[4/5] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl font-serif mb-2">Julius Caesar</h3>
              <p className="text-stone-400 mb-4">The Rise of Roman Empire</p>
              <Button variant="outline" className="border-stone-700 text-stone-300">
                Read more →
              </Button>
            </div>
          </div>

          <div className="group relative overflow-hidden border border-stone-800 hover:border-stone-700 transition-all">
            <div className="aspect-[4/5] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl font-serif mb-2">Hannibal of Carthage</h3>
              <p className="text-stone-400 mb-4">The Greatest Enemy of Rome</p>
              <Button variant="outline" className="border-stone-700 text-stone-300">
                Read more →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Archive Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-stone-900/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-stone-800/50 border border-stone-700 mb-6">
            <Scroll className="h-4 w-4 text-stone-400" />
            <span className="text-sm font-medium text-stone-300">Audio archive</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif mb-6">Listen to History</h2>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto mb-10">
            Immerse yourself in the stories of ancient Rome through our curated audio collection
          </p>

          <Button className="bg-stone-800 hover:bg-stone-700 text-stone-100 px-8 py-6 rounded-none text-lg font-serif">
            Browse Archive
          </Button>
        </div>
      </section>
    </div>
  )
}

