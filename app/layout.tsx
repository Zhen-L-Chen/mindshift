import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
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

/* Absolute origin for social-share URLs: NEXT_PUBLIC_SITE_URL wins, then
   Vercel's production domain, then the GitHub Pages host (BASE carries the
   /mindshift prefix there). */
const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://zhen-l-chen.github.io");

const TITLE = "MINDSHIFT — 5@8 networking — 16 septembre — Montréal";
const DESCRIPTION =
  "Boire. Échanger. Voir autrement. La technologie s’améliore. Et nous? 16 septembre 2026, 17 h à 20 h, Bar Le Mal Nécessaire, Montréal. Présenté par Paperminds et Draft & Goal.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "MINDSHIFT",
    "paperminds",
    "Draft & Goal",
    "5@8",
    "networking",
    "Montréal",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE}/`,
    siteName: "MINDSHIFT",
    locale: "fr_CA",
    type: "website",
    images: [
      {
        url: `${BASE}/og.jpg`,
        width: 1200,
        height: 1200,
        alt: "MINDSHIFT — paperminds × Draft & Goal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE}/og.jpg`],
  },
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
    <html lang="fr" className={fira.variable}>
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
