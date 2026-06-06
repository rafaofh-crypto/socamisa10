import { CartolaTeam } from "./cartollaApi";

export interface InstagramStoryCardData {
  leagueName: string;
  season: string;
  round: number;
  teamName: string;
  ownerName: string;
  shieldUrl: string;
  score: number;
  tagline: string;
}

/**
 * Gets the correct typography and tagline based on player score performance
 */
export function getSocialTagline(score: number): string {
  if (score >= 100) return "PATAMAR DE ELITE 👑";
  if (score >= 80) return "SÓ CAMISA 10 DE RESPEITO ⭐";
  if (score >= 60) return "DESEMPENHO SÓLIDO 👍";
  return "NA PRÓXIMA TEM MAIS 🍀";
}

/**
 * Combines data to form a story layout payload
 */
export function generateInstagramPreviewData(
  team: CartolaTeam,
  round: number,
  score: number
): InstagramStoryCardData {
  return {
    leagueName: "SÓ CAMISA 10",
    season: "BRASILEIRÃO 2026",
    round,
    teamName: team.name,
    ownerName: team.owner,
    shieldUrl: team.shieldUrl,
    score: score,
    tagline: getSocialTagline(score)
  };
}

/**
 * Simulates copying social share payload or downlading canvas
 */
export async function copyStoryToClipboard(cardData: InstagramStoryCardData): Promise<boolean> {
  // Try using navigator.clipboard if available, otherwise fallback
  try {
    const textToCopy = `🏆 MITO DA RODADA ${cardData.round} 🏆\n🔥 Time: ${cardData.teamName}\n⚽ Cartoleiro: ${cardData.ownerName}\n⭐ Pontuação: ${cardData.score} pts\n⚡ Gerado em @socamisa10.fantasy`;
    if (navigator?.clipboard) {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    }
  } catch (err) {
    console.warn("Clipboard access denied or unavailable inside iframe", err);
  }
  return false;
}
