import Landing from "@/components/Landing";
import { shareMetadata } from "@/lib/share";

/** Entrée française pour les liens ciblés (infolettres, carte de partage FR). */
export const metadata = shareMetadata("fr", "/fr/");

export default function PageFr() {
  return <Landing initialLang="fr" />;
}
