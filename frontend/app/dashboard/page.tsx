"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useAccount, useReadContract } from "wagmi"
import { gladiatorAbi, gladiatorAddress } from "../abi"
import Navbar from "@/components/Navbar"


export default function Home() {
  const { address } = useAccount();
  const [gladiatorMetadata, setGladiatorMetadata] = useState<any>(null);
  const { data: gladiatorData } = useReadContract({
    abi: gladiatorAbi,
    address: gladiatorAddress,
    functionName: "getGladiatorForPlayer",
    args: [address],
  });

  const processGladiatorData = async (uri: string) => {
    const metadata = await fetch(uri);
    const metadataJson = await metadata.json();
    return metadataJson;
  }

  useEffect(() => {
    const fetchMetadata = async () => {
      if (address && gladiatorData) {
        console.log("Address: ", address);
        console.log("Gladiator Data: ", gladiatorData);
        const uri = gladiatorData.toString();
        try {
          const metadata = await processGladiatorData(uri);
          console.log("Metadata: ", metadata);
          setGladiatorMetadata(metadata);
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      }
    };

    fetchMetadata();

  }, [address, gladiatorData]);
  return (
    <div className="relative min-h-screen bg-[#2a2c31] overflow-hidden">
      <Navbar />
      {/* Background smoke effect */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-30 bg-[url('/fog3.png')] bg-cover"></div>
      </div>

      <div className="relative z-10 pt-20 flex flex-col min-h-screen">

        {/* Main content */}
        <main className="container mx-auto px-6 flex-grow flex flex-col md:flex-row">
          {/* Left content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center py-12">
            <div className="relative">
              <div className="absolute -z-10 text-[#3a3c41] text-[12rem] font-bold leading-none -top-20 -left-6">
                {gladiatorMetadata?.name.toUpperCase()}
              </div>
              <h1 className="text-white text-6xl md:text-7xl font-bold mb-6">{gladiatorMetadata?.name}</h1>
              <p className="text-gray-300 mb-8 max-w-md">
                {gladiatorMetadata?.backstory}
              </p>
              
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 pe-10">
                <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-gray-400 text-sm mb-1">Attack</div>
                  <div className="text-white text-2xl font-bold">{Math.round(gladiatorMetadata?.attackValue)}</div>
                </div>
                <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-gray-400 text-sm mb-1">Defense</div>
                  <div className="text-white text-2xl font-bold">{Math.round(gladiatorMetadata?.defenceValue)}</div>
                </div>
                <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-gray-400 text-sm mb-1">Speed</div>
                  <div className="text-white text-2xl font-bold">{Math.round(gladiatorMetadata?.speedValue)}</div>
                </div>
                <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-gray-400 text-sm mb-1">Gender</div>
                  <div className="text-white text-2xl font-bold capitalize">{gladiatorMetadata?.gender}</div>
                </div>
                <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-gray-400 text-sm mb-1">Moveset</div>
                  <div className="flex flex-wrap gap-2">
                    {gladiatorMetadata?.moveset?.map((move: string, index: number) => (
                      <span key={index} className="text-white text-sm bg-[#2a2c31] px-2 py-1 rounded">
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center md:justify-start">
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="w-full md:w-1/2 relative">

            {/* Main image */}
            <div className="h-full relative py-20">
              <Image
                src={gladiatorMetadata?.imageUrl ?? "/placeholder.svg?height=900&width=600"}
                width={600}
                height={500}
                alt="Deontay Wilder"
                className="h-full object-cover rounded-lg"
                priority
              />
              <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
            </div>

            {/* Vertical text */}
            <div className="absolute top-0 right-0 h-full flex items-center">
              <div className="transform rotate-90 origin-right translate-y-full whitespace-nowrap text-gray-400 text-sm tracking-widest">
                FOR GLORY, SACRIFICE, LOVE AND HONOR
              </div>
            </div>
            <div className="absolute top-0 right-12 h-full flex items-center">
              <div className="transform rotate-90 origin-right translate-y-full whitespace-nowrap text-gray-400 text-sm tracking-widest">
                I WILL GIVE YOU VICTORY
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

