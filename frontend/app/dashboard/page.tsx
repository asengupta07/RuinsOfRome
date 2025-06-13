"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { gladiatorAbi, gladiatorAddress } from "../abi";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { address } = useAccount();
  const [gladiatorMetadata, setGladiatorMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: gladiatorData,
    isLoading: isContractLoading,
    error: contractError,
  } = useReadContract<
    typeof gladiatorAbi,
    "getGladiatorForPlayer",
    [address: `0x${string}`]
  >({
    abi: gladiatorAbi,
    address: gladiatorAddress,
    functionName: "getGladiatorForPlayer",
    args: [address],
  });

  const processGladiatorData = async (uri: string) => {
    const metadata = await fetch(uri);
    const metadataJson = await metadata.json();
    return metadataJson;
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      if (address && gladiatorData) {
        setLoading(true);
        setError(null);
        console.log("Address: ", address);
        console.log("Gladiator Data: ", gladiatorData);
        const uri = (gladiatorData as [any, string])[1].toString();
        try {
          const metadata = await processGladiatorData(uri);
          console.log("Metadata: ", metadata);
          setGladiatorMetadata(metadata);
        } catch (error) {
          console.error("Error fetching metadata:", error);
          setError("Failed to load gladiator metadata");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMetadata();
  }, [address, gladiatorData]);

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-white text-sm">Loading...</div>
        </div>
      </div>
    </div>
  );

  // Skeleton loader for stats
  const StatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 pe-10">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm animate-pulse"
        >
          <div className="h-4 bg-gray-600 rounded mb-2"></div>
          <div className="h-8 bg-gray-600 rounded"></div>
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorDisplay = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
        <p className="text-white mb-4">{error || "Something went wrong"}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Check if we're in any loading state
  const isLoading = isContractLoading || loading;

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
          {/* Show error if there's a contract error or metadata error */}
          {(contractError || error) && !isLoading && <ErrorDisplay />}

          {/* Show loading state */}
          {isLoading && !error && (
            <div className="w-full flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}

          {/* Show content when loaded and no errors */}
          {!isLoading && !error && gladiatorMetadata && (
            <>
              {/* Left content */}
              <div className="w-full md:w-1/2 flex flex-col justify-center py-12">
                <div className="relative">
                  <div className="absolute -z-10 text-[#3a3c41] text-[12rem] font-bold leading-none -top-20 -left-6">
                    {gladiatorMetadata?.name?.toUpperCase()}
                  </div>
                  <h1 className="text-white text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
                    {gladiatorMetadata?.name}
                  </h1>
                  <p className="text-gray-300 mb-8 max-w-md animate-fade-in-delay">
                    {gladiatorMetadata?.backstory}
                  </p>

                  {/* Stats Section */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 pe-10">
                    <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm animate-slide-up">
                      <div className="text-gray-400 text-sm mb-1">Attack</div>
                      <div className="text-white text-2xl font-bold">
                        {Math.round(gladiatorMetadata?.attackValue)}
                      </div>
                    </div>
                    <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm animate-slide-up-delay-1">
                      <div className="text-gray-400 text-sm mb-1">Defense</div>
                      <div className="text-white text-2xl font-bold">
                        {Math.round(gladiatorMetadata?.defenceValue)}
                      </div>
                    </div>
                    <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm animate-slide-up-delay-2">
                      <div className="text-gray-400 text-sm mb-1">Speed</div>
                      <div className="text-white text-2xl font-bold">
                        {Math.round(gladiatorMetadata?.speedValue)}
                      </div>
                    </div>
                    <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm animate-slide-up-delay-3">
                      <div className="text-gray-400 text-sm mb-1">Gender</div>
                      <div className="text-white text-2xl font-bold capitalize">
                        {gladiatorMetadata?.gender}
                      </div>
                    </div>
                    <div className="bg-[#3a3c41]/50 p-4 rounded-lg backdrop-blur-sm animate-slide-up-delay-4">
                      <div className="text-gray-400 text-sm mb-1">Moveset</div>
                      <div className="flex flex-wrap gap-2">
                        {gladiatorMetadata?.moveset?.map(
                          (move: string, index: number) => (
                            <span
                              key={index}
                              className="text-white text-sm bg-[#2a2c31] px-2 py-1 rounded"
                            >
                              {move}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-center md:justify-start"></div>
              </div>

              {/* Right content - Hero image */}
              <div className="w-full md:w-1/2 relative">
                {/* Main image */}
                <div className="h-full relative py-20">
                  <div className="relative h-full">
                    <Image
                      src={
                        gladiatorMetadata?.image ??
                        "/placeholder.svg?height=900&width=600"
                      }
                      width={600}
                      height={500}
                      alt={gladiatorMetadata?.name || "Gladiator"}
                      className="h-full object-cover rounded-lg animate-fade-in-slow"
                      priority
                      onLoad={() => console.log("Image loaded")}
                    />
                    <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
                  </div>
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
            </>
          )}

          {/* Show placeholder when no wallet connected */}
          {!address && !isLoading && (
            <div className="w-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 text-xl mb-4">🏛️</div>
                <p className="text-white text-xl mb-4">
                  Connect your wallet to view your gladiator
                </p>
                <p className="text-gray-400">
                  Your gladiator awaits in the arena
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add these styles to your global CSS or create a separate CSS module */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-slow {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-up-delay-1 {
          animation: slide-up 0.6s ease-out 0.1s both;
        }

        .animate-slide-up-delay-2 {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-slide-up-delay-3 {
          animation: slide-up 0.6s ease-out 0.3s both;
        }

        .animate-slide-up-delay-4 {
          animation: slide-up 0.6s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
}
