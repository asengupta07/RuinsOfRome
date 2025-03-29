"use client"

import Image from "next/image"
import Link from "next/link"
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

      <div className="relative z-10 pt-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="container mx-auto px-6 py-6 flex justify-between items-center">
          {/* <div className="w-16 h-16">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
              <path
                d="M50,0 C77.6142,0 100,22.3858 100,50 C100,77.6142 77.6142,100 50,100 C22.3858,100 0,77.6142 0,50 C0,22.3858 22.3858,0 50,0 Z M50,20 C33.4315,20 20,33.4315 20,50 C20,66.5685 33.4315,80 50,80 C66.5685,80 80,66.5685 80,50 C80,33.4315 66.5685,20 50,20 Z M65,35 L35,65 M35,35 L65,65"
                stroke="white"
                strokeWidth="5"
                fill="none"
              />
            </svg>
          </div> */}

          {/* <div className="flex gap-6">
            <Link href="#" className="text-white hover:text-gray-300">
              <Twitter size={24} />
            </Link>
            <Link href="#" className="text-white hover:text-gray-300">
              <Instagram size={24} />
            </Link>
          </div> */}

          {/* <button className="text-white">
            <div className="w-8 h-6 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-white"></span>
              <span className="w-full h-0.5 bg-white"></span>
              <span className="w-full h-0.5 bg-white"></span>
            </div>
          </button> */}
        </header>

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
                  <div className="text-white text-2xl font-bold">{gladiatorMetadata?.attackValue}</div>
                </div>
                <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-gray-400 text-sm mb-1">Defense</div>
                  <div className="text-white text-2xl font-bold">{gladiatorMetadata?.defenceValue}</div>
                </div>
                <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-gray-400 text-sm mb-1">Speed</div>
                  <div className="text-white text-2xl font-bold">{gladiatorMetadata?.speedValue}</div>
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

              {/* <Link href="#" className="inline-flex items-center text-white group"> */}
                {/* <span className="mr-2">Learn more</span> */}
                {/* <span className="group-hover:translate-x-1 transition-transform">→</span> */}
              {/* </Link> */}
            </div>

            {/* Last Fights Section */}
            {/* <div className="mt-20">
              <h2 className="text-white text-2xl font-bold mb-6">Last Fights</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Image
                    src={"/placeholder.svg?height=200&width=300"}
                    width={300}
                    height={200}
                    alt="Wilder vs Ortiz 2"
                    className="rounded-md brightness-75"
                  />
                  <p className="absolute bottom-3 left-3 text-white text-sm">Wilder vs Ortiz 2</p>
                </div>
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    width={300}
                    height={200}
                    alt="Wilder vs Briseal"
                    className="rounded-md brightness-75"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <p className="absolute bottom-3 left-3 text-white text-sm">Wilder vs Briseal</p>
                </div>
              </div>
            </div> */}

            {/* Scroll indicator */}
            <div className="mt-12 flex justify-center md:justify-start">
              {/* <div className="animate-bounce">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 5V19M12 19L5 12M12 19L19 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div> */}
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="w-full md:w-1/2 relative">
            {/* Circular text */}
            {/* <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-64 h-64 md:w-80 md:h-80">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <path id="curve" d="M 0,50 A 50,50 0 1 1 100,50 A 50,50 0 1 1 0,50 Z" fill="none" />
                <text fill="white" fontSize="8">
                  <textPath xlinkHref="#curve" startOffset="0%">
                    WBC HEAVYWEIGHT CHAMP OF THE WORLD
                  </textPath>
                </text>
              </svg>
            </div> */}

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
              <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
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

