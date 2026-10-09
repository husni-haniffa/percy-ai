import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Percy AI",
  description: "Find properties and vehicles in Sri Lanka",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ClerkProvider
          appearance={{ variables: { colorPrimary: "#0a0a0a", borderRadius: "0.625rem" } }}
        >
          <Providers>
            {children}
            <Toaster richColors position="top-center" />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}