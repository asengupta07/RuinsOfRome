"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import {
    RainbowKitProvider,
    connectorsForWallets,
    Theme,
} from "@rainbow-me/rainbowkit";
import {
    rainbowWallet,
    walletConnectWallet,
    coreWallet,
    ledgerWallet,
    metaMaskWallet,
    argentWallet,
    omniWallet,
    imTokenWallet,
    coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { useTheme } from "next-themes";

import { getConfig } from "./wagmi";

coinbaseWallet.preference = "smartWalletOnly";

const connectors = connectorsForWallets(
    [
        {
            groupName: "Popular",
            wallets: [
                rainbowWallet,
                walletConnectWallet,
                coreWallet,
                metaMaskWallet,
                coinbaseWallet,
            ],
        },
        {
            groupName: "Other",
            wallets: [ledgerWallet, argentWallet, omniWallet, imTokenWallet],
        },
    ],
    {
        appName: "My RainbowKit App",
        projectId: "YOUR_PROJECT_ID",
    }
);

export default function Providers(props: {
    children: ReactNode;
    initialState?: State;
}) {
    const { theme } = useTheme();
    const [config] = useState(() => getConfig(connectors));
    const [queryClient] = useState(() => new QueryClient());

    const customTheme: Theme = {
        blurs: {
            modalOverlay: "blur(8px)",
        },
        colors: {
            accentColor: "#047857", // emerald green
            accentColorForeground: "#FFFFFF",
            actionButtonBorder: "#065F46",
            actionButtonBorderMobile: "#065F46",
            actionButtonSecondaryBackground: "#059669",
            closeButton: "#D1FAE5",
            closeButtonBackground: "#065F46",
            connectButtonBackground: "#047857",
            connectButtonBackgroundError: "#DC2626",
            connectButtonInnerBackground: "#10B981",
            connectButtonText: "#FFFFFF",
            connectButtonTextError: "#FFFFFF",
            connectionIndicator: "#22D3EE", // peacock blue accent
            downloadBottomCardBackground: "#065F46",
            downloadTopCardBackground: "#059669",
            error: "#DC2626",
            generalBorder: "#059669",
            generalBorderDim: "#065F46",
            menuItemBackground: "#059669",
            modalBackdrop: "transparent", // Light black overlay for subtle dim effect
            modalBackground: "#0F172A", // Light green background
            modalBorder: "#059669",
            modalText: "#FFFFFF",
            modalTextDim: "#A7F3D0",
            modalTextSecondary: "#5EEAD4", // lighter peacock green
            profileAction: "#065F46",
            profileActionHover: "#059669",
            profileForeground: "#0D3B2E", // deep peacock green
            selectedOptionBorder: "#047857",
            standby: "#5EEAD4",
        },
        fonts: {
            body: "Inter, sans-serif",
        },
        radii: {
            actionButton: "5px", // Reduced border radius
            connectButton: "6px",
            menuButton: "5px",
            modal: "10px",
            modalMobile: "12px",
        },
        shadows: {
            connectButton: "0px 4px 12px rgba(4, 120, 87, 0.4)",
            dialog: "0px 8px 32px rgba(4, 120, 87, 0.32)",
            profileDetailsAction: "0px 2px 6px rgba(4, 120, 87, 0.24)",
            selectedOption: "0px 2px 6px rgba(4, 120, 87, 0.24)",
            selectedWallet: "0px 2px 6px rgba(4, 120, 87, 0.24)",
            walletLogo: "0px 2px 16px rgba(4, 120, 87, 0.16)",
        },
    };



    return (
        <WagmiProvider config={config} initialState={props.initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    initialChain={656476}
                    theme={customTheme}
                    coolMode
                    modalSize="wide"
                >
                    {props.children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}