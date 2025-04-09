import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

export const educhain = defineChain({
    id: 656476,
    name: "Educhain",
    network: "educhain",
    nativeCurrency: {
        decimals: 18,
        name: "EduToken",
        symbol: "EDU",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.open-campus-codex.gelato.digital/"],
        },
    },

    blockExplorers: {
        default: { name: "OpenCampusCodex", url: "https://opencampus-codex.blockscout.com/" },
    },
    testnet: true,
});

export function getConfig(connectors: ReturnType<typeof connectorsForWallets>) {
    return createConfig({
        chains: [educhain],
        connectors,
        storage: createStorage({
            storage: cookieStorage,
        }),
        ssr: true,
        transports: {
            [educhain.id]: http(),
        },
    });
}

declare module "wagmi" {
    interface Register {
        config: ReturnType<typeof getConfig>;
    }
}