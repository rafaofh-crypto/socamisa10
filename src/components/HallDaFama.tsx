import React, { useMemo } from "react";
import { Trophy, Star, Shield, Award, Sparkles, AlertCircle, Heart } from "lucide-react";
import TeamShield from "./TeamShield";
import { CartolaTeam } from "../services/cartollaApi";
import { calculateStandings, getActiveRounds } from "../services/rankings";
import {
  processCuttingRound,
  getBestThirdPlaced,
  allocateThirdPlacedTeams,
  buildFullBracket,
  processMatchResults,
  determineFinalRankings
} from "../tournamentData";

interface HallDaFamaProps {
  teams: CartolaTeam[];
  currentRound: number;
}

export default function HallDaFama({ teams, currentRound }: HallDaFamaProps) {
  // 1. Calculate General Standings (Leaderboard) for Overall Championship (38 rounds)
  const generalStandings = useMemo(() => {
    const rounds = getActiveRounds(currentRound, "acumulado");
    return calculateStandings(teams, rounds);
  }, [teams, currentRound]);

  const generalPodium = useMemo(() => {
    if (generalStandings.length === 0) return null;
    return {
      champion: generalStandings[0],
      runnerUp: generalStandings[1],
      third: generalStandings[2]
    };
  }, [generalStandings]);

  // 2. Solve Copa M10 Podium Dynamically
  const m10Podium = useMemo(() => {
    if (teams.length === 0) return null;
    try {
      // Copa M10 cut round is 20
      const cutRound = 20;
      const cuttingResult = processCuttingRound(cutRound, teams);
      if (!cuttingResult) return null;

      const groupsToPopulate = cuttingResult.groups;
      const populatedGroups: Record<string, any[]> = {};

      for (const [letter, teamList] of Object.entries(groupsToPopulate)) {
        populatedGroups[letter] = (teamList as any[]).map(t => {
          const match = teams.find(ct => ct.name === t.name);
          const r1 = match ? (match.scores[cutRound + 1] || 0) : 0;
          const r2 = match ? (match.scores[cutRound + 2] || 0) : 0;
          const r3 = match ? (match.scores[cutRound + 3] || 0) : 0;
          return {
            ...t,
            groupRound1: r1,
            groupRound2: r2,
            groupRound3: r3,
            points: Number((r1 + r2 + r3).toFixed(2))
          };
        });
      }

      const groupResults: Record<string, any> = {};
      const allTeamsList: any[] = [];

      for (const [letter, teamList] of Object.entries(populatedGroups)) {
        const sorted = [...teamList].sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
          if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
          return a.position - b.position;
        });
        groupResults[`group_${letter}`] = {
          first: sorted[0],
          second: sorted[1],
          third: sorted[2],
          fourth: sorted[3]
        };
        allTeamsList.push(...sorted);
      }

      const bestThirds = getBestThirdPlaced(allTeamsList);
      const allocation = allocateThirdPlacedTeams(bestThirds);
      const bracket = buildFullBracket(groupResults, allocation.allocations);

      const tiebreakers: Record<number, any> = {};
      for (const team of allTeamsList) {
        tiebreakers[team.qualifyingPosition] = {
          groupPoints: team.points,
          qualifyingPos: team.qualifyingPosition,
          cartolaRank: teams.findIndex(x => x.id === team.id)
        };
      }

      // Empty manualScores for programmatic computation
      const manualScores = {};
      processMatchResults(bracket, 'round_of_32', manualScores, tiebreakers);
      processMatchResults(bracket, 'round_of_16', manualScores, tiebreakers);
      processMatchResults(bracket, 'quarterfinals', manualScores, tiebreakers);
      processMatchResults(bracket, 'semifinals', manualScores, tiebreakers);
      processMatchResults(bracket, 'final', manualScores, tiebreakers);
      processMatchResults(bracket, 'third_place', manualScores, tiebreakers);

      const rk = determineFinalRankings(bracket);
      return {
        champion: rk.champion,
        runnerUp: rk.runner_up,
        third: rk.third_place,
        fourth: rk.fourth_place
      };
    } catch (e) {
      console.error("M10 Hall of fame calculation error:", e);
      return null;
    }
  }, [teams]);

  // 3. Solve Copa B10 Podium Dynamically
  const b10Podium = useMemo(() => {
    if (teams.length === 0) return null;
    try {
      const b10Round = 25;
      
      // Calculate league rank first
      const sortedByLeague = [...teams].map(t => {
        const totalPoints = Object.values(t.scores).reduce((acc, curr) => acc + curr, 0);
        return { team: t, totalPoints };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((item, idx) => ({
        ...item.team,
        totalLeaguePoints: item.totalPoints,
        leagueRank: idx + 1
      }));

      // Map Copa B10 classification
      const sortedB10Standings = sortedByLeague.map(t => {
        const scoreInRound = typeof t.scores[b10Round] === 'number' ? t.scores[b10Round] : 0;
        return { ...t, b10RoundScore: Number(scoreInRound.toFixed(2)), prevPhaseScore: 0 };
      })
      .sort((a, b) => {
        if (Math.abs(b.b10RoundScore - a.b10RoundScore) > 0.001) return b.b10RoundScore - a.b10RoundScore;
        return a.leagueRank - b.leagueRank;
      });

      const mappedB10Teams = sortedB10Standings.map((team, index) => {
        const category = index < 16 ? 'ELITE' : index >= 46 ? 'REPESCAGEM' : 'ACESSO';
        return { ...team, category, rank: index + 1 };
      });

      const repescagemGroup = mappedB10Teams.filter(t => t.category === 'REPESCAGEM');
      const acessoGroup = mappedB10Teams.filter(t => t.category === 'ACESSO');
      const eliteGroup = mappedB10Teams.filter(t => t.category === 'ELITE');

      // Repescagem (Phase 2)
      const f2Rounds = [b10Round + 1, b10Round + 2, b10Round + 3];
      const repescagemData = repescagemGroup.map(t => {
        const s2 = t.scores[f2Rounds[0]] || 0;
        const s3 = t.scores[f2Rounds[1]] || 0;
        const s4 = t.scores[f2Rounds[2]] || 0;
        return { ...t, totalAccumulated: Number((s2 + s3 + s4).toFixed(2)), isTop2: false };
      })
      .sort((a, b) => {
        if (Math.abs(b.totalAccumulated - a.totalAccumulated) > 0.001) return b.totalAccumulated - a.totalAccumulated;
        return a.leagueRank - b.leagueRank;
      });

      repescagemData[0].isTop2 = true;
      if (repescagemData[1]) repescagemData[1].isTop2 = true;

      const repClassified = repescagemData.filter(t => t.isTop2);

      // Play-offs (Phase 3) - in R29
      const f3Round = b10Round + 4;
      const pfMatches = [];
      if (acessoGroup[0] && repClassified[1]) pfMatches.push({ t1: acessoGroup[0], t2: repClassified[1] });
      if (acessoGroup[1] && repClassified[0]) pfMatches.push({ t1: acessoGroup[1], t2: repClassified[0] });

      for (let i = 0; i < 14; i++) {
        const t1 = acessoGroup[2 + i];
        const t2 = acessoGroup[29 - i];
        if (t1 && t2) pfMatches.push({ t1, t2 });
      }

      const playoffWinners = pfMatches.map(m => {
        const sc1 = m.t1.scores[f3Round] || 0;
        const sc2 = m.t2.scores[f3Round] || 0;
        let winnerTeam = sc1 > sc2 ? m.t1 : m.t2;
        if (Math.abs(sc1 - sc2) < 0.001) {
          winnerTeam = m.t1.rank < m.t2.rank ? m.t1 : m.t2;
        }
        return { ...winnerTeam, seedRank: winnerTeam.rank };
      });

      const sortedPlayoffWinnersDesc = [...playoffWinners].sort((a, b) => b.seedRank - a.seedRank);

      // Round of 32 (Phase 4) - in R30
      const f4Round = b10Round + 5;
      const r32Matches = [];
      for (let i = 0; i < 16; i++) {
        const home = eliteGroup[i];
        const away = sortedPlayoffWinnersDesc[i];
        if (home && away) r32Matches.push({ home, away });
      }

      const r32Winners = r32Matches.map(m => {
        const sHome = m.home.scores[f4Round] || 0;
        const sAway = m.away.scores[f4Round] || 0;
        let win = sHome > sAway ? m.home : m.away;
        if (Math.abs(sHome - sAway) < 0.001) {
          win = m.home.rank < m.away.rank ? m.home : m.away;
        }
        return win;
      });

      // Simple resolver for Double Legged Stages (Soma simples de Ida e Volta)
      const resolveTiebreaker = (t1: any, t2: any) => {
        // Priority #1: Phase Rank
        if (t1.rank !== t2.rank) {
          return t1.rank < t2.rank ? "team1" : "team2";
        }
        // Priority #2: Group Stage Score (Rorte/Fase 1 is equivalent)
        if (Math.abs(t1.b10RoundScore - t2.b10RoundScore) > 0.001) {
          return t1.b10RoundScore > t2.b10RoundScore ? "team1" : "team2";
        }
        // Priority #3: League Rank on Cartola
        return t1.leagueRank < t2.leagueRank ? "team1" : "team2";
      };

      const resolveDoubleLegMatch = (t1: any, t2: any, rIda: number, rVolta: number) => {
        const s1_1 = t1.scores[rIda] || 0;
        const s1_2 = t1.scores[rVolta] || 0;
        const s2_1 = t2.scores[rIda] || 0;
        const s2_2 = t2.scores[rVolta] || 0;

        const agg1 = Number((s1_1 + s1_2).toFixed(2));
        const agg2 = Number((s2_1 + s2_2).toFixed(2));

        if (agg1 > agg2) return { winner: 'team1', team1: t1, team2: t2 };
        if (agg2 > agg1) return { winner: 'team2', team1: t1, team2: t2 };

        const tb = resolveTiebreaker(t1, t2);
        return { winner: tb, team1: t1, team2: t2 };
      };

      // Oitavas (Phase 5) - R31 & R32
      const rOitavasIda = b10Round + 6;
      const rOitavasVolta = b10Round + 7;
      const oitavasMatchesIdx = [
        { t1Idx: 0, t2Idx: 14 },
        { t1Idx: 2, t2Idx: 12 },
        { t1Idx: 4, t2Idx: 10 },
        { t1Idx: 6, t2Idx: 8 },
        { t1Idx: 1, t2Idx: 15 },
        { t1Idx: 3, t2Idx: 13 },
        { t1Idx: 5, t2Idx: 11 },
        { t1Idx: 7, t2Idx: 9 }
      ];

      const oitavasWinners = oitavasMatchesIdx.map(item => {
        const t1 = r32Winners[item.t1Idx];
        const t2 = r32Winners[item.t2Idx];
        if (!t1 || !t2) return null;
        const res = resolveDoubleLegMatch(t1, t2, rOitavasIda, rOitavasVolta);
        return res.winner === 'team1' ? res.team1 : res.team2;
      }).filter(Boolean);

      // Quartas (Phase 6) - R33 & R34
      const rQuartasIda = b10Round + 8;
      const rQuartasVolta = b10Round + 9;
      
      const quartasWinners = [
        resolveDoubleLegMatch(oitavasWinners[0], oitavasWinners[3], rQuartasIda, rQuartasVolta),
        resolveDoubleLegMatch(oitavasWinners[1], oitavasWinners[2], rQuartasIda, rQuartasVolta),
        resolveDoubleLegMatch(oitavasWinners[4], oitavasWinners[7], rQuartasIda, rQuartasVolta),
        resolveDoubleLegMatch(oitavasWinners[5], oitavasWinners[6], rQuartasIda, rQuartasVolta)
      ].map(res => {
        return res.winner === 'team1' ? res.team1 : res.team2;
      });

      // Semis (Phase 7) - R35 & R36
      const rSemiIda = b10Round + 10;
      const rSemiVolta = b10Round + 11;

      const semi1 = resolveDoubleLegMatch(quartasWinners[0], quartasWinners[1], rSemiIda, rSemiVolta);
      const semi2 = resolveDoubleLegMatch(quartasWinners[2], quartasWinners[3], rSemiIda, rSemiVolta);

      const f1 = semi1.winner === 'team1' ? semi1.team1 : semi1.team2;
      const l1 = semi1.winner === 'team1' ? semi1.team2 : semi1.team1;
      const f2 = semi2.winner === 'team1' ? semi2.team1 : semi2.team2;
      const l2 = semi2.winner === 'team1' ? semi2.team2 : semi2.team1;

      // Super Final (Phase 8) - R37 Single Match
      const rFinalSingle = b10Round + 12; // R37
      const scF1 = f1.scores[rFinalSingle] || 0;
      const scF2 = f2.scores[rFinalSingle] || 0;

      let b10Champion = scF1 > scF2 ? f1 : f2;
      let b10RunnerUp = scF1 > scF2 ? f2 : f1;
      if (Math.abs(scF1 - scF2) < 0.001) {
        const tb = resolveTiebreaker(f1, f2);
        b10Champion = tb === 'team1' ? f1 : f2;
        b10RunnerUp = tb === 'team1' ? f2 : f1;
      }

      // 3rd place
      const scL1 = l1.scores[rFinalSingle] || 0;
      const scL2 = l2.scores[rFinalSingle] || 0;
      let b10Third = scL1 > scL2 ? l1 : l2;
      if (Math.abs(scL1 - scL2) < 0.001) {
        const tb = resolveTiebreaker(l1, l2);
        b10Third = tb === 'team1' ? l1 : l2;
      }

      return {
        champion: b10Champion,
        runnerUp: b10RunnerUp,
        third: b10Third
      };
    } catch (e) {
      console.error("B10 Hall of fame calculation error:", e);
      return null;
    }
  }, [teams]);

  return (
    <div className="space-y-8 animate-fadeIn" id="hall-of-fame-section">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-600/20 via-[#D4AF37]/15 to-emerald-600/10 border border-[#D4AF37]/35 p-6 rounded-3xl relative overflow-hidden text-center max-w-4xl mx-auto shadow-2xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full text-gold text-[10px] font-mono font-black uppercase tracking-wider animate-pulse mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          GALA DE ENCERRAMENTO • RODADA 38
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3.5xl text-white uppercase tracking-tight">
          HALL DA FAMA SÓ CAMISA 10
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl mx-auto">
          Consagramos oficialmente os lendários treinadores e clubes campeões do ecossistema de ligas e copas de futebol virtual da temporada 2026. A glória é eterna e de direito aos vitoriosos!
        </p>
      </div>

      {/* Majestic Hall Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. COMPONENT: CAMPEONATO GERAL PODIUM */}
        {generalPodium && (
          <div className="bg-[#121212]/90 border border-[#D4AF37]/35 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[460px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono font-black text-white bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                  👑 CAMPEONATO GERAL (38R)
                </span>
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>

              {/* Gold Champion Spotlight */}
              <div className="bg-gradient-to-b from-amber-600/10 to-transparent border border-amber-500/30 rounded-xl p-5 text-center flex flex-col items-center">
                <Trophy className="w-10 h-10 text-amber-500 mb-2.5 animate-bounce" />
                <div className="w-16 h-16 bg-amber-500/15 p-2 rounded-full border-2 border-amber-500 flex items-center justify-center">
                  <TeamShield shieldUrl={generalPodium.champion.shieldUrl} fallbackText={generalPodium.champion.name} />
                </div>
                <h4 className="font-display font-black text-base text-white uppercase leading-tight mt-3 tracking-wide">
                  {generalPodium.champion.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium">{generalPodium.champion.owner}</p>
                <div className="mt-3 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full">
                  <span className="font-mono text-[11px] font-extrabold text-amber-400">{generalPodium.champion.calculatedPoints} pts</span>
                </div>
              </div>

              {/* Runners up list */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-black text-xs text-slate-400">2º</span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <TeamShield shieldUrl={generalPodium.runnerUp.shieldUrl} fallbackText={generalPodium.runnerUp.name} />
                    </div>
                    <div>
                      <p className="font-display font-extrabold text-xs text-white truncate max-w-[150px]">{generalPodium.runnerUp.name}</p>
                      <p className="text-[10px] text-slate-400">{generalPodium.runnerUp.owner}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-300">{generalPodium.runnerUp.calculatedPoints} pts</span>
                </div>

                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-black text-xs text-amber-700">3º</span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <TeamShield shieldUrl={generalPodium.third.shieldUrl} fallbackText={generalPodium.third.name} />
                    </div>
                    <div>
                      <p className="font-display font-extrabold text-xs text-white truncate max-w-[150px]">{generalPodium.third.name}</p>
                      <p className="text-[10px] text-slate-400">{generalPodium.third.owner}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-600">{generalPodium.third.calculatedPoints} pts</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>PRÊMIO: SOBERANO DAS 38R</span>
              <span className="text-amber-400 font-bold">R$ 500,00 + 🏆</span>
            </div>
          </div>
        )}

        {/* 2. COMPONENT: COPA M10 PODIUM */}
        {m10Podium && (
          <div className="bg-[#121212]/90 border border-blue-500/15 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[460px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
                  🏆 COPA M10 (WORLD CUP)
                </span>
                <Star className="w-5 h-5 text-blue-400" />
              </div>

              {/* Blue Champion Spotlight */}
              <div className="bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/30 rounded-xl p-5 text-center flex flex-col items-center">
                <Trophy className="w-10 h-10 text-blue-400 mb-2.5 animate-bounce" />
                <div className="w-16 h-16 bg-blue-400/15 p-2 rounded-full border-2 border-blue-400 flex items-center justify-center">
                  <TeamShield shieldUrl={m10Podium.champion.shieldUrl} fallbackText={m10Podium.champion.name} />
                </div>
                <h4 className="font-display font-black text-base text-white uppercase leading-tight mt-3 tracking-wide">
                  {m10Podium.champion.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium">{m10Podium.champion.owner}</p>
                <div className="mt-3 bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full">
                  <span className="font-mono text-[11px] font-extrabold text-blue-400">CAMPEÃO DA COPA</span>
                </div>
              </div>

              {/* Runners up list */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-black text-xs text-slate-400">2º</span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <TeamShield shieldUrl={m10Podium.runnerUp.shieldUrl} fallbackText={m10Podium.runnerUp.name} />
                    </div>
                    <div>
                      <p className="font-display font-extrabold text-xs text-white truncate max-w-[150px]">{m10Podium.runnerUp.name}</p>
                      <p className="text-[10px] text-slate-400">{m10Podium.runnerUp.owner}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-350">VICE</span>
                </div>

                {m10Podium.third && (
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-sans font-black text-xs text-amber-700">3º</span>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <TeamShield shieldUrl={m10Podium.third.shieldUrl} fallbackText={m10Podium.third.name} />
                      </div>
                      <div>
                        <p className="font-display font-extrabold text-xs text-white truncate max-w-[150px]">{m10Podium.third.name}</p>
                        <p className="text-[10px] text-slate-400">{m10Podium.third.owner}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-600">3º LUGAR</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>PRÊMIO COPA CLÁSSICA</span>
              <span className="text-blue-400 font-bold">R$ 300,00 + 🏆</span>
            </div>
          </div>
        )}

        {/* 3. COMPONENT: COPA B10 PODIUM */}
        {b10Podium && (
          <div className="bg-[#121212]/90 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[460px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                  🏆 COPA B10 (ELITE BRASIL)
                </span>
                <Award className="w-5 h-5 text-emerald-400" />
              </div>

              {/* Emerald Champion Spotlight */}
              <div className="bg-gradient-to-b from-emerald-600/10 to-transparent border border-emerald-500/30 rounded-xl p-5 text-center flex flex-col items-center">
                <Trophy className="w-10 h-10 text-emerald-400 mb-2.5 animate-bounce" />
                <div className="w-16 h-16 bg-emerald-400/15 p-2 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                  <TeamShield shieldUrl={b10Podium.champion.shieldUrl} fallbackText={b10Podium.champion.name} />
                </div>
                <h4 className="font-display font-black text-base text-white uppercase leading-tight mt-3 tracking-wide">
                  {b10Podium.champion.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium">{b10Podium.champion.owner}</p>
                <div className="mt-3 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                  <span className="font-mono text-[11px] font-extrabold text-emerald-400">CAMPEÃO DA ELITE</span>
                </div>
              </div>

              {/* Runners up list */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-black text-xs text-slate-400">2º</span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <TeamShield shieldUrl={b10Podium.runnerUp.shieldUrl} fallbackText={b10Podium.runnerUp.name} />
                    </div>
                    <div>
                      <p className="font-display font-extrabold text-xs text-white truncate max-w-[150px]">{b10Podium.runnerUp.name}</p>
                      <p className="text-[10px] text-slate-400">{b10Podium.runnerUp.owner}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-350">VICE</span>
                </div>

                {b10Podium.third && (
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-sans font-black text-xs text-amber-700">3º</span>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <TeamShield shieldUrl={b10Podium.third.shieldUrl} fallbackText={b10Podium.third.name} />
                      </div>
                      <div>
                        <p className="font-display font-extrabold text-xs text-white truncate max-w-[150px]">{b10Podium.third.name}</p>
                        <p className="text-[10px] text-slate-400">{b10Podium.third.owner}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-600">3º LUGAR</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>PRÊMIO COPA ELITE</span>
              <span className="text-emerald-400 font-bold">R$ 300,00 + 🏆</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
