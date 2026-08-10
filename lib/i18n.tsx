"use client";

import { createContext, useContext } from "react";

export type Lang = "fr" | "en";

/** one copy line — `b` marks the doc's bold pull-lines */
export type Line = { t: string; b?: boolean };

export interface Dict {
  topTag: string;
  dateTag: string;
  netTag: string;
  cta: string;
  tagline: string;
  credit: string;
  whyTitle: string;
  paras: Line[];
  infoTitle: string;
  info: Line[];
  served: string;
}

export const dicts: Record<Lang, Dict> = {
  fr: {
    topTag: "//Un évènement présenté par",
    dateTag: "//:16 septembre",
    netTag: "//:5@8_networking",
    cta: "Réserver votre place",
    tagline: "Boire. Échanger. Voir autrement.",
    credit: "//Présenté par Paperminds et Draft & Goal",
    whyTitle: "//Pourquoi participer",
    paras: [
      {
        t: "//La technologie nous donne accès à des capacités qui semblaient encore impossibles il y a peu.",
        b: true,
      },
      {
        t: "//Mais plus de vitesse, plus de puissance et plus de possibilités ne garantissent pas que nous ferons mieux.",
      },
      {
        t: "//MINDSHIFT est pour ceux qui veulent faire mieux avec la technologie.",
        b: true,
      },
      {
        t: "//Le 16 septembre, Paperminds et Draft & Goal réunissent des leaders en marketing curieux de ce qui devient possible, conscients des choix que cela impose et déterminés à mieux travailler, décider, créer, comprendre et avancer.",
      },
      {
        t: "//Une courte conversation ouvrira la soirée autour d’une question simple :",
      },
      {
        t: "//Comment devenir meilleurs avec la technologie, plutôt que simplement meilleurs à l’utiliser?",
        b: true,
      },
      {
        t: "//La suite se construira à travers les échanges entre participants.",
      },
      {
        t: "//Des perspectives différentes. Des expériences concrètes. Des idées à confronter. Des questions à explorer. Et, idéalement, quelques certitudes à revoir.",
      },
      {
        t: "//L’objectif : repartir avec de nouvelles perspectives sur ce que signifie réellement faire mieux avec la technologie.",
      },
      { t: "//La technologie s’améliore. Et nous?", b: true },
    ],
    infoTitle: "//Informations pratiques",
    info: [
      { t: "//16 septembre 2026, 17 h à 20 h", b: true },
      { t: "Bar Le Mal Nécessaire", b: true },
      { t: "1015 Rue St Alexandre," },
      { t: "Montréal, Québec H2Z 1N9" },
    ],
    served: "//Boissons et bouchées seront servies tout au long de la soirée.",
  },
  en: {
    topTag: "//An event presented by",
    dateTag: "//:september 16",
    netTag: "//:5@8_networking",
    cta: "Book your seat",
    tagline: "Drink. Discuss. Shift.",
    credit: "//Presented by Paperminds and Draft & Goal",
    whyTitle: "//Why attend",
    paras: [
      {
        t: "//Technology is giving us access to capabilities that felt out of reach not long ago.",
        b: true,
      },
      {
        t: "//But more speed, more capability and more possibilities do not guarantee that we will do better.",
      },
      {
        t: "//MINDSHIFT is for people who want to do better with technology.",
        b: true,
      },
      {
        t: "//On September 16, Paperminds and Draft & Goal will bring together marketing leaders who are curious about what is becoming possible, conscious of the choices it creates and determined to work, decide, create, understand and move forward more effectively.",
      },
      {
        t: "//A short conversation will open the evening around one simple question:",
      },
      {
        t: "//How do we become better with technology, rather than simply better at using it?",
        b: true,
      },
      { t: "//The rest will come from the people in the room." },
      {
        t: "//Different perspectives. Real experiences. Ideas worth challenging. Questions worth exploring. And, ideally, a few assumptions worth leaving behind.",
      },
      {
        t: "//The goal: leave with new perspectives on what it really means to do better with technology.",
      },
      { t: "//Technology is getting better. Are we?", b: true },
    ],
    infoTitle: "//Practical information",
    info: [
      { t: "//September 16, 2026, 5 PM to 8 PM", b: true },
      { t: "Bar Le Mal Nécessaire", b: true },
      { t: "1015 Rue St Alexandre," },
      { t: "Montréal, Québec H2Z 1N9" },
    ],
    served: "//Drinks and bites will be served throughout the evening.",
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
