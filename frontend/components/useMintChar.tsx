"use client";
import { useAccount, useWriteContract } from "wagmi";
import { gladiatorAddress, gladiatorAbi } from "@/app/abi";

export function useMintChar() {
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  const mintChar = async (newURI: string) => {
    console.log("Gladiator Mint Started");
    const tx = await writeContractAsync({
      abi: gladiatorAbi,
      address: gladiatorAddress,
      functionName: "mintGladiator",
      args: [newURI],
    });
    return tx;
  };

  return mintChar;
}
