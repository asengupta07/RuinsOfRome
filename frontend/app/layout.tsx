import type { Metadata } from "next";
import "./globals.css";
import Providers from "./_providers/rainbowkit";
import ConvexClientProviders from "@/providers/ConvexClientProviders";

export const metadata: Metadata = {
  title: "RoR",
  description: "Fight for Blessings",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo1.png" />
      </head>
      <body className={`antialiased bg-[#000]`}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <ConvexClientProviders>
          <Providers>{children}</Providers>
        </ConvexClientProviders>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
