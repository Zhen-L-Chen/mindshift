import Landing from "@/components/Landing";
import { shareMetadata } from "@/lib/share";

/** English entry point for targeted links (email campaigns, EN share card). */
export const metadata = shareMetadata("en", "/en/");

export default function PageEn() {
  return <Landing initialLang="en" />;
}
