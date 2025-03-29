"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "py-3 bg-black/70 backdrop-blur-xl border-b border-white/10" : "py-5",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <span className="font-bold text-white">eN</span>
          </div>
          <span className="text-xl font-bold">evoNFT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/marketplace">Marketplace</NavLink>
          <NavLink href="/gameplay">Gameplay</NavLink>
          <NavLink href="/stories">Stories</NavLink>
          <NavLink href="/community">Community</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white"
          >
            Sign In
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-black/95 backdrop-blur-lg z-40 p-6">
          <nav className="flex flex-col gap-6 mb-10">
            <MobileNavLink href="/marketplace" onClick={() => setIsMenuOpen(false)}>
              Marketplace
            </MobileNavLink>
            <MobileNavLink href="/gameplay" onClick={() => setIsMenuOpen(false)}>
              Gameplay
            </MobileNavLink>
            <MobileNavLink href="/stories" onClick={() => setIsMenuOpen(false)}>
              Stories
            </MobileNavLink>
            <MobileNavLink href="/community" onClick={() => setIsMenuOpen(false)}>
              Community
            </MobileNavLink>
          </nav>

          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white py-6"
            >
              Sign In
            </Button>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-zinc-400 hover:text-white transition-colors duration-200">
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-xl font-medium text-zinc-200 hover:text-white transition-colors duration-200 py-2 border-b border-white/10"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

