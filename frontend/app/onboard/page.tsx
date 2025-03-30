"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield, Sword, Wallet } from "lucide-react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { gladiatorAbi, gladiatorAddress } from "../abi";
import { PinataSDK } from "pinata-web3";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

export default function GladiatorOnboarding() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [isMinting, setIsMinting] = useState(false);
  const [mintURI, setMintURI] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [userAddress, setUserAddress] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data, refetch: refetchClaimBool } = useReadContract({
    abi: gladiatorAbi,
    address: gladiatorAddress,
    functionName: "hasClaimedNFT",
    args: [address],
  });

  useEffect(() => {
    setUserAddress(address);
  }, [address]);

  useEffect(() => {
    // Set the loaded state after a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log(
      "Setting up refetch interval for fetching if gladiator alr claimed:"
    );

    const interval = setInterval(() => {
      refetchClaimBool()
        .then((result: any) => {
          console.log("Claim check result: ", result);
          setClaimed(result);
        })
        .catch((error: any) => {
          console.error("Error during claim check: ", error);
          setClaimed(false);
        });
    }, 5000);

    return () => {
      console.log("Clearing refetch interval.\n");
      clearInterval(interval);
    };
  }, [refetchClaimBool]);

  async function handleMint() {
    console.log("Minting...");
    // if (claimed) {
    //   console.error("Error: Already Claimed.");
    //   return;
    // }

    setIsMinting(true);
    try {
      const res = await fetch("/api/gladiator/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, gender }),
      });
      const data = await res.json();
      console.log("Backend response:", data);

      if (!data.success) {
        throw new Error("Failed to generate gladiator data");
      }

      const pinataRes = await pinata.upload.json(data);
      const ipfsUrl = `https://ipfs.io/ipfs/${pinataRes.IpfsHash}`;
      console.log("File uploaded to IPFS:", ipfsUrl);

      setMintURI(ipfsUrl);

      const celRes = await fetch("/api/celestial/init", {
        method: "GET",
      });

      const celData = await celRes.json();
      console.log("Initial Gods:", celData);

      if (!celData) {
        throw new Error("Failed to generate intial god data");
      }

      // Mint celestial NFTs sequentially
      for (const god of celData) {
        const res = await fetch("/api/celestial/mintInit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: god.name,
            description: god.description,
            imageUrl: god.image,
            attributes: god.attributes,
            properties: god.properties,
            address: address,
          }),
        });

        const data = await res.json();
        console.log("Server Response:", data);

        // Add a small delay between transactions to ensure proper sequencing
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const tx = await writeContractAsync({
        abi: gladiatorAbi,
        address: gladiatorAddress,
        functionName: "mintGladiator",
        args: [ipfsUrl],
      });
      console.log("Minting transaction:", tx);
      if (tx) {
        console.log("Minting completed successfully!");
        // The transaction hash is returned, we can use it to track the transaction
        console.log("Transaction hash:", tx);
        setIsMinting(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error minting gladiator:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsMinting(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0b060a]">
      {/* Background Images with animations */}
      <div className="absolute inset-0 z-0 flex mx-10 ">
        <div
          className={`flex-1 bg-contain bg-left bg-no-repeat transition-all duration-1000 ease-out 
                        ${isLoaded ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: `url('/nymph.jpg')`,
          }}
        />
        <div
          className={`flex-1 bg-contain bg-left bg-no-repeat transition-all duration-1000 ease-out 
                        ${isLoaded ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: `url('/nymph.jpg')`,
            transform: "scaleX(-1)",
          }}
        />
      </div>

      {/* Decorative overlay with subtle breathing animation */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#0b060a]/0 via-[#0b060a]/50 to-[#0b060a]/0"
        style={{
          animation: "breathe 8s ease-in-out infinite",
        }}
      />

      {/* Content with fade-in animation */}
      <div
        className={`relative z-10 w-full max-w-md px-6 py-12 transition-all duration-1000 ease-out ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-300 mb-2 tracking-wide animate-pulse-slow">
            FORGE YOUR CHAMPION
          </h1>
          <p className="text-teal-100 text-lg">
            Enter the Colosseum and claim your glory
          </p>
        </div>

        <div className="bg-stone-900/80 border-2 border-teal-700 rounded-lg p-6 backdrop-blur-sm transition-all duration-500 hover:border-teal-500">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4">
              <Sword className="h-8 w-8 text-teal-500 animate-swing" />
              <Shield className="h-8 w-8 text-teal-500 animate-pulse-slow" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-teal-200 text-lg">
                Gladiator Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-stone-800 border-teal-700 text-teal-100 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 focus:scale-102"
                placeholder="Enter your gladiator's name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-teal-200 text-lg">Choose Your Path</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 bg-stone-800 p-3 rounded-md border border-teal-700/50 flex-1 cursor-pointer hover:bg-stone-700 transition-colors hover:border-teal-500">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    className="text-teal-500"
                  />
                  <Label
                    htmlFor="male"
                    className="text-teal-100 cursor-pointer"
                  >
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-stone-800 p-3 rounded-md border border-teal-700/50 flex-1 cursor-pointer hover:bg-stone-700 transition-colors hover:border-teal-500">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="text-teal-500"
                  />
                  <Label
                    htmlFor="female"
                    className="text-teal-100 cursor-pointer"
                  >
                    Female
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              onClick={handleMint}
              disabled={!name || isMinting}
              className="w-full bg-teal-700 hover:bg-teal-600 text-teal-100 py-6 text-lg font-bold tracking-wider transition-all duration-300 hover:scale-102 hover:shadow-glow"
            >
              CLAIM YOUR CHAMPION
            </Button>
          </div>
        </div>

        <div className="text-center mt-4 text-teal-200/70 text-sm">
          By forging your gladiator, you agree to the laws of Rome and the will
          of the gods
        </div>
      </div>

      {/* Minting Overlay with enhanced animations */}
      {isMinting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="text-center p-8 max-w-md animate-scaleIn">
            <div className="mb-6 relative">
              <div className="h-24 w-24 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center animate-spin-slow">
                <div className="h-16 w-16 rounded-full bg-teal-500/40 flex items-center justify-center animate-pulse-slow">
                  <div className="h-8 w-8 rounded-full bg-teal-500/60 animate-pulse" />
                </div>
              </div>
              <div className="absolute h-32 w-32 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-teal-500/30 rounded-full animate-ping-slow" />
            </div>
            <h2 className="text-3xl font-bold text-teal-300 mb-4 animate-glow">
              GAIA IS FORGING YOUR CHAMPION
            </h2>
            <p className="text-teal-100 text-lg">
              The Earth Mother breathes life into your gladiator. Soon you will
              enter the arena and write your legend in blood and glory.
            </p>
          </div>
        </div>
      )}

      {/* Wallet Connection Overlay with animations */}
      {!userAddress && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-stone-900/90 border-2 border-teal-700 rounded-lg p-8 max-w-md text-center animate-scaleIn">
            <Wallet className="h-16 w-16 text-teal-500 mx-auto mb-4 animate-float" />
            <h2 className="text-3xl font-bold text-teal-300 mb-3">
              CONNECT YOUR WALLET
            </h2>
            <p className="text-teal-100 text-lg mb-6">
              To forge your champion and enter the Colosseum, you must first
              connect your wallet.
            </p>
            <div className="flex justify-center animate-pulse-slow">
              <ConnectButton />
            </div>
            <p className="text-teal-200/70 text-sm mt-4">
              Your glory awaits behind the veil of the blockchain
            </p>
          </div>
        </div>
      )}

      {/* Add global styles for custom animations */}
      <style jsx global>{`
        @keyframes breathe {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 5px rgba(20, 184, 166, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(20, 184, 166, 0.8);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes swing {
          0%,
          100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          70%,
          100% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-swing {
          animation: swing 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        .hover\:shadow-glow:hover {
          box-shadow: 0 0 15px rgba(20, 184, 166, 0.5);
        }
      `}</style>
    </div>
  );
}
