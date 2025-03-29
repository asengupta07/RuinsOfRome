"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { celestialAbi, celestialAddress } from "../abi"
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
});

export default function Home() {
    return (
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">NFT Metadata Minter</h1>
            <NFTMinter />
        </main>
    )
}

export function NFTMinter() {
    const [metadata, setMetadata] = useState<string>(`{
  "name": "My NFT",
  "description": "This is my awesome NFT",
  "image": "https://example.com/image.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    },
    {
      "trait_type": "Eyes",
      "value": "Green"
    }
  ]
}`)
    const [isValidJSON, setIsValidJSON] = useState<boolean>(true)
    const [jsonError, setJsonError] = useState<string>("")
    const [isMinting, setIsMinting] = useState<boolean>(false)
    const [mintSuccess, setMintSuccess] = useState<boolean>(false)
    const [mintError, setMintError] = useState<string>("")
    const [mintTxHash, setMintTxHash] = useState<string>("")

    const { toast } = useToast()

    const validateJSON = (jsonString: string): boolean => {
        try {
            JSON.parse(jsonString)
            setIsValidJSON(true)
            setJsonError("")
            return true
        } catch (error) {
            setIsValidJSON(false)
            setJsonError((error as Error).message)
            return false
        }
    }

    const handleMetadataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setMetadata(value)
        if (value.trim()) {
            validateJSON(value)
        } else {
            setIsValidJSON(true)
            setJsonError("")
        }
    }

    const uploadMetadataToIPFS = async (metadata: string) => {
        //todo
        const metadataObject = JSON.parse(metadata);
        const metadataUpload = await pinata.upload.json(metadataObject);
        const metadataIpfsUrl = `https://ipfs.io/ipfs/${metadataUpload.IpfsHash}`;
        console.log("Metadata uploaded to IPFS: ", metadataIpfsUrl);

    }

    const mintNFT = async () => {
        // Reset states
        setMintSuccess(false)
        setMintError("")
        setMintTxHash("")

        // Validate JSON first
        if (!validateJSON(metadata)) {
            return
        }

        setIsMinting(true)
    }

    return (
        <>
            <ConnectButton />
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>NFT Metadata</CardTitle>
                    <CardDescription>
                        Enter your NFT metadata in JSON format below. This will be used to mint your NFT.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Enter your NFT metadata in JSON format"
                        className="font-mono h-80 resize-none"
                        value={metadata}
                        onChange={handleMetadataChange}
                    />

                    {!isValidJSON && jsonError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Invalid JSON</AlertTitle>
                            <AlertDescription>{jsonError}</AlertDescription>
                        </Alert>
                    )}

                    {isValidJSON && metadata.trim() && (
                        <div className="rounded-md bg-muted p-4">
                            <h3 className="text-sm font-medium mb-2">Preview:</h3>
                            <div className="text-xs font-mono overflow-auto max-h-40">
                                {JSON.stringify(JSON.parse(metadata), null, 2)}
                            </div>
                        </div>
                    )}

                    {mintSuccess && (
                        <Alert className="bg-green-50 text-green-800 border-green-200">
                            <Check className="h-4 w-4 text-green-600" />
                            <AlertTitle>NFT Minted Successfully!</AlertTitle>
                            <AlertDescription>
                                Transaction Hash: {mintTxHash.slice(0, 10)}...
                                {mintTxHash && (
                                    <a
                                        href={`https://etherscan.io/tx/${mintTxHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline ml-2"
                                    >
                                        View on Etherscan
                                    </a>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    {mintError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Minting Failed</AlertTitle>
                            <AlertDescription>{mintError}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={() => uploadMetadataToIPFS(metadata)} disabled={!isValidJSON || isMinting || !metadata.trim()} className="w-full">
                        {isMinting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Minting...
                            </>
                        ) : (
                            "Mint NFT"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}

