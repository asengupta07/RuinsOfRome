"use client";

import { useEffect, useState, useRef } from "react";
import { Book, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Canvas } from "@react-three/fiber";
import Scene3D from "@/components/Scene3D";
import { motion, useScroll, useTransform } from "framer-motion";

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

  // Opacity transforms for each section
  const opacitySection1 = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3],
    [1, 1, 0]
  );
  const opacitySection2 = useTransform(
    scrollYProgress,
    [0.2, 0.3, 0.5, 0.6],
    [0, 1, 1, 0]
  );
  const opacitySection3 = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.8, 0.9],
    [0, 1, 1, 0]
  );

  return (
    <div
      ref={containerRef}
      className="bg-[#0a0a0a] text-white relative"
      style={{ height: scrollHeight }}
    >
      <Navbar />

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
              The History of
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-stone-200 via-stone-100 to-stone-300">
                Sculpture
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto mb-10 leading-relaxed font-serif"
            >
              Journey through time exploring the magnificent artworks that
              shaped human civilization
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Button className="bg-stone-800 hover:bg-stone-700 text-stone-100 px-8 py-6 rounded-none text-lg font-serif">
                Begin the Journey
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Power of Gods Section */}
        <motion.section
          style={{ opacity: opacitySection2 }}
          className="h-screen flex items-center justify-center px-4 md:px-8 lg:px-16"
        >
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-stone-800/50 border border-stone-700 mb-6">
              <History className="h-4 w-4 text-stone-400" />
              <span className="text-sm font-medium text-stone-300">
                Divine Inspiration
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 font-bold">
              The Power of <span className="text-amber-400">Gods</span>
            </h2>

            <p className="text-lg md:text-xl text-stone-300 max-w-3xl mb-8 leading-relaxed">
              Ancient sculptors captured the essence of divinity, creating
              timeless representations of gods and goddesses that embodied the
              ideals and aspirations of their civilizations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-stone-900/50 border border-stone-800 p-6">
                <h3 className="text-xl font-serif mb-3">Zeus & Olympians</h3>
                <p className="text-stone-400">
                  The Greek pantheon inspired some of the most magnificent
                  sculptures in human history, defining classical aesthetics.
                </p>
              </div>

              <div className="bg-stone-900/50 border border-stone-800 p-6">
                <h3 className="text-xl font-serif mb-3">Egyptian Deities</h3>
                <p className="text-stone-400">
                  From Anubis to Osiris, Egyptian sculptors created stylized yet
                  powerful representations of their complex pantheon.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* The Lore Continues Section */}
        <motion.section
          style={{ opacity: opacitySection3 }}
          className="h-screen flex items-center justify-center px-4 md:px-8 lg:px-16"
        >
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-stone-800/50 border border-stone-700 mb-6">
              <Book className="h-4 w-4 text-stone-400" />
              <span className="text-sm font-medium text-stone-300">
                Eternal Stories
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 font-bold">
              The Lore <span className="text-emerald-400">Continues</span>
            </h2>

            <p className="text-lg md:text-xl text-stone-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              From ancient myths to historical events, sculptors have preserved
              our collective stories in stone and bronze, creating a tangible
              connection to our shared past.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                className="border-stone-700 text-stone-300 rounded-none"
              >
                Explore Mythology
              </Button>
              <Button className="bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-none">
                Historical Figures
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
