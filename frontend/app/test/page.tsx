"use client";
import { Button } from "@/components/ui/button";
import { useWriteContract } from "wagmi";
import { celestialAbi, celestialAddress } from "../abi";
import { gladiatorAbi, gladiatorAddress } from "../abi";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const mintTest = () => {
  const { writeContractAsync, status } = useWriteContract();
  const { address } = useAccount();
  const tokenURI = {
    name: "Jupiter, King of Gods",
    description:
      "King of the gods, ruler of the heavens. A tier 1, celestial god commanding lightning and storms.",
    image: "ipfs://[CID-placeholder]/jupiter.png",
    external_url: "https://celestials-collection.example/jupiter",
    attributes: [
      {
        trait_type: "Type",
        value: "God",
      },
      {
        trait_type: "Tier",
        value: 1,
      },
      {
        trait_type: "Attack",
        value: 10,
      },
      {
        trait_type: "Defense",
        value: 8,
      },
      {
        trait_type: "Speed",
        value: 7,
      },
      {
        trait_type: "Primary Spell",
        value: "Lightning",
        spell_power: 95,
      },
      {
        trait_type: "Secondary Spell",
        value: "Smite",
        spell_power: 85,
      },
      {
        trait_type: "Tertiary Spell",
        value: "Tempest",
        spell_power: 90,
      },
      {
        trait_type: "Spell Power",
        value: 31,
      },
    ],
    properties: {
      category: "Celestial",
      elemental_affinity: "Lightning",
      rarity_score: 92,
    },
  };

  const newURI = JSON.stringify(tokenURI);
  const URI = "https://celestials-collection.example/jupiter";
  async function handleCelMint() {
    console.log("Celestial Mint Started");
    const res = await writeContractAsync({
      abi: celestialAbi,
      address: celestialAddress,
      functionName: "mintNFT",
      args: [address, newURI],
      account: address,
    });

    console.log(res);
  }

  async function handleGladMint() {
    console.log("Celestial Mint Started");
    const tx = await writeContractAsync({
      abi: gladiatorAbi,
      address: gladiatorAddress,
      functionName: "mintGladiator",
      args: [URI],
    });

    console.log(tx);
  }

  return (
    <>
      <ConnectButton label="Connect Wallet" />
      <div className="text-white text-center">Testing minting</div>
      <Button onClick={() => handleCelMint()}>Mint Celestial</Button>
      <Button onClick={() => handleGladMint()}>Mint Gladiator</Button>
    </>
  );
};

export default mintTest;
