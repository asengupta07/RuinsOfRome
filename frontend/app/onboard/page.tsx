"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield, Sword } from "lucide-react";
import { useMintChar } from "@/components/useMintChar";
import { useAccount, useReadContract } from "wagmi";
import { gladiatorAbi, gladiatorAddress } from "../abi";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

export default function GladiatorOnboarding() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [isMinting, setIsMinting] = useState(false);
  const [mintURI, setMintURI] = useState("");
  const [claimed, setClaimed] = useState(false);
  const { address } = useAccount();
  const mintChar = useMintChar();

  const { data, refetch: refetchClaimBool } = useReadContract({
    abi: gladiatorAbi,
    address: gladiatorAddress,
    functionName: "hasClaimedNFT",
    args: [address],
  });

  useEffect(() => {
    console.log(
      "Setting up refetch interval for fetching if gladiator alr claimed:"
    );

    const interval = setInterval(() => {
      refetchClaimBool()
        .then((result: any) => {
          console.log("Result: ", result);
          setClaimed(true);
        })
        .catch((error: any) => {
          console.error("Error during refetch: ", error);
        });
    }, 5000);

    return () => {
      console.log("Clearing refetch interval.\n");
      clearInterval(interval);
    };
  }, [refetchClaimBool]);

  async function handleMint() {
    console.log("Minting...");
    // if (!claimed) {
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
      const pinataRes = await pinata.upload.json(data);
      const ipfsUrl = `https://ipfs.io/ipfs/${pinataRes.IpfsHash}`;
      console.log("File uploaded to IPFS:", ipfsUrl);

      if (data.success) {
        console.log("Minting successful!");
        setMintURI(data);
        const mintData = await mintChar(ipfsUrl);
        console.log("Minting data:", mintData);
        if (mintData) {
          console.log("Minting completed successfully!");
        }
        setIsMinting(false);
      }
    } catch (error) {
      console.error("Error minting gladiator:", error);
      setIsMinting(false);
    }
    // } else {
    //   console.error("Error: Already Claimed.");
    // }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0b060a]">
      {/* Background Images */}
      <div className="absolute inset-0 z-0 flex mx-10 ">
        <div
          className="flex-1 bg-contain bg-left bg-no-repeat"
          style={{
            backgroundImage: `url('/nymph.jpg')`,
          }}
        />
        <div
          className="flex-1 bg-contain bg-left bg-no-repeat"
          style={{
            backgroundImage: `url('/nymph.jpg')`,
            transform: "scaleX(-1)", // Flip the image horizontally
          }}
        />
      </div>

      {/* Decorative overlay */}
      <div className="absolute inset-0  z-0" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-300 mb-2 tracking-wide">
            FORGE YOUR CHAMPION
          </h1>
          <p className="text-teal-100 text-lg">
            Enter the Colosseum and claim your glory
          </p>
        </div>

        <div className="bg-stone-900/80 border-2 border-teal-700 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4">
              <Sword className="h-8 w-8 text-teal-500" />
              <Shield className="h-8 w-8 text-teal-500" />
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
                className="bg-stone-800 border-teal-700 text-teal-100 focus:ring-teal-500 focus:border-teal-500"
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
                <div className="flex items-center space-x-2 bg-stone-800 p-3 rounded-md border border-teal-700/50 flex-1 cursor-pointer hover:bg-stone-700 transition-colors">
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
                <div className="flex items-center space-x-2 bg-stone-800 p-3 rounded-md border border-teal-700/50 flex-1 cursor-pointer hover:bg-stone-700 transition-colors">
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
              className="w-full bg-teal-700 hover:bg-teal-600 text-teal-100 py-6 text-lg font-bold tracking-wider"
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

      {/* Minting Overlay */}
      {isMinting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center p-8 max-w-md">
            <div className="animate-pulse mb-6">
              <div className="h-24 w-24 mx-auto rounded-full bg-teal-500/20 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-teal-500/40 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-teal-500/60" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-teal-300 mb-4">
              GAIA FORGES YOUR CHAMPION
            </h2>
            <p className="text-teal-100 text-lg">
              The Earth Mother breathes life into your gladiator. Soon you will
              enter the arena and write your legend in blood and glory.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
