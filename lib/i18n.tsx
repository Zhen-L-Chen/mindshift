"use client";

import { createContext, useContext } from "react";

export type Lang = "fr" | "en";

export interface Dict {
  topTag: string;
  dateTag: string;
  netTag: string;
  dateTag2: string;
  cta: string;
  tagline: string;
  paras: string[];
  rules: string[];
  venue: string[];
  fiveA8: string;
}

export const dicts: Record<Lang, Dict> = {
  fr: {
    topTag: "//Un évènement pensé par",
    dateTag: "//:16 septembre",
    netTag: "//:5@8_networking",
    dateTag2: "//:16_septembre",
    cta: "Réservez votre place",
    tagline: "Boire. Échanger. Voir autrement.",
    paras: [
      "//MINDSHIFT réunit des leaders en marketing autour d’une question : qu’est-ce que la technologie peut nous permettre de mieux faire?",
      "//Un court échange ouvrira la soirée, puis les conversations exploreront comment la technologie peut nous aider à mieux comprendre, décider, créer et exécuter, tout en gardant l’humain au centre.",
      "//Des boissons et des bouchées seront servies tout au long de la soirée.",
    ],
    rules: [
      "//RÉSERVATION OBLIGATOIRE",
      "//PLACES LIMITÉES",
      "//invitation valide pour 4 personnes",
    ],
    venue: [
      "//Le Mal Nécessaire",
      "1015 Rue St-Alexandre,",
      "Montréal, Québec H2Z 1N9",
    ],
    fiveA8: "5@8 networking",
  },
  en: {
    topTag: "//An event curated by",
    dateTag: "//:september 16",
    netTag: "//:5@8_networking",
    dateTag2: "//:september_16",
    cta: "Book your seat",
    tagline: "Drink. Chat. Shift.",
    paras: [
      "//MINDSHIFT brings together marketing leaders around one question: what can technology help us do better?",
      "//A short exchange will open the evening, followed by conversations exploring how technology can help us understand, decide, create and execute better, while keeping people at the centre.",
      "//Drinks and bites will be served throughout the evening.",
    ],
    rules: [
      "//RESERVATION REQUIRED",
      "//LIMITED SEATS",
      "//invitation valid for 4 guests",
    ],
    venue: [
      "//Le Mal Nécessaire",
      "1015 Rue St-Alexandre,",
      "Montréal, Québec H2Z 1N9",
    ],
    fiveA8: "5@8 networking",
  },
};

export const LangContext = createContext<{
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
}>({ lang: "fr", t: dicts.fr, setLang: () => {} });

export function useLang() {
  return useContext(LangContext);
}

/** Luma checkout — the reservation flow behind every CTA. */
export const LUMA_EVENT_ID = "evt-oj9uqGV8K2aNgcm";
export const LUMA_URL = "https://luma.com/event/evt-oj9uqGV8K2aNgcm";
