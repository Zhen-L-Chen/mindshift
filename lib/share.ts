import type { Metadata } from "next";

/* Server-side share metadata for the language-slugged entry points.
   BASE carries /mindshift on the GitHub Pages build; SITE_ORIGIN resolves to
   NEXT_PUBLIC_SITE_URL, then Vercel's production domain, then the Pages host. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://zhen-l-chen.github.io");

const SHARE = {
  en: {
    title: "MINDSHIFT — 5@8 networking — September 16 — Montréal",
    description:
      "Drink. Discuss. Shift. Technology is getting better. Are we? September 16, 2026, 5 PM to 8 PM, Bar Le Mal Nécessaire, Montréal. Presented by Paperminds and Draft & Goal.",
    locale: "en_CA",
  },
  fr: {
    title: "MINDSHIFT — 5@8 networking — 16 septembre — Montréal",
    description:
      "Boire. Échanger. Voir autrement. La technologie s’améliore. Et nous? 16 septembre 2026, 17 h à 20 h, Bar Le Mal Nécessaire, Montréal. Présenté par Paperminds et Draft & Goal.",
    locale: "fr_CA",
  },
} as const;

/** Full share metadata for one entry point ("/", "/en/", "/fr/"). */
export function shareMetadata(lang: "en" | "fr", path: string): Metadata {
  const s = SHARE[lang];
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: s.title,
    description: s.description,
    openGraph: {
      title: s.title,
      description: s.description,
      url: `${BASE}${path}`,
      siteName: "MINDSHIFT",
      locale: s.locale,
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
      title: s.title,
      description: s.description,
      images: [`${BASE}/og.jpg`],
    },
  };
}
