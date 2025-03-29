"use client"

import { useState, useEffect } from "react"
import { Sparkles, Layers, Brain, Gamepad2, ChevronRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar with glass effect */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/40 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                evoNFT
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#story">Story</NavLink>
              <NavLink href="#nfts">NFTs</NavLink>
              <NavLink href="#roadmap">Roadmap</NavLink>
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-full px-6">
                Connect Wallet
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10 py-4">
            <div className="container mx-auto px-6 flex flex-col gap-4">
              <NavLink href="#features" mobile>
                Features
              </NavLink>
              <NavLink href="#story" mobile>
                Story
              </NavLink>
              <NavLink href="#nfts" mobile>
                NFTs
              </NavLink>
              <NavLink href="#roadmap" mobile>
                Roadmap
              </NavLink>
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-full px-6 w-full">
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">AI-Powered Gaming Experience</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Evolve. Play. Collect.
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mb-10 leading-relaxed">
              Experience the next generation of gaming with AI-driven narratives and evolving NFTs that adapt to your
              gameplay. Your decisions shape your unique story.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-full px-8 py-6 text-lg">
                Start Your Journey
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-6 text-lg"
              >
                Explore NFTs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-black to-purple-950/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Revolutionary Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with blockchain technology to create a truly unique gaming
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-purple-400" />}
              title="AI Storytelling"
              description="Dynamic narratives that evolve based on your choices and gameplay style, creating a unique story for every player."
            />
            <FeatureCard
              icon={<Layers className="h-8 w-8 text-cyan-400" />}
              title="Evolving NFTs"
              description="Your NFTs grow and change as you progress, reflecting your journey and increasing in value and abilities."
            />
            <FeatureCard
              icon={<Gamepad2 className="h-8 w-8 text-pink-400" />}
              title="Immersive Gameplay"
              description="Seamless integration of storytelling and gameplay mechanics for an engaging and rewarding experience."
            />
          </div>
        </div>
      </section>

      {/* Visual Storytelling Section */}
      <section id="story" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Story, Your NFTs</h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Every decision you make shapes your unique narrative. As your story unfolds, your NFTs evolve, gaining
                new abilities and visual elements that reflect your journey.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                No two players will have the same experience or collection, making each NFT truly one-of-a-kind in both
                appearance and functionality.
              </p>
              <Button className="group flex items-center gap-2 bg-transparent hover:bg-white/5 text-white border border-white/20 rounded-full px-6 py-3">
                Discover the Possibilities
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/10 p-1">
                <div className="w-full h-full rounded-xl overflow-hidden bg-black/50 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=400"
                    alt="Evolving NFT Visualization"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 p-1">
                <div className="w-full h-full rounded-lg overflow-hidden bg-black/50">
                  <img
                    src="/placeholder.svg?height=120&width=120"
                    alt="NFT Detail"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/30 to-cyan-900/30 backdrop-blur-md border border-white/10 p-1">
            <div className="bg-black/60 rounded-2xl p-8 md:p-12">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                  Join the waitlist today and be among the first to experience the future of AI-driven gaming and NFT
                  evolution.
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-full px-8 py-6 text-lg">
                  Join the Waitlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
// Helper Components
function NavLink({ href, children, mobile = false }: { href: string, children: React.ReactNode, mobile?: boolean }) {
  return (
    <a href={href} className={`text-gray-300 hover:text-white transition-colors ${mobile ? "py-2 block" : ""}`}>
      {children}
    </a>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-1 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]">
      <div className="bg-black/60 rounded-xl p-6 h-full">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}