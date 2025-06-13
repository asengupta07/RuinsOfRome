import type { Metadata } from "next";
import "./globals.css";
import Providers from "./_providers/rainbowkit";
import ConvexClientProviders from "@/providers/ConvexClientProviders";
import { MusicProvider } from "./context/MusicContext";

export const metadata: Metadata = {
  title: "Ruins of Rome",
  description: "Fight for Blessings",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo1.png" />
      </head>
      <body className={`antialiased bg-[#000]`} suppressHydrationWarning>
        <MusicProvider>
          <ConvexClientProviders>
            <Providers>{children}</Providers>
          </ConvexClientProviders>
        </MusicProvider>
      </body>
    </html>
  );
}
