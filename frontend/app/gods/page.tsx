"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { celestialAbi, celestialAddress } from "@/app/abi";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

// Sample data
// const godsData = [
//   {
//     "name": "flora",
//     "description": "Goddess of flowers and spring.",
//     "image": "https://corcel.b-cdn.net/e2691b4f-185d-4450-a964-2881eeaace4d.webp",
//     "attributes": [
//       {
//         "trait_type": "Type",
//         "value": "god"
//       },
//       {
//         "trait_type": "Tier",
//         "value": 3
//       },
//       {
//         "trait_type": "heal",
//         "value": 7
//       },
//       {
//         "trait_type": "poison",
//         "value": 7
//       }
//     ],
//     "properties": {
//       "category": "celestial",
//       "rarity_score": 24
//     }
//   },
//   {
//     "name": "fortuna",
//     "description": "Goddess of luck and fortune.",
//     "image": "https://corcel.b-cdn.net/361e57e5-0b0b-4ea4-a2d6-35eb17a27086.webp",
//     "attributes": [
//       {
//         "trait_type": "Type",
//         "value": "god"
//       },
//       {
//         "trait_type": "Tier",
//         "value": 3
//       },
//       {
//         "trait_type": "fortune",
//         "value": 9
//       },
//       {
//         "trait_type": "tempest",
//         "value": 7
//       }
//     ],
//     "properties": {
//       "category": "celestial",
//       "rarity_score": 21
//     }
//   },
//   {
//     "name": "saturn",
//     "description": "God of time and agriculture.",
//     "image": "https://corcel.b-cdn.net/fa7206f1-81c8-4958-8936-397b1f383435.webp",
//     "attributes": [
//       {
//         "trait_type": "Type",
//         "value": "god"
//       },
//       {
//         "trait_type": "Tier",
//         "value": 3
//       },
//       {
//         "trait_type": "wisdom",
//         "value": 8
//       },
//       {
//         "trait_type": "rewind",
//         "value": 7
//       }
//     ],
//     "properties": {
//       "category": "celestial",
//       "rarity_score": 24
//     }
//   }
// ]
let godsData: any[] = [];
type God = (typeof godsData)[0];
type Attribute = God["attributes"][0];

export default function Home() {
  const { address } = useAccount();
  const { data: celestialData } = useReadContract({
    abi: celestialAbi,
    address: celestialAddress,
    functionName: "getNFTs",
    args: [address],
  }) as any;

  if (celestialData) {
    console.log("celestialData", celestialData);
    godsData = celestialData[0].map((json: string) => JSON.parse(json));
  }

  const [selectedGodIndex, setSelectedGodIndex] = useState(0);
  const selectedGod = godsData[selectedGodIndex];

  const nextGod = () => {
    setSelectedGodIndex((prev) => (prev + 1) % godsData.length);
  };

  const prevGod = () => {
    setSelectedGodIndex(
      (prev) => (prev - 1 + godsData.length) % godsData.length
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#000000] to-[#000000] overflow-hidden">
      <Navbar />
      {/* Background effects */}
      <div className="absolute -z-10 inset-0">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${selectedGod?.image})`,
            filter: "blur(20px)",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#000000] opacity-70"></div>
      </div>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-30 bg-[url('/fog3.png?height=1080&width=1920')] bg-cover"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#000000] opacity-80"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              // width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 pt-24 px-4">
        <div className="container mx-auto">
          <h1 className="text-white text-center text-3xl md:text-4xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-white font-bold text-4xl md:text-5xl">
              Your Patreon Gods & Titans
            </span>
          </h1>
          <p className="text-center text-gray-400 mt-2 max-w-xl mx-auto text-sm">
            Explore the divine beings that have bestowed their blessings and
            favour upon your champion!
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-4 flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGod?.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            {/* God image container */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-900 to-gray-600 rounded-lg opacity-75 blur-sm"></div>
              <div className="relative w-[300px] h-[400px] lg:w-[400px] lg:h-[500px] rounded-lg overflow-hidden bg-gray-800">
                <Image
                  src={selectedGod?.image || "/fog3.png"}
                  alt={selectedGod?.name || "God"}
                  fill
                  className="object-cover"
                  priority
                  sizes="400px"
                  quality={90}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-[#000000] opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] to-transparent opacity-90"></div>

                {/* Tier indicator */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 text-xs uppercase font-semibold">
                      Tier
                    </span>
                    <div className="flex">
                      {Array.from({
                        length: Number(
                          selectedGod?.attributes.find(
                            (a: { trait_type: string }) =>
                              a.trait_type === "Tier"
                          )?.value || 0
                        ),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <span className="text-amber-400 text-xs uppercase font-semibold">
                    {
                      selectedGod?.attributes.find(
                        (a: { trait_type: string }) => a.trait_type === "Type"
                      )?.value
                    }
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            key={`details-${selectedGod?.name}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <div className="relative">
              <div className="absolute -z-10 text-[#1e1e2d] text-[12rem] font-bold leading-none -top-20 -left-6 opacity-60">
                {selectedGod?.name.toUpperCase()}
              </div>

              <h2 className="text-white text-6xl md:text-7xl font-bold mb-4 capitalize">
                {selectedGod?.name}
              </h2>

              <p className="text-gray-300 mb-8 max-w-lg text-lg">
                {selectedGod?.description}
              </p>

              {/* Attributes Section */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {selectedGod?.attributes
                  .filter(
                    (attr: { trait_type: string }) =>
                      attr.trait_type !== "Type" && attr.trait_type !== "Tier"
                  )
                  .map((attr: { trait_type: string }) => (
                    <AttributeCard key={attr.trait_type} attribute={attr} />
                  ))}
              </div>

              {/* Rarity score */}
              <div className="bg-gradient-to-r from-gray-900/40 to-transparent p-4 rounded-lg backdrop-blur-sm border border-purple-500/20 mb-8">
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">Rarity Score</div>
                  <div className="text-amber-400 text-2xl font-bold">
                    {selectedGod?.properties.rarity_score}
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-700/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-amber-500 h-2 rounded-full"
                    style={{
                      width: `${(selectedGod?.properties.rarity_score / 30) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* God selector */}
      <div className="relative z-10 container mx-auto px-4 pb-8">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={prevGod}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-amber-900/50 transition-colors border border-gray-700 hover:border-amber-500"
          >
            <ChevronLeft className="text-white" />
          </button>

          <div className="flex gap-3">
            {godsData.map((god, index) => (
              <button
                key={god.name}
                onClick={() => setSelectedGodIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === selectedGodIndex
                    ? "bg-amber-400 scale-125"
                    : "bg-gray-600 hover:bg-gray-400"
                }`}
                aria-label={`Select ${god.name}`}
              />
            ))}
          </div>

          <button
            onClick={nextGod}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-amber-900/50 transition-colors border border-gray-700 hover:border-amber-500"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>

        {/* God thumbnails */}
        <div className="mt-4 flex justify-center gap-2">
          {godsData.map((god, index) => (
            <button
              key={god.name}
              onClick={() => setSelectedGodIndex(index)}
              className={`relative px-5 group ${
                index === selectedGodIndex
                  ? "scale-110 z-10"
                  : "opacity-70 hover:opacity-100"
              } transition-all duration-300`}
            >
              {/* <div className={`absolute -inset-1 rounded-lg ${
                index === selectedGodIndex 
                  ? "bg-gradient-to-r from-amber-400 to-purple-600 opacity-100" 
                  : "bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-amber-400/50 group-hover:to-purple-600/50"
              } blur-sm transition-all`}></div> */}
              <div className="relative px-5 w-20 h-20 md:w-20 md:h-20 rounded-lg overflow-hidden">
                <Image
                  src={god.image || "/fog3.png"}
                  alt={god.name || "God"}
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className={`absolute -bottom-6 left-0 right-0 text-center text-xs font-medium capitalize ${
                  index === selectedGodIndex
                    ? "text-amber-400"
                    : "text-gray-400"
                }`}
              >
                {god.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

function AttributeCard({ attribute }: { attribute: Attribute }) {
  const getAttributeColor = (type: string) => {
    const colors = {
      heal: "from-green-600 to-emerald-400",
      poison: "from-purple-600 to-fuchsia-400",
      fortune: "from-amber-600 to-yellow-400",
      tempest: "from-blue-600 to-cyan-400",
      wisdom: "from-indigo-600 to-blue-400",
      rewind: "from-rose-600 to-pink-400",
      default: "from-gray-600 to-gray-400",
    };

    return colors[type as keyof typeof colors] || colors.default;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4">
        {/* <div className="text-gray-400 text-sm mb-1 capitalize">{attribute.trait_type}</div> */}
        <div className="flex items-center justify-between">
          <div className="text-white text-2xl font-bold">
            {attribute.trait_type.charAt(0).toUpperCase() +
              attribute.trait_type.slice(1)}
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 h-4 rounded-sm ${
                  i < Number(attribute.value)
                    ? `bg-gradient-to-t ${getAttributeColor(attribute.trait_type)}`
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
        <div
          className={`h-1 bg-gradient-to-r ${getAttributeColor(attribute.trait_type)}`}
        ></div>
      </div>
    </div>
  );
}
