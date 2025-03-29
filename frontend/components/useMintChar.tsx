"use client";
import { useWriteContract } from "wagmi";
import { gladiatorAddress, gladiatorAbi } from "@/app/abi";

export function useMintChar() {
  const { writeContractAsync } = useWriteContract();

  const mintChar = async (URI: string) => {
    console.log("Gladiator Mint Started");
    const tx = await writeContractAsync({
      abi: gladiatorAbi,
      address: gladiatorAddress,
      functionName: "mintGladiator",
      args: [URI],
    });
    return tx;
  };

  return mintChar;
}
