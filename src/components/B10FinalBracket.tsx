import React, { useState, useMemo } from 'react';
import { CartolaTeam } from '../services/cartolaService';
import TeamShield from './TeamShield';
import MainEvent from './MainEvent';
import { Trophy, Crown, Sparkles, ShieldCheck, ArrowRight, Activity, HelpCircle } from 'lucide-react';

interface B10FinalBracketProps {
  teams: CartolaTeam[];
  mappedB10Teams: any[];
  playoffMatches: any[];
  b10Round: number;
  currentRound: number;
  isSimulatorsEnabled?: boolean;
}

export const B10FinalBracket = ({
  teams = [],
  mappedB10Teams = [],
  playoffMatches = [],
  b10Round,
  currentRound,
  isSimulatorsEnabled = false
}: B10FinalBracketProps) => {
  const [activeStage, setActiveStage] = useState<'oitavas' | 'quartas' | 'semis' | 'final'>('oitavas');
  const [sideFilter, setSideFilter] = useState<'all' | 'sideA' | 'sideB'>('all');
  const isAwaitingRound25 = !isSimulatorsEnabled && currentRound < 25;

  // Round numbers
  const rPlayoff = b10Round + 4; // Round 5 (R29)
  const rR32 = b10Round + 5;     // Round 6 (R30)
  
  // Oitavas (Fase 5) - Ida & Volta
  const rOitavasIda = b10Round + 6;   // Round 7 (R31)
  const rOitavasVolta = b10Round + 7; // Round 8 (R32)
  
  // Quartas (Fase 6) - Ida & Volta
  const rQuartasIda = b10Round + 8;   // Round 9 (R33)
  const rQuartasVolta = b10Round + 9; // Round 10 (R34)
  
  // Semifinal (Fase 7) - Ida & Volta
  const rSemiIda = b10Round + 10;     // Round 11 (R35)
  const rSemiVolta = b10Round + 11;   // Round 12 (R36)
  
  // Final & 3º Lugar (Fase 8) - Jogo Único
  const rFinalSingle = b10Round + 12; // Round 13 (R37)

  // 0. Resolve team tiebreakers according to rules:
  // 1) Pontuação da Fase (Rank classificatório na fase/corte do B10)
  // 2) Pontuação de Grupos (Soma das rodadas de grupos: 22, 23, 24)
  // 3) Ranking Geral (leagueRank no Cartola FC)
  const resolveTiebreaker = (team1: any, team2: any): 'team1' | 'team2' => {
    const rank1 = team1.rank || 99;
    const rank2 = team2.rank || 99;
    if (rank1 !== rank2) {
      return rank1 < rank2 ? 'team1' : 'team2';
    }

    const gp1 = (team1.scores[22] || 0) + (team1.scores[23] || 0) + (team1.scores[24] || 0);
    const gp2 = (team2.scores[22] || 0) + (team2.scores[23] || 0) + (team2.scores[24] || 0);
    if (Math.abs(gp1 - gp2) > 0.001) {
      return gp1 > gp2 ? 'team1' : 'team2';
    }

    const lr1 = team1.leagueRank || 99;
    const lr2 = team2.leagueRank || 99;
    return lr1 < lr2 ? 'team1' : 'team2';
  };

  // 0.1 Function 'calculateAggregatedScore' to identify the two rounds linked to the match
  const calculateAggregatedScore = (matchId: string): number[] => {
    const matchLower = matchId.toLowerCase();
    if (matchLower.includes("oitavas") || ["m81", "m83", "m85", "m87", "m89", "m91", "m93", "m95"].includes(matchLower)) {
      return [rOitavasIda, rOitavasVolta];
    }
    if (matchLower.includes("quartas") || ["m90", "m92", "m94", "m96"].includes(matchLower)) {
      return [rQuartasIda, rQuartasVolta];
    }
    if (matchLower.includes("semis") || matchLower.includes("semifinal") || ["m98", "m100"].includes(matchLower)) {
      return [rSemiIda, rSemiVolta];
    }
    return [];
  };

  // 1. Recompute R32 (Fase 4) internally to stay self-contained & high-perf
  const eliteTeams = useMemo(() => {
    if (isAwaitingRound25) {
      return Array.from({ length: 16 }, (_, idx) => ({
        id: `mock-elite-team-${idx}`,
        name: `Aguardando Rod 25`,
        owner: 'Pendente',
        shieldUrl: null,
        rank: idx + 1,
        category: 'ELITE',
        leagueRank: 99,
        scores: {}
      }));
    }
    return [...mappedB10Teams]
      .filter(t => t.category === 'ELITE')
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 16);
  }, [mappedB10Teams, isAwaitingRound25]);

  const playoffWinners = useMemo(() => {
    return playoffMatches.map(match => {
      if (match.isPlayed && match.winner) {
        const winnerTeam = match.winner === 'team1' ? match.team1 : match.team2;
        return {
          isVirtual: false,
          id: winnerTeam.id,
          name: winnerTeam.name,
          owner: winnerTeam.owner,
          shieldUrl: winnerTeam.shieldUrl,
          rank: winnerTeam.rank,
          category: winnerTeam.category,
          leagueRank: winnerTeam.leagueRank || 99,
          scores: winnerTeam.scores,
          seedRank: winnerTeam.rank
        };
      } else {
        return {
          isVirtual: true,
          id: `v-winner-${match.id}`,
          name: `Vencedor Play-off #${match.id}`,
          owner: `Duelo: ${match.team1.name} vs ${match.team2.name}`,
          shieldUrl: null,
          rank: 16 + match.id,
          category: 'ACESSO',
          leagueRank: Math.min(match.team1.leagueRank || 99, match.team2.leagueRank || 99),
          scores: {},
          seedRank: 16 + match.id
        };
      }
    });
  }, [playoffMatches]);

  const sortedPlayoffWinnersDesc = useMemo(() => {
    return [...playoffWinners].sort((a, b) => b.seedRank - a.seedRank);
  }, [playoffWinners]);

  const r32Matches = useMemo(() => {
    const list = [];
    for (let i = 0; i < 16; i++) {
      const h = eliteTeams[i];
      const a = sortedPlayoffWinnersDesc[i];
      if (h && a) {
        const scoreH = (isSimulatorsEnabled || rR32 <= currentRound) && typeof h.scores[rR32] === 'number' ? h.scores[rR32] : 0;
        const scoreA = (isSimulatorsEnabled || rR32 <= currentRound) && typeof a.scores[rR32] === 'number' ? a.scores[rR32] : 0;

        let winner: 'home' | 'away' | null = null;
        let tiebreakerApplied = false;

        const isPlayed = (isSimulatorsEnabled || currentRound >= rR32) && !a.isVirtual;
        if (isPlayed) {
          if (scoreH > scoreA) {
            winner = 'home';
          } else if (scoreA > scoreH) {
            winner = 'away';
          } else {
            const tb = resolveTiebreaker(h, a);
            winner = tb === 'team1' ? 'home' : 'away';
            tiebreakerApplied = true;
          }
        }

        list.push({
          id: i + 1,
          home: h,
          away: a,
          scoreHome: scoreH,
          scoreAway: scoreA,
          winner,
          tiebreakerApplied,
          isPlayed
        });
      }
    }
    return list;
  }, [eliteTeams, sortedPlayoffWinnersDesc, rR32, currentRound]);

  // Extract the 16 Round of 32 Winners (each has seed position 1 to 16)
  const r32Winners = useMemo(() => {
    return r32Matches.map(m => {
      if (m.isPlayed && m.winner) {
        return m.winner === 'home' ? m.home : m.away;
      }
      return {
        isVirtual: true,
        id: `v-winner-r32-${m.id}`,
        name: `Vencedor R32 #${m.id}`,
        owner: `A definir: Duelo #${m.id}`,
        shieldUrl: null,
        leagueRank: Math.min(m.home.leagueRank || 99, m.away.leagueRank || 99),
        scores: {},
        rank: m.id
      };
    });
  }, [r32Matches]);


  // ==========================
  // STAGE 5: OITAVAS DE FINAL (Agr. R7 e R8)
  // ==========================
  const oitavasMatches = useMemo(() => {
    // Side A Matches: O1 to O4
    // O1: Winner R32 #1 vs Winner R32 #15 (indices 0 vs 14)
    // O2: Winner R32 #3 vs Winner R32 #13 (indices 2 vs 12)
    // O3: Winner R32 #5 vs Winner R32 #11 (indices 4 vs 10)
    // O4: Winner R32 #7 vs Winner R32 #9 (indices 6 vs 8)
    
    // Side B Matches: O5 to O8
    // O5: Winner R32 #2 vs Winner R32 #16 (indices 1 vs 15)
    // O6: Winner R32 #4 vs Winner R32 #14 (indices 3 vs 13)
    // O7: Winner R32 #6 vs Winner R32 #12 (indices 5 vs 11)
    // O8: Winner R32 #8 vs Winner R32 #10 (indices 7 vs 9)

    const matchesMap = [
      { id: 1, side: 'A', name: 'Oitavas A1', t1Idx: 0, t2Idx: 14 },
      { id: 2, side: 'A', name: 'Oitavas A2', t1Idx: 2, t2Idx: 12 },
      { id: 3, side: 'A', name: 'Oitavas A3', t1Idx: 4, t2Idx: 10 },
      { id: 4, side: 'A', name: 'Oitavas A4', t1Idx: 6, t2Idx: 8 },
      { id: 5, side: 'B', name: 'Oitavas B1', t1Idx: 1, t2Idx: 15 },
      { id: 6, side: 'B', name: 'Oitavas B2', t1Idx: 3, t2Idx: 13 },
      { id: 7, side: 'B', name: 'Oitavas B3', t1Idx: 5, t2Idx: 11 },
      { id: 8, side: 'B', name: 'Oitavas B4', t1Idx: 7, t2Idx: 9 }
    ];

    return matchesMap.map(m => {
      const team1 = r32Winners[m.t1Idx];
      const team2 = r32Winners[m.t2Idx];
      
      const score1_r1 = (isSimulatorsEnabled || rOitavasIda <= currentRound) && typeof team1.scores[rOitavasIda] === 'number' ? team1.scores[rOitavasIda] : 0;
      const score1_r2 = (isSimulatorsEnabled || rOitavasVolta <= currentRound) && typeof team1.scores[rOitavasVolta] === 'number' ? team1.scores[rOitavasVolta] : 0;
      const totalScore1 = Number((score1_r1 + score1_r2).toFixed(2));
      
      const score2_r1 = (isSimulatorsEnabled || rOitavasIda <= currentRound) && typeof team2.scores[rOitavasIda] === 'number' ? team2.scores[rOitavasIda] : 0;
      const score2_r2 = (isSimulatorsEnabled || rOitavasVolta <= currentRound) && typeof team2.scores[rOitavasVolta] === 'number' ? team2.scores[rOitavasVolta] : 0;
      const totalScore2 = Number((score2_r1 + score2_r2).toFixed(2));
      
      const isPlayed = (isSimulatorsEnabled || currentRound >= rOitavasVolta) && !team1.isVirtual && !team2.isVirtual;
      let winner: 'team1' | 'team2' | null = null;
      let tiebreakerApplied = false;

      if (isPlayed) {
        if (totalScore1 > totalScore2) {
          winner = 'team1';
        } else if (totalScore2 > totalScore1) {
          winner = 'team2';
        } else {
          winner = resolveTiebreaker(team1, team2);
          tiebreakerApplied = true;
        }
      }

      return {
        ...m,
        team1,
        team2,
        score1_r1,
        score1_r2,
        totalScore1,
        score2_r1,
        score2_r2,
        totalScore2,
        winner,
        tiebreakerApplied,
        isPlayed
      };
    });
  }, [r32Winners, rOitavasIda, rOitavasVolta, currentRound, isSimulatorsEnabled]);


  // ==========================
  // STAGE 6: QUARTAS DE FINAL (Agr. R9 e R10)
  // ==========================
  const quartasMatches = useMemo(() => {
    // Q1 (Side A): Winner O1 vs Winner O4 (indices 0 vs 3 inside oitavasMatches)
    // Q2 (Side A): Winner O2 vs Winner O3 (indices 1 vs 2)
    // Q3 (Side B): Winner O5 vs Winner O8 (indices 4 vs 7)
    // Q4 (Side B): Winner O6 vs Winner O7 (indices 5 vs 6)

    const pairings = [
      { id: 1, side: 'A', name: 'Quartas A1', o1Idx: 0, o2Idx: 3 },
      { id: 2, side: 'A', name: 'Quartas A2', o1Idx: 1, o2Idx: 2 },
      { id: 3, side: 'B', name: 'Quartas B1', o1Idx: 4, o2Idx: 7 },
      { id: 4, side: 'B', name: 'Quartas B2', o1Idx: 5, o2Idx: 6 }
    ];

    return pairings.map(p => {
      const o1 = oitavasMatches[p.o1Idx];
      const o2 = oitavasMatches[p.o2Idx];

      // Resolve team references from previous round winners of Oitavas
      let team1: any = { isVirtual: true, name: `Vencedor ${o1.name}`, owner: `Duelo Oitavas #${o1.id}`, shieldUrl: null, leagueRank: 99, scores: {} };
      let team2: any = { isVirtual: true, name: `Vencedor ${o2.name}`, owner: `Duelo Oitavas #${o2.id}`, shieldUrl: null, leagueRank: 99, scores: {} };

      if (o1.isPlayed && o1.winner) {
        team1 = o1.winner === 'team1' ? o1.team1 : o1.team2;
      }
      if (o2.isPlayed && o2.winner) {
        team2 = o2.winner === 'team1' ? o2.team1 : o2.team2;
      }

      const score1_r1 = (isSimulatorsEnabled || rQuartasIda <= currentRound) && typeof team1.scores[rQuartasIda] === 'number' ? team1.scores[rQuartasIda] : 0;
      const score1_r2 = (isSimulatorsEnabled || rQuartasVolta <= currentRound) && typeof team1.scores[rQuartasVolta] === 'number' ? team1.scores[rQuartasVolta] : 0;
      const totalScore1 = Number((score1_r1 + score1_r2).toFixed(2));

      const score2_r1 = (isSimulatorsEnabled || rQuartasIda <= currentRound) && typeof team2.scores[rQuartasIda] === 'number' ? team2.scores[rQuartasIda] : 0;
      const score2_r2 = (isSimulatorsEnabled || rQuartasVolta <= currentRound) && typeof team2.scores[rQuartasVolta] === 'number' ? team2.scores[rQuartasVolta] : 0;
      const totalScore2 = Number((score2_r1 + score2_r2).toFixed(2));

      const isPlayed = (isSimulatorsEnabled || currentRound >= rQuartasVolta) && !team1.isVirtual && !team2.isVirtual;
      let winner: 'team1' | 'team2' | null = null;
      let tiebreakerApplied = false;

      if (isPlayed) {
        if (totalScore1 > totalScore2) {
          winner = 'team1';
        } else if (totalScore2 > totalScore1) {
          winner = 'team2';
        } else {
          winner = resolveTiebreaker(team1, team2);
          tiebreakerApplied = true;
        }
      }

      return {
        ...p,
        team1,
        team2,
        score1_r1,
        score1_r2,
        totalScore1,
        score2_r1,
        score2_r2,
        totalScore2,
        winner,
        tiebreakerApplied,
        isPlayed
      };
    });
  }, [oitavasMatches, rQuartasIda, rQuartasVolta, currentRound, isSimulatorsEnabled]);


  // ==========================
  // STAGE 7: SEMIFINAIS (Agr. R11 e R12)
  // ==========================
  const semisMatches = useMemo(() => {
    // S1 (Side A): Winner Q1 vs Winner Q2 (indices 0 vs 1 inside quartasMatches)
    // S2 (Side B): Winner Q3 vs Winner Q4 (indices 2 vs 3)

    const pairings = [
      { id: 1, side: 'A', name: 'Semifinal A', q1Idx: 0, q2Idx: 1 },
      { id: 2, side: 'B', name: 'Semifinal B', q1Idx: 2, q2Idx: 3 }
    ];

    return pairings.map(p => {
      const q1 = quartasMatches[p.q1Idx];
      const q2 = quartasMatches[p.q2Idx];

      let team1: any = { isVirtual: true, name: `Vencedor ${q1.name}`, owner: `Duelo Quartas #${q1.id}`, shieldUrl: null, leagueRank: 99, scores: {} };
      let team2: any = { isVirtual: true, name: `Vencedor ${q2.name}`, owner: `Duelo Quartas #${q2.id}`, shieldUrl: null, leagueRank: 99, scores: {} };

      if (q1.isPlayed && q1.winner) {
        team1 = q1.winner === 'team1' ? q1.team1 : q1.team2;
      }
      if (q2.isPlayed && q2.winner) {
        team2 = q2.winner === 'team1' ? q2.team1 : q2.team2;
      }

      // Aggregate score Semis (rSemiIda + rSemiVolta)
      const score1_r1 = (isSimulatorsEnabled || rSemiIda <= currentRound) && typeof team1.scores[rSemiIda] === 'number' ? team1.scores[rSemiIda] : 0;
      const score1_r2 = (isSimulatorsEnabled || rSemiVolta <= currentRound) && typeof team1.scores[rSemiVolta] === 'number' ? team1.scores[rSemiVolta] : 0;
      const totalScore1 = Number((score1_r1 + score1_r2).toFixed(2));

      const score2_r1 = (isSimulatorsEnabled || rSemiIda <= currentRound) && typeof team2.scores[rSemiIda] === 'number' ? team2.scores[rSemiIda] : 0;
      const score2_r2 = (isSimulatorsEnabled || rSemiVolta <= currentRound) && typeof team2.scores[rSemiVolta] === 'number' ? team2.scores[rSemiVolta] : 0;
      const totalScore2 = Number((score2_r1 + score2_r2).toFixed(2));

      const isPlayed = (isSimulatorsEnabled || currentRound >= rSemiVolta) && !team1.isVirtual && !team2.isVirtual;
      let winner: 'team1' | 'team2' | null = null;
      let tiebreakerApplied = false;

      if (isPlayed) {
        if (totalScore1 > totalScore2) {
          winner = 'team1';
        } else if (totalScore2 > totalScore1) {
          winner = 'team2';
        } else {
          winner = resolveTiebreaker(team1, team2);
          tiebreakerApplied = true;
        }
      }

      return {
        ...p,
        team1,
        team2,
        score1_r1,
        score1_r2,
        totalScore1,
        score2_r1,
        score2_r2,
        totalScore2,
        winner,
        tiebreakerApplied,
        isPlayed
      };
    });
  }, [quartasMatches, rSemiIda, rSemiVolta, currentRound, isSimulatorsEnabled]);


  // ==========================
  // STAGE 8: GRANDE FINAL (Jogo Único, R13)
  // ==========================
  const finalMatch = useMemo(() => {
    const s1 = semisMatches[0];
    const s2 = semisMatches[1];

    let team1: any = { isVirtual: true, name: `Campeão Lado A`, owner: `Duelo Semifinal A`, shieldUrl: null, leagueRank: 99, scores: {} };
    let team2: any = { isVirtual: true, name: `Campeão Lado B`, owner: `Duelo Semifinal B`, shieldUrl: null, leagueRank: 99, scores: {} };

    if (s1.isPlayed && s1.winner) {
      team1 = s1.winner === 'team1' ? s1.team1 : s1.team2;
    }
    if (s2.isPlayed && s2.winner) {
      team2 = s2.winner === 'team1' ? s2.team1 : s2.team2;
    }

    // Single match final points in round R37 (rFinalSingle)
    const score1 = (isSimulatorsEnabled || rFinalSingle <= currentRound) && typeof team1.scores[rFinalSingle] === 'number' ? team1.scores[rFinalSingle] : 0;
    const score2 = (isSimulatorsEnabled || rFinalSingle <= currentRound) && typeof team2.scores[rFinalSingle] === 'number' ? team2.scores[rFinalSingle] : 0;

    const isPlayed = (isSimulatorsEnabled || currentRound >= rFinalSingle) && !team1.isVirtual && !team2.isVirtual;
    let winner: 'team1' | 'team2' | null = null;
    let tiebreakerApplied = false;

    if (isPlayed) {
      if (score1 > score2) {
        winner = 'team1';
      } else if (score2 > score1) {
        winner = 'team2';
      } else {
        winner = resolveTiebreaker(team1, team2);
        tiebreakerApplied = true;
      }
    }

    return {
      team1,
      team2,
      score1,
      score2,
      winner,
      tiebreakerApplied,
      isPlayed
    };
  }, [semisMatches, rFinalSingle, currentRound, isSimulatorsEnabled]);


  // ==========================
  // STAGE 9: DISPUTA DE 3º LUGAR (Jogo Único, R13)
  // ==========================
  const thirdPlaceMatch = useMemo(() => {
    const s1 = semisMatches[0];
    const s2 = semisMatches[1];

    let team1: any = { isVirtual: true, name: `Perdedor Semis A`, owner: `Duelo Semifinal A`, shieldUrl: null, leagueRank: 99, scores: {} };
    let team2: any = { isVirtual: true, name: `Perdedor Semis B`, owner: `Duelo Semifinal B`, shieldUrl: null, leagueRank: 99, scores: {} };

    if (s1.isPlayed && s1.winner) {
      team1 = s1.winner === 'team1' ? s1.team2 : s1.team1;
    }
    if (s2.isPlayed && s2.winner) {
      team2 = s2.winner === 'team1' ? s2.team2 : s2.team1;
    }

    const score1 = (isSimulatorsEnabled || rFinalSingle <= currentRound) && typeof team1.scores[rFinalSingle] === 'number' ? team1.scores[rFinalSingle] : 0;
    const score2 = (isSimulatorsEnabled || rFinalSingle <= currentRound) && typeof team2.scores[rFinalSingle] === 'number' ? team2.scores[rFinalSingle] : 0;

    const isPlayed = (isSimulatorsEnabled || currentRound >= rFinalSingle) && !team1.isVirtual && !team2.isVirtual;
    let winner: 'team1' | 'team2' | null = null;
    let tiebreakerApplied = false;

    if (isPlayed) {
      if (score1 > score2) {
        winner = 'team1';
      } else if (score2 > score1) {
        winner = 'team2';
      } else {
        winner = resolveTiebreaker(team1, team2);
        tiebreakerApplied = true;
      }
    }

    return {
      team1,
      team2,
      score1,
      score2,
      winner,
      tiebreakerApplied,
      isPlayed
    };
  }, [semisMatches, rFinalSingle, currentRound, isSimulatorsEnabled]);

  const podium = useMemo(() => {
    let champion: any = null;
    let runnerUp: any = null;
    let third: any = null;
    let fourth: any = null;

    if (finalMatch.isPlayed && finalMatch.winner) {
      if (finalMatch.winner === 'team1') {
        champion = finalMatch.team1;
        runnerUp = finalMatch.team2;
      } else {
        champion = finalMatch.team2;
        runnerUp = finalMatch.team1;
      }
    } else {
      const s1 = semisMatches[0];
      const s2 = semisMatches[1];
      if (s1.isPlayed && s1.winner && s2.isPlayed && s2.winner) {
        const f1 = s1.winner === 'team1' ? s1.team1 : s1.team2;
        const f2 = s2.winner === 'team1' ? s2.team1 : s2.team2;
        champion = { isVirtual: false, name: 'Finais', owner: `${f1.name} ou ${f2.name}` };
      }
    }

    if (thirdPlaceMatch.isPlayed && thirdPlaceMatch.winner) {
      if (thirdPlaceMatch.winner === 'team1') {
        third = thirdPlaceMatch.team1;
        fourth = thirdPlaceMatch.team2;
      } else {
        third = thirdPlaceMatch.team2;
        fourth = thirdPlaceMatch.team1;
      }
    } else {
      const s1 = semisMatches[0];
      const s2 = semisMatches[1];
      if (s1.isPlayed && s1.winner && s2.isPlayed && s2.winner) {
        const l1 = s1.winner === 'team1' ? s1.team2 : s1.team1;
        const l2 = s2.winner === 'team1' ? s2.team2 : s2.team1;
        third = { isVirtual: false, name: '3º Lugar (A definir)', owner: `${l1.name} ou ${l2.name}` };
      }
    }

    return { champion, runnerUp, third, fourth };
  }, [finalMatch, thirdPlaceMatch, semisMatches]);


  // Filter selected matches based on Active Tab & Side Filter
  const renderedMatches = useMemo(() => {
    let list: any[] = [];
    if (activeStage === 'oitavas') {
      list = oitavasMatches;
    } else if (activeStage === 'quartas') {
      list = quartasMatches;
    } else if (activeStage === 'semis') {
      list = semisMatches;
    } else {
      return [finalMatch]; // Final does not apply Side filter
    }

    if (sideFilter === 'sideA') {
      return list.filter(m => m.side === 'A');
    }
    if (sideFilter === 'sideB') {
      return list.filter(m => m.side === 'B');
    }
    return list;
  }, [activeStage, sideFilter, oitavasMatches, quartasMatches, semisMatches, finalMatch]);


  // Font resizing helper for aesthetic balance
  const formatNameClass = (name: string) => {
    if (name.length > 18) {
      return 'text-[9.5px] sm:text-[10px] leading-[1.1] font-bold';
    } else if (name.length > 14) {
      return 'text-[11px] sm:text-xs leading-tight font-extrabold';
    }
    return 'text-xs sm:text-sm font-black';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Exquisite Top Banner featuring pure gold highlight */}
      <div className="relative overflow-hidden p-6 rounded-3xl border border-[#D4AF37]/35 bg-[#121212]/90 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-black tracking-widest mb-2">
              <Trophy className="w-2.5 h-2.5" /> Copa B10 • Fase Final (Finais)
            </span>
            <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">
              Chaveamento de Campeões
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Dos 16-avos em diante: acompanhe a escalada de sobrevivência pelo Lado A e Lado B até a Grande Final da Rodada {rFinalSingle}.
            </p>
          </div>
          
          <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex items-center gap-3.5 flex-shrink-0 text-xs font-mono">
            <div className="p-2 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Arena Principal</span>
              <span className="text-[#D4AF37] font-extrabold uppercase text-[10px]">COROA MÁXIMA B10</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> Lado A (Duelos Ímpares da Fase 4)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60" /> Lado B (Duelos Pares da Fase 4)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Oitavas, Quartas & Semis: Duelos agregados (180 min). Final: Jogo Único.
          </span>
        </div>
      </div>

      {/* Vitrine de Consagração Suprema com Destaque Dourado */}
      <div className="backdrop-blur-xl bg-black/40 border border-[#D4AF37]/30 rounded-3xl p-6 md:p-8 mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
        <h2 className="text-xl md:text-2xl font-display font-black text-[#D4AF37] text-center mb-6 uppercase tracking-wider flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-[#D4AF37]" /> Vitrine de Consagração <Trophy className="w-6 h-6 text-[#D4AF37]" />
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Campeão 🥇', val: podium.champion, border: 'border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)] bg-gradient-to-b from-[#D4AF37]/10 to-transparent' },
            { label: 'Vice-Campeão 🥈', val: podium.runnerUp, border: 'border-slate-400/35 backdrop-blur' },
            { label: '3º Lugar 🥉', val: podium.third, border: 'border-[#D4AF37]/30 bg-[#D4AF37]/5' },
            { label: '4º Lugar 🎖️', val: podium.fourth, border: 'border-slate-800/60' }
          ].map((pos, i) => (
            <div key={i} className={`p-4 rounded-2xl border text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.03] ${pos.border}`}>
              <div className="text-[10px] uppercase font-mono font-black text-slate-400 tracking-wider mb-2">{pos.label}</div>
              <div className="h-16 flex flex-col items-center justify-center">
                {pos.val ? (
                  <div className="flex flex-col items-center text-center">
                    {pos.val.shieldUrl ? (
                      <div className="w-8 h-8 mb-1 flex items-center justify-center">
                        <TeamShield shieldUrl={pos.val.shieldUrl} fallbackText={pos.val.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <Crown className={`w-6 h-6 mb-1 ${i === 0 ? 'text-[#D4AF37]' : i === 2 ? 'text-amber-500' : 'text-slate-500'}`} />
                    )}
                    <div className="truncate font-display font-black uppercase tracking-wider text-[11px] max-w-[140px] text-white">
                      {pos.val.name}
                    </div>
                    {pos.val.owner && (
                      <div className="text-[9px] text-slate-500 font-mono truncate max-w-[135px]">
                        Téc: {pos.val.owner}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-slate-600 font-mono text-xs font-black flex items-center gap-1.5 uppercase">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-slate-700" /> TBD
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid selector representing stages */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-2">
        {/* Navigation stages tabs */}
        <div className="flex bg-black/40 rounded-xl p-1 border border-white/5 overflow-x-auto gap-1 self-start">
          <button
            onClick={() => setActiveStage('oitavas')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-black uppercase tracking-wider transition-all flex-shrink-0 ${
              activeStage === 'oitavas'
                ? 'bg-[#D4AF37] text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Oitavas (R{rOitavasIda}-R{rOitavasVolta})
          </button>
          
          <button
            onClick={() => setActiveStage('quartas')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-black uppercase tracking-wider transition-all flex-shrink-0 ${
              activeStage === 'quartas'
                ? 'bg-[#D4AF37] text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quartas (R{rQuartasIda}-R{rQuartasVolta})
          </button>

          <button
            onClick={() => setActiveStage('semis')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-black uppercase tracking-wider transition-all flex-shrink-0 ${
              activeStage === 'semis'
                ? 'bg-[#D4AF37] text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semis (R{rSemiIda}-{rSemiVolta})
          </button>

          <button
            onClick={() => setActiveStage('final')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-black uppercase tracking-wider transition-all flex-shrink-0 ${
              activeStage === 'final'
                ? 'bg-[#D4AF37] text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Grande Final (R{rFinalSingle})
          </button>
        </div>

        {/* Side selection filters (only for non-Final stages) */}
        {activeStage !== 'final' && (
          <div className="flex bg-black/20 rounded-lg p-0.5 border border-white/5 text-[10px] font-mono select-none self-end">
            <button
              onClick={() => setSideFilter('all')}
              className={`px-3 py-1.5 rounded transition ${
                sideFilter === 'all' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Todos Duelos
            </button>
            <button
              onClick={() => setSideFilter('sideA')}
              className={`px-3 py-1.5 rounded transition ${
                sideFilter === 'sideA' ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Lado A
            </button>
            <button
              onClick={() => setSideFilter('sideB')}
              className={`px-3 py-1.5 rounded transition ${
                sideFilter === 'sideB' ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-semibold' : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              Lado B
            </button>
          </div>
        )}
      </div>

      {/* Render selected matches in beautiful Glassmorphic cards with gold borders */}
      {activeStage === 'final' ? (
        <MainEvent 
          finalMatch={finalMatch} 
          thirdPlaceMatch={thirdPlaceMatch} 
          round={rFinalSingle} 
        />
      ) : (
        /* Regular Matches list for other phases */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {renderedMatches.map((match) => {
            const { team1, team2, winner, isPlayed, tiebreakerApplied, side } = match;

            const isAggregated = activeStage === 'oitavas' || activeStage === 'quartas' || activeStage === 'semis';
            const score1Value = isAggregated ? match.totalScore1 : match.score1;
            const score2Value = isAggregated ? match.totalScore2 : match.score2;

            return (
              <div 
                key={match.id}
                className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/25 hover:border-[#D4AF37]/65 bg-black/55 backdrop-blur-[12px] p-4 transition-all duration-300 shadow-lg group hover:shadow-[0_8px_20px_rgba(212,175,55,0.06)] flex flex-col justify-between min-h-[185px]"
              >
                {/* Match Header info */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-[9px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 uppercase tracking-wider font-extrabold">
                      {match.name || `Duelo #${match.id}`}
                    </span>
                    <span className={`px-1 py-[1.5px] rounded-full text-[7.5px] font-black tracking-widest ${
                      side === 'A' ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'bg-blue-500/10 text-blue-300'
                    }`}>
                      Lado {side}
                    </span>
                  </div>
                  {isPlayed ? (
                    <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                      Finalizado
                    </span>
                  ) : (
                    <span className="text-[8px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-black uppercase tracking-widest px-1.5 py-0.5 rounded">
                      Em Campo
                    </span>
                  )}
                </div>

                {/* Match Play Layout */}
                <div className="grid grid-cols-11 items-center gap-1 py-1">
                  
                  {/* Left Team */}
                  <div className={`col-span-4 flex flex-col items-center text-center transition-all duration-300 ${
                    isPlayed && winner === 'team2' ? 'grayscale opacity-40' : ''
                  }`}>
                    <div className={`w-11 h-11 bg-zinc-950 rounded-full border p-1.5 flex items-center justify-center mb-1.5 shadow-inner transition-transform group-hover:scale-105 duration-300 ${
                      winner === 'team1' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/25 bg-gradient-to-b from-[#D4AF37]/15 to-transparent' : 'border-white/5'
                    }`}>
                      {team1.shieldUrl ? (
                        <TeamShield shieldUrl={team1.shieldUrl} fallbackText={team1.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-full text-slate-500">
                          <Crown className="w-4 h-4 opacity-75" />
                        </div>
                      )}
                    </div>
                    
                    <div className="h-8 flex flex-col justify-center min-w-0 w-full mb-1">
                      <span className={`uppercase truncate font-display tracking-wide ${formatNameClass(team1.name)} ${
                        winner === 'team1' ? 'text-white font-black' : winner === 'team2' ? 'text-slate-500' : 'text-slate-200'
                      }`} title={team1.name}>
                        {team1.name}
                      </span>
                      <span className="text-[8px] text-slate-400 font-mono truncate" title={team1.owner}>
                        Téc: {team1.owner || 'A definir'}
                      </span>
                    </div>

                    <span className="text-[7.5px] font-mono px-1 py-0.5 rounded bg-white/5 text-slate-400">
                      {team1.isVirtual ? 'Virtual' : `#${team1.rank}º`}
                    </span>
                  </div>

                  {/* VS center container (Simple fallback for dual-legs, scores in central subpanel) */}
                  <div className="col-span-3 flex flex-col items-center justify-center">
                    {isPlayed && !isAggregated ? (
                      <div className="flex flex-col items-center w-full text-center">
                        <div className="bg-black/60 border border-white/5 py-1 px-1.5 rounded-lg w-full flex flex-col items-center">
                          <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-black">
                            <span className={winner === 'team1' ? 'text-[#D4AF37]' : 'text-slate-400'}>
                              {score1Value.toFixed(2)}
                            </span>
                            <span className="text-slate-700 text-[8px]">:</span>
                            <span className={winner === 'team2' ? 'text-[#D4AF37]' : 'text-slate-400'}>
                              {score2Value.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <span className="text-[7px] font-mono uppercase bg-white/5 border border-white/5 text-slate-500 px-1 py-0.2 mt-1 rounded">
                          {tiebreakerApplied ? 'C.D.' : 'VS'}
                        </span>
                      </div>
                    ) : (
                      <div className="relative flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[9px] font-mono font-black text-slate-400 tracking-wider">
                          VS
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Team */}
                  <div className={`col-span-4 flex flex-col items-center text-center transition-all duration-300 ${
                    isPlayed && winner === 'team1' ? 'grayscale opacity-40' : ''
                  }`}>
                    <div className={`w-11 h-11 bg-zinc-950 rounded-full border p-1.5 flex items-center justify-center mb-1.5 shadow-inner transition-transform group-hover:scale-105 duration-300 ${
                      winner === 'team2' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/25 bg-gradient-to-b from-[#D4AF37]/15 to-transparent' : 'border-white/5'
                    }`}>
                      {team2.shieldUrl ? (
                        <TeamShield shieldUrl={team2.shieldUrl} fallbackText={team2.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-full text-slate-500">
                          <Crown className="w-4 h-4 opacity-75" />
                        </div>
                      )}
                    </div>
                    
                    <div className="h-8 flex flex-col justify-center min-w-0 w-full mb-1">
                      <span className={`uppercase truncate font-display tracking-wide ${formatNameClass(team2.name)} ${
                        winner === 'team2' ? 'text-white font-black' : winner === 'team1' ? 'text-slate-500' : 'text-slate-200'
                      }`} title={team2.name}>
                        {team2.name}
                      </span>
                      <span className="text-[8px] text-slate-400 font-mono truncate" title={team2.owner}>
                        Téc: {team2.owner || 'A definir'}
                      </span>
                    </div>

                    <span className="text-[7.5px] font-mono px-1 py-0.5 rounded bg-white/5 text-slate-400">
                      {team2.isVirtual ? 'Virtual' : `#${team2.rank}º`}
                    </span>
                  </div>

                </div>

                {/* 180-Minute View: split card for aggregate matches */}
                {isAggregated && (
                  <div className="mt-3.5 space-y-2.5">
                    {/* The Split leg scores block */}
                    <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                      {/* Left Side: Ida Score */}
                      <div className="bg-black/45 border border-white/5 rounded-xl p-2 flex flex-col justify-between">
                        <span className="text-[7.5px] uppercase tracking-widest text-slate-500 block mb-1">Ida</span>
                        <div className="font-extrabold text-white text-xs tracking-wider">
                          {(match.score1_r1 || 0).toFixed(2)} <span className="text-slate-600 text-[9px]">:</span> {(match.score2_r1 || 0).toFixed(2)}
                        </div>
                      </div>

                      {/* Right Side: Volta Score or status */}
                      <div className="bg-black/45 border border-white/5 rounded-xl p-2 flex flex-col justify-between">
                        <span className="text-[7.5px] uppercase tracking-widest text-slate-500 block mb-1">Volta</span>
                        {isPlayed ? (
                          <div className="font-extrabold text-white text-xs tracking-wider">
                            {(match.score1_r2 || 0).toFixed(2)} <span className="text-slate-600 text-[9px]">:</span> {(match.score2_r2 || 0).toFixed(2)}
                          </div>
                        ) : (
                          <span className="text-[8.5px] text-amber-500/90 font-mono font-bold animate-pulse leading-none py-1">Iniciando</span>
                        )}
                      </div>
                    </div>

                    {/* Centralized AGREGADO section */}
                    <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/20 to-emerald-500/10 border border-emerald-500/25 rounded-2xl p-2 text-center shadow-[0_4px_12px_rgba(16,185,129,0.05)] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
                      <span className="text-[8.5px] text-emerald-400 uppercase tracking-widest font-mono font-black block">
                        AGREGADO
                      </span>
                      <div className="text-sm font-mono font-black tracking-wider text-white mt-0.5">
                        {score1Value.toFixed(2)} <span className="text-emerald-500/60">:</span> {score2Value.toFixed(2)}
                      </div>
                      {tiebreakerApplied && (
                        <span className="text-[6.5px] uppercase font-mono font-bold text-[#D4AF37] block mt-0.5">
                          Desempate Aplicado
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Qualifier state */}
                {isPlayed && winner && (
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono">
                    <span className="text-slate-500">Classifica:</span>
                    <div className="flex items-center gap-1 font-bold text-emerald-400 uppercase">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                      <span className="truncate max-w-[95px]" title={winner === 'team1' ? team1.name : team2.name}>
                        {winner === 'team1' ? team1.name : team2.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
