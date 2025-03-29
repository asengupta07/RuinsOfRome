"use client";
import { useAccount, useWriteContract } from "wagmi";
import { gladiatorAddress, gladiatorAbi } from "@/app/abi";

export async function useMintChar(props: any) {
  console.log("Celestial Mint Started");
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const tokenURI = {
    name: "Jupiter, King of Gods",
    description:
      "King of the gods, ruler of the heavens. A tier 1, celestial god commanding lightning and storms.",
    image: "ipfs://[CID-placeholder]/jupiter.png",
  };
  const { newURI } = props;
  const tx = await writeContractAsync({
    abi: gladiatorAbi,
    address: gladiatorAddress,
    functionName: "mintGladiator",
    args: [newURI],
  });
}
