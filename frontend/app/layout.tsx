// Force reload
import type { Metadata } from "next";
import { DM_Sans, Sora, Playfair_Display, Space_Grotesk, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/firebase/auth";
import { MobileBlocker } from "@/components/MobileBlocker";
import { ParallaxBackground } from "@/components/ParallaxBackground";

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-mono",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

import { SmoothScrolling } from "@/components/SmoothScrolling";
import { SplashScreen } from "@/components/SplashScreen";
import { LegacyMobileNavigation } from "@/components/dashboard/LegacyMobileNavigation";
import { RealTimeNotifications } from "@/components/RealTimeNotifications";

export const metadata: Metadata = {
  title: "Eclipse Tech Community",
  description: "Secure, scalable, and responsive workshop registration.",
  icons: {
    icon: '/icon.png',
  },
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${sora.variable} ${playfair.variable} ${spaceGrotesk.variable} ${bodoni.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="eclipse-theme min-h-full flex flex-col bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
        <SplashScreen />
        <ParallaxBackground />
        <MobileBlocker />
        <SmoothScrolling>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <LegacyMobileNavigation />
              <Suspense fallback={null}>
                <RealTimeNotifications />
              </Suspense>
            </TooltipProvider>
          </AuthProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}
