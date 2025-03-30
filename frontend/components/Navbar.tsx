"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
              href="/battle"
              className="text-stone-300 hover:text-white transition-colors"
            >
              Colosseum
            </Link>
            <Link
              href="/chronicles"
              className="text-stone-300 hover:text-white transition-colors"
            >
              Chronicles
            </Link>
            <Link
              href="/about"
              className="text-stone-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <ConnectButton accountStatus="avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-zinc-400 hover:text-white transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xl font-medium text-zinc-200 hover:text-white transition-colors duration-200 py-2 border-b border-white/10"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
