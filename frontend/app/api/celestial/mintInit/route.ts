import { NextResponse, NextRequest } from "next/server";
import { ethers } from "ethers";
import { celestialAbi, celestialAddress } from "@/app/abi";

const PRIVATE_KEY = process.env.NEXT_PRIVATE_KEY;
const RPC = process.env.NEXT_RPC;

if (!PRIVATE_KEY || !RPC) {
  throw new Error("Missing environment variables");
}

const provider = new ethers.JsonRpcProvider(RPC);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(celestialAddress, celestialAbi, wallet);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Parse JSON body
    console.log("Received Data:", body); // Log the received data

    const { name, description, image, attributes, properties, address } = body;

    const uri = JSON.stringify({
      name,
      description,
      image: image,
      attributes: attributes,
      properties: properties,
    });

    try {
      console.log("Starting minting process...");
      const tx = await contract.mintNFT(address, uri);
      const res = await tx.wait();
      console.log("Minting done for address:", address, "for contract");
    } catch (error) {
      console.error("Error connecting to Ethereum provider:", error);
      return NextResponse.json(
        { error: "Failed to connect to Ethereum provider" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, receivedData: body });
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
  }
}
