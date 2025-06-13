// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";
import { useMusic } from "@/app/context/MusicContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isPlaying, toggleMusic } = useMusic();
  const pathname = usePathname();
  const isBattlePage = pathname === "/battle";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "bg-black/50 backdrop-blur-sm",
        isBattlePage
          ? "relative"
          : "fixed top-0 left-0 right-0 z-50 border-b border-stone-800"
      )}
    >
      <div className="max-w-full mx-28 px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-serif text-white">
            Ruins of Rome
          </Link>

          <div className="hidden md:flex items-center space-x-8 font-serif">
            <Link
              href="/dashboard"
              className="text-stone-300 hover:text-white transition-colors"
            >
              Your Champion
            </Link>
            <Link
              href="/gods"
              className="text-stone-300 hover:text-white transition-colors"
            >
              Gods & Titans
            </Link>
            <Link
              href="/colosseum"
              className="text-stone-300 hover:text-white transition-colors"
            >
              Colosseum
            </Link>
            <Link
              href="/lore"
              className="text-stone-300 hover:text-white transition-colors"
            >
              Lore
            </Link>
            <Link
              href="/about"
              className="text-stone-300 hover:text-white transition-colors"
            >
              About
            </Link>

            <ConnectButton accountStatus="avatar" chainStatus="none" />

            <Button
              variant="ghost"
              className="text-stone-300 transition-colors p-2"
              onClick={toggleMusic}
            >
              {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
