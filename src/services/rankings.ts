import { CartolaTeam } from "./cartollaApi";

export interface RankingStanding extends CartolaTeam {
  calculatedPoints: number;
}

export interface GeneralStats {
  bestScore: number;
  bestTeam: string;
  bestRound: number;
  worstScore: number;
  worstTeam: string;
  worstRound: number;
  average: number;
}

/**
 * Filtra rodadas jogadas com base no turno escolhido
 */
export function getActiveRounds(currentRound: number, filterType: "acumulado" | "turno1" | "turno2"): number[] {
  const playedRounds = Array.from({ length: currentRound }, (_, i) => i + 1);
  if (filterType === "turno1") {
    return playedRounds.filter((r) => r >= 1 && r <= 19);
  } else if (filterType === "turno2") {
    return playedRounds.filter((r) => r >= 20 && r <= 38);
  }
  return playedRounds;
}

/**
 * Calcula classificação baseado nas rodadas ativas
 */
export function calculateStandings(teams: CartolaTeam[], activeRounds: number[]): RankingStanding[] {
  // Identify the two survivors dynamically if R20 is processed
  let survivorIds: string[] = [];
  if (teams.length >= 50) {
    // 1. Calculate cumulative scores of all teams from Round 1 up to Round 20
    const standingsAt20 = teams.map(t => {
      let cumulativeScore = 0;
      for (let r = 1; r <= 20; r++) {
        cumulativeScore += t.scores[r] || 0;
      }
      return { id: t.id, cumulativeScore };
    }).sort((a, b) => b.cumulativeScore - a.cumulativeScore);

    // 2. Identify the bottom 4 teams (indices 46 to 49 for 50 teams)
    const limboTeams = standingsAt20.slice(46, 50);
    
    // 3. For these 4 teams, look up their R21 score
    const esperneioScores = limboTeams.map(entry => {
      const teamObj = teams.find(t => t.id === entry.id);
      const scoreR21 = teamObj ? (teamObj.scores[21] || 0) : 0;
      return {
        id: entry.id,
        scoreR21,
        cumulativeScore: entry.cumulativeScore
      };
    }).sort((a, b) => {
      if (b.scoreR21 !== a.scoreR21) {
        return b.scoreR21 - a.scoreR21;
      }
      return b.cumulativeScore - a.cumulativeScore;
    });

    // 4. Top 2 are the survivors
    survivorIds = esperneioScores.slice(0, 2).map(item => item.id);
  }

  return teams
    .map((t) => {
      const sumPoints = activeRounds.reduce((acc, r) => acc + (t.scores[r] || 0), 0);
      const is_survivor = survivorIds.includes(t.id);
      return {
        ...t,
        calculatedPoints: Number(sumPoints.toFixed(2)),
        is_survivor
      };
    })
    .sort((a, b) => {
      if (b.calculatedPoints !== a.calculatedPoints) {
        return b.calculatedPoints - a.calculatedPoints;
      }
      return a.name.localeCompare(b.name);
    });
}

/**
 * Calcula estatísticas de melhor/pior rodada e médias
 */
export function calculateStats(teams: CartolaTeam[], activeRounds: number[]): GeneralStats {
  let bestScore = 0;
  let worstScore = Infinity;
  let bestTeam = "";
  let bestRound = 0;
  let worstTeam = "";
  let worstRound = 0;
  let totalScoreAllRounds = 0;
  let scoreCount = 0;

  teams.forEach((t) => {
    activeRounds.forEach((r) => {
      const score = t.scores[r] || 0;
      if (score > 0) {
        totalScoreAllRounds += score;
        scoreCount++;

        if (score > bestScore) {
          bestScore = score;
          bestTeam = t.name;
          bestRound = r;
        }
        if (score < worstScore) {
          worstScore = score;
          worstTeam = t.name;
          worstRound = r;
        }
      }
    });
  });

  if (worstScore === Infinity) worstScore = 0;
  const generalAverage = scoreCount > 0 ? totalScoreAllRounds / scoreCount : 0;

  return {
    bestScore: Number(bestScore.toFixed(2)),
    bestTeam,
    bestRound,
    worstScore: Number(worstScore.toFixed(2)),
    worstTeam,
    worstRound,
    average: Number(generalAverage.toFixed(2))
  };
}
