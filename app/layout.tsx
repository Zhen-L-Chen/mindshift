import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { shareMetadata } from "@/lib/share";
import "./globals.css";

const fira = localFont({
  src: "./fonts/fira-code-var.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-fira",
});

/* GitHub Pages serves the site under /mindshift — plain-CSS asset URLs
   don't get the prefix from Next, so the cursor rules are injected here. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* Root entry shares in English (the default card); /en/ and /fr/ carry
   their own language-matched cards for targeted email links. */
export const metadata: Metadata = {
  ...shareMetadata("en", "/"),
  keywords: [
    "MINDSHIFT",
    "paperminds",
    "Draft & Goal",
    "5@8",
    "networking",
    "Montréal",
  ],
};

export const viewport: Viewport = {
  themeColor: "#000dff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fira.variable}>
      <body>
        <style>{`
@media (hover: hover) and (pointer: fine) {
  body { cursor: url("${BASE}/cursors/arrow.png") 3 1, auto; }
  a, button, select, input, label { cursor: url("${BASE}/cursors/hand.png") 14 2, pointer; }
}
        `}</style>
        {children}
        {/* Luma checkout overlay for the reservation buttons */}
        <Script
          id="luma-checkout"
          src="https://embed.lu.ma/checkout-button.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
