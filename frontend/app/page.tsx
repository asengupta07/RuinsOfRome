"use client";

import { useEffect, useState, useRef } from "react";
import { Book, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Canvas } from "@react-three/fiber";
import Scene3D from "@/components/Scene3D";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const containerRef = useRef(null);
  const [scrollHeight, setScrollHeight] = useState("300vh"); // Initial height to enable scrolling

  // Update scroll height based on content
  useEffect(() => {
    const updateHeight = () => {
      // Set height to at least 3x viewport height to ensure enough scroll space
      setScrollHeight("300vh");
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Opacity transforms for each section - updated for better fade behavior
  const opacitySection1 = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1, 0] // First section starts fully visible and fades out
  );

  const opacitySection2 = useTransform(
    scrollYProgress,
    [0.2, 0.35, 0.55, 0.7],
    [0, 1, 1, 0] // Second section fades in and out
  );

  const opacitySection3 = useTransform(
    scrollYProgress,
    [0.5, 0.65, 0.9],
    [0, 1, 1] // Third section fades in and stays visible
  );

  // Add opacity transform for footer
  const opacityFooter = useTransform(
    scrollYProgress,
    [0.8, 0.9],
    [0, 1] // Footer fades in and stays visible
  );

  return (
    <div
      ref={containerRef}
      className="bg-[#0a0a0a] text-white relative"
      style={{ height: scrollHeight }}
    >
      <Navbar />
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-10 bg-[url('/fog3.png')] bg-cover"></div>
      </div>

      {/* 3D Background - Fixed position to cover entire scrollable area */}
      <div className="fixed inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <Scene3D />
        </Canvas>
      </div>

      {/* Content Sections - Positioned absolutely over the 3D background */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          style={{ opacity: opacitySection1 }}
          className="h-screen flex items-center justify-center px-4 md:px-8 lg:px-16"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
            >
              Gladiators Rise,
              <span className="block mt-4 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-stone-200 via-stone-100 to-stone-300">
                Legends Are Born
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto mb-10 mt-2 leading-relaxed font-serif"
            >
              Unleash gladiators, earn divine blessings, and conquer the arena
              in a battle of destiny
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Link href="/onboard">
                <Button className="bg-transparent hover:bg-transparent text-stone-100 px-8 py-6 text-lg font-serif relative group overflow-hidden rounded-md border border-stone-700">
                  <span className="relative z-10">Begin the Journey</span>
                  <span className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-10 transition-all duration-300"></span>
                  <span className="absolute inset-0 border border-amber-500 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100"></span>
                  <span className="absolute -inset-1 bg-gradient-to-r from-amber-700 to-amber-500 rounded-md opacity-0 group-hover:opacity-20 blur-md transition-all duration-500"></span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Power of Gods Section */}
        <motion.section
          style={{ opacity: opacitySection2 }}
          className="h-screen flex items-center justify-center px-4 md:px-8 lg:px-16"
        >
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800/50 border rounded-2xl border-stone-700 mb-6">
              <History className="h-4 w-4 text-stone-400" />
              <span className="text-sm font-medium text-stone-300">
                Divine Inspiration
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 font-bold">
              Strategic <span className="text-amber-400">Combat</span>
            </h2>

            <p className="text-lg md:text-xl text-stone-300 max-w-3xl mb-8 leading-relaxed">
              Engage in thrilling turn-based battles against other players or AI opponents. 
              Trade and collect unique gladiators and divine artifacts on the blockchain, 
              while making strategic decisions that shape your destiny in the arena.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-stone-900/50 border rounded-2xl border-stone-800 p-6">
                <h3 className="text-xl font-serif mb-3">Gladiators & Gods</h3>
                <p className="text-stone-400">
                  Engage in strategic turn-based combat where your gladiator&apos;s fate
                  is determined by skill, divine favor, and blockchain-verified battles.
                </p>
              </div>

              <div className="bg-stone-900/50 border rounded-2xl border-stone-800 p-6">
                <h3 className="text-xl font-serif mb-3">Roman Deities</h3>
                <p className="text-stone-400">
                  Call upon the powers of ancient gods to enhance your gladiator&apos;s abilities,
                  with each blessing recorded immutably on the blockchain.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* The Lore Continues Section - Reverted to match other sections */}
        <motion.section
          style={{ opacity: opacitySection3 }}
          className="h-screen flex items-center justify-center px-4 md:px-8 lg:px-16"
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800/50 border rounded-2xl border-stone-700 mb-6">
              <Book className="h-4 w-4 text-stone-400" />
              <span className="text-sm font-medium text-stone-300">
                Eternal Stories
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 font-bold">
              The Lore <span className="text-emerald-400">Continues</span>
            </h2>

            <p className="text-lg md:text-xl text-stone-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Every battle tells a unique story, with dynamic narration and stunning visuals
              bringing your gladiator&apos;s journey to life. Watch as your tactical decisions and
              divine interventions unfold into an epic saga crafted exclusively for you.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <Button className="border border-stone-700 text-white rounded-md relative group overflow-hidden bg-transparent hover:bg-transparent">
                <span className="relative z-10">Explore Mythology</span>
                <span className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-10 transition-all duration-300"></span>
                <span className="absolute inset-0 border border-purple-500 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100"></span>
                <span className="absolute -inset-1 bg-gradient-to-r from-purple-700 to-purple-400 rounded-md opacity-0 group-hover:opacity-20 blur-md transition-all duration-500"></span>
              </Button>
              <Button className="bg-transparent hover:bg-transparent text-stone-100 rounded-md relative group overflow-hidden border border-stone-700">
                <span className="relative z-10">Historical Figures</span>
                <span className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-10 transition-all duration-300"></span>
                <span className="absolute inset-0 border border-emerald-500 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100"></span>
                <span className="absolute -inset-1 bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-md opacity-0 group-hover:opacity-20 blur-md transition-all duration-500"></span>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Footer Section */}
        <motion.footer
          style={{ opacity: opacityFooter }}
          className="absolute bottom-0 left-0 right-0 py-8 px-4 md:px-8 lg:px-16 border-t border-stone-800/50"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-serif font-bold text-stone-200">
                Ruins of Rome
              </h3>
              <p className="text-sm text-stone-400 mt-1">
                Journey through ancient history
              </p>
            </div>

            <div className="text-sm text-stone-500">
              <p>
                © {new Date().getFullYear()} Ruins of Rome. All rights reserved.
              </p>
              <p className="mt-1">A historical exploration experience</p>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
