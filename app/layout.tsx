import type { Metadata } from "next";

import localFont from "next/font/local";

import { Blinker, Onest } from "next/font/google";

import "./globals.css";

import CustomScrollbar from "@/components/layout/CustomScrollbar";
import CustomCursor from "@/components/ui/CustomCursor";
import { LenisProvider } from "@/lib/lenis-context";
import Navbar from "@/components/layout/navbar";

// ==========================================================================
// LOCAL FONT — AEONIK
// ==========================================================================

const aeonik = localFont({
  src: [
    {
      path: "../public/fonts/Aeonik-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Aeonik-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Aeonik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Aeonik-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Aeonik-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Aeonik-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--aeonik",
});

// ==========================================================================
// GOOGLE FONTS
// ==========================================================================

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});

const blinker = Blinker({
  subsets: ["latin"],
  variable: "--font-blinker",
  weight: ["400", "600", "700", "800", "900"],
});

// ==========================================================================
// METADATA
// ==========================================================================

export const metadata: Metadata = {
  title: "Peta Workspaces",
  description: "Looking for PETA? You've come to the right place.",
  icons: {
    icon: "/PetaLogoMark.svg",
  },
};

// ==========================================================================
// ROOT LAYOUT
// ==========================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        onest.variable,
        blinker.variable,
        aeonik.variable,
        "h-full",
        "antialiased",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col font-aeonik">
        <CustomCursor />
        <Navbar />

        <LenisProvider>{children}</LenisProvider>

        <CustomScrollbar />
      </body>
    </html>
  );
}
