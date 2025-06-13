"use router";

import { NextResponse, NextRequest } from "next/server";
import { ethers } from "ethers";
import { gladiatorAbi, gladiatorAddress } from "@/app/abi";

const PRIVATE_KEY = process.env.NEXT_PRIVATE_KEY;
const RPC = process.env.NEXT_RPC;

if (!PRIVATE_KEY || !RPC) {
    throw new Error("Missing environment variables");
}

const provider = new ethers.JsonRpcProvider(RPC);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(gladiatorAddress, gladiatorAbi, wallet);

async function postHandler(request: NextRequest) {
    return request.json().then(async (body) => {
        const { gladiatorId, newMetadataUri } = body;

        if (!gladiatorId.toString() || !newMetadataUri) {
            return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
        }

        try {
            const tx = await contract.updateGladiator(gladiatorId, newMetadataUri);
            await tx.wait();

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error("Error updating gladiator:", error);
            return NextResponse.json({ success: false, error: "Transaction failed" });
        }
    });
}

export {
    postHandler as POST
}