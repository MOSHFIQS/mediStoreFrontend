import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import { AuthProvider } from "@/context/AuthProvider";
import { spaceGrotesk } from "./fonts";
import AIAssistantWidget from "@/components/shared/AIAssistantWidget";

const geistSans = Geist({
     variable: "--font-geist-sans",
     subsets: ["latin"],
});

const geistMono = Geist_Mono({
     variable: "--font-geist-mono",
     subsets: ["latin"],
});

export const metadata: Metadata = {
     title: "Medi Store",
     description: "Wellness at Your Fingertips",
};

export default function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
     return (
          <html lang="en">
               <body
                    className={`${spaceGrotesk.className} font-sans bg-[#EFE9E3]`}
               >
                    <AuthProvider>
                         <Toaster richColors />
                         <Providers>
                              {children}
                              <AIAssistantWidget />
                         </Providers>
                    </AuthProvider>
               </body>
          </html>
     );
}
