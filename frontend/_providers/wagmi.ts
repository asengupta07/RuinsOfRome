import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

export function getConfig(connectors: ReturnType<typeof connectorsForWallets>) {
    return createConfig({
        chains: [avalancheFuji],
        connectors,
        storage: createStorage({
            storage: cookieStorage,
        }),
        ssr: true,
        transports: {
            [avalancheFuji.id]: http(),
        },
    });
}

declare module "wagmi" {
    interface Register {
        config: ReturnType<typeof getConfig>;
    }
}