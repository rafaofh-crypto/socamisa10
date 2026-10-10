import React, { useMemo } from "react";
import { Trophy, Star, Shield, Award, Sparkles, AlertCircle, Heart, Crown } from "lucide-react";
import TeamShield from "./TeamShield";
import { CartolaTeam } from "../services/cartollaApi";
import { calculateStandings, getActiveRounds } from "../services/rankings";
import {
  processCuttingRound,
  buildFullBracket,
  processMatchResults,
  determineFinalRankings
} from "../services/knockout";
import { getBestThirdPlaced, allocateThirdPlacedTeams } from "../tournamentData";

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

  // 2. Solve Copa M10 Podium Dynamically (reusing exact MataMata logic)
  const m10Podium = useMemo(() => {
    if (!teams || teams.length === 0) return null;
    try {
      const cutRound = 20;
      const cuttingResult = processCuttingRound(cutRound, teams);
      if (!cuttingResult) return null;

      const groupsToPopulate = cuttingResult.groups;
      const populatedGroups: Record<string, any[]> = {};

      for (const [letter, teamList] of Object.entries(groupsToPopulate)) {
        populatedGroups[letter] = (teamList as any[]).map(t => {
          const match = teams.find(ct => ct.name === t.name);
          const r1 = match ? (match.scores?.[22] || 0) : 0;
          const r2 = match ? (match.scores?.[23] || 0) : 0;
          const r3 = match ? (match.scores?.[24] || 0) : 0;
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

      const normalize = (str: string) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
      const getTeamScoreForRound = (team: any, roundNum: number) => {
        if (!team || !team.name) return null;
        const teamKey = normalize(team.name);
        const found = teams.find(ct => {
          const ctKey = normalize(ct.name);
          return ctKey === teamKey || (team.owner && normalize(ct.owner) === normalize(team.owner));
        });
        if (found && found.scores && typeof found.scores[roundNum] === "number") {
          return found.scores[roundNum];
        }
        return null;
      };

      const PHASE_ROUNDS: Record<string, number> = {
        round_of_32: 25,
        round_of_16: 26,
        quarterfinals: 27,
        semifinals: 28,
        final: 29,
        third_place: 29
      };

      const phases = ["round_of_32", "round_of_16", "quarterfinals", "semifinals", "final", "third_place"] as const;

      for (const phase of phases) {
        const phaseRound = PHASE_ROUNDS[phase];
        const effectiveScores: Record<string, { home: number; away: number }> = {};
        if (bracket[phase]) {
          for (const [matchCode, match] of Object.entries(bracket[phase] as Record<string, any>)) {
            if (match.home && match.away) {
              const homeScore = getTeamScoreForRound(match.home, phaseRound);
              const awayScore = getTeamScoreForRound(match.away, phaseRound);
              if (homeScore !== null && awayScore !== null) {
                effectiveScores[matchCode] = { home: homeScore, away: awayScore };
              }
            }
          }
        }
        processMatchResults(bracket, phase, effectiveScores, tiebreakers);
      }

      const rk = determineFinalRankings(bracket);
      return {
        champion: rk.champion,
        runnerUp: rk.runner_up,
        third: rk.third_place,
        fourth: rk.fourth_place,
        finalScore: bracket.final?.M101 ? {
          home: bracket.final.M101.homeScore,
          away: bracket.final.M101.awayScore
        } : null,
        thirdScore: bracket.third_place?.M102 ? {
          home: bracket.third_place.M102.homeScore,
          away: bracket.third_place.M102.awayScore
        } : null
      };
    } catch (e) {
      console.error("M10 Hall of fame calculation error:", e);
      return null;
    }
  }, [teams]);

  // 3. Status da Copa B10: Torneio em andamento (Fase 4 • Elite 32 em R29 e R30)
  // De acordo com o regulamento oficial, a Copa B10 só é finalizada na R37. Não antecipar títulos!
  const b10Status = useMemo(() => {
    return {
      isCompleted: false,
      phaseName: "Fase 4 • Elite 32 (16-avos de Final)",
      roundsLabel: "Rodadas 29 e 30 (Duelos de 180 Min)",
      description: "32 equipes disputam vagas nas Oitavas em confrontos de ida e volta. A consagração do Campeão da Copa B10 ocorrerá na Grande Final (Rodada 37)."
    };
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn" id="hall-of-fame-section">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-600/20 via-[#D4AF37]/15 to-emerald-600/10 border border-[#D4AF37]/35 p-6 rounded-3xl relative overflow-hidden text-center max-w-4xl mx-auto shadow-2xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full text-gold text-[10px] font-mono font-black uppercase tracking-wider animate-pulse mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          GALERIA DA GLÓRIA ETERNA • TEMPORADA 2026
        </div>
        <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          HALL DA FAMA SÓ CAMISA 10
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl mx-auto">
          Consagramos oficialmente os lendários treinadores e clubes campeões do ecossistema de ligas e copas da temporada 2026. A glória é eterna e de direito aos vitoriosos!
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
                <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded flex items-center gap-1">
                  👑 CAMPEONATO GERAL (38R) • LÍDER PROVISÓRIO (R{currentRound})
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
                  <span className="font-mono text-[11px] font-extrabold text-amber-400">1º GERAL • {generalPodium.champion.calculatedPoints.toFixed(2)} pts</span>
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
                  <span className="font-mono text-xs font-bold text-slate-300">{generalPodium.runnerUp.calculatedPoints.toFixed(2)} pts</span>
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
                  <span className="font-mono text-xs font-bold text-amber-600">{generalPodium.third.calculatedPoints.toFixed(2)} pts</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>PRÊMIO GERAL (38R)</span>
              <span className="text-amber-400 font-bold">R$ 500,00 + 🏆</span>
            </div>
          </div>
        )}

        {/* 2. COMPONENT: COPA M10 PODIUM */}
        {m10Podium && (
          <div className="bg-[#121212]/90 border border-blue-500/25 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[460px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-mono font-black text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded flex items-center gap-1">
                  🏆 COPA M10 (MUNDO) • ENCERRADA NA R29
                </span>
                <Star className="w-5 h-5 text-blue-400" />
              </div>

              {/* Blue Champion Spotlight */}
              <div className="bg-gradient-to-b from-blue-600/15 to-transparent border border-blue-500/40 rounded-xl p-5 text-center flex flex-col items-center shadow-lg">
                <Trophy className="w-10 h-10 text-yellow-400 mb-2.5 animate-bounce" />
                <div className="w-16 h-16 bg-blue-400/20 p-2 rounded-full border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.25)]">
                  <TeamShield shieldUrl={m10Podium.champion?.shieldUrl} fallbackText={m10Podium.champion?.name} />
                </div>
                <h4 className="font-display font-black text-base text-white uppercase leading-tight mt-3 tracking-wide">
                  {m10Podium.champion?.name}
                </h4>
                <p className="text-xs text-slate-300 font-medium">Téc: {m10Podium.champion?.owner}</p>
                <div className="mt-3 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1 rounded-full">
                  <span className="font-mono text-[11px] font-black text-yellow-400">CAMPEÃO DA COPA M10</span>
                </div>
                {m10Podium.finalScore && (
                  <span className="text-[9px] font-mono text-emerald-400 mt-2">
                    Final: {m10Podium.finalScore.away?.toFixed(2)} x {m10Podium.finalScore.home?.toFixed(2)} (+2.18 pts)
                  </span>
                )}
              </div>

              {/* Runners up list */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-black text-xs text-slate-400">2º</span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      <TeamShield shieldUrl={m10Podium.runnerUp?.shieldUrl} fallbackText={m10Podium.runnerUp?.name} />
                    </div>
                    <div>
                      <p className="font-display font-extrabold text-xs text-white truncate max-w-[150px]">{m10Podium.runnerUp?.name}</p>
                      <p className="text-[10px] text-slate-400">{m10Podium.runnerUp?.owner}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-300">VICE-CAMPEÃO</span>
                </div>

                {m10Podium.third && (
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="font-sans font-black text-xs text-amber-600">3º</span>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <TeamShield shieldUrl={m10Podium.third?.shieldUrl} fallbackText={m10Podium.third?.name} />
                      </div>
                      <div>
                        <p className="font-display font-extrabold text-xs text-white truncate max-w-[150px]">{m10Podium.third?.name}</p>
                        <p className="text-[10px] text-slate-400">{m10Podium.third?.owner}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-500">3º LUGAR</span>
                  </div>
                )}
                {m10Podium.fourth && (
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5 text-[10px] text-slate-400">
                    <span>4º Lugar:</span>
                    <span className="font-bold text-slate-300">{m10Podium.fourth?.name}</span>
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

        {/* 3. COMPONENT: COPA B10 STATUS (EM ANDAMENTO - FASE 4) */}
        <div className="bg-[#121212]/90 border border-emerald-500/25 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[460px]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono font-black text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded flex items-center gap-1">
                ⚔️ COPA B10 (ELITE BRASIL) • EM ANDAMENTO
              </span>
              <Award className="w-5 h-5 text-emerald-400" />
            </div>

            {/* In-progress banner */}
            <div className="bg-gradient-to-b from-emerald-600/10 to-transparent border border-emerald-500/30 rounded-xl p-5 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-emerald-500/15 p-2 rounded-full border border-emerald-500/30 flex items-center justify-center mb-2 shadow-inner">
                <Crown className="w-7 h-7 text-emerald-400 animate-pulse" />
              </div>
              <h4 className="font-display font-black text-base text-white uppercase leading-tight mt-1 tracking-wide">
                {b10Status.phaseName}
              </h4>
              <p className="text-xs text-[#D4AF37] font-mono font-bold mt-1">{b10Status.roundsLabel}</p>
              
              <div className="mt-3 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                <span className="font-mono text-[10px] font-bold text-emerald-300 uppercase">16 Vagas em Disputa</span>
              </div>
            </div>

            {/* Explanation of ongoing stage */}
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-2 text-xs font-mono text-slate-300">
              <p className="text-[11px] leading-relaxed text-slate-300">
                {b10Status.description}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Status Atual:</span>
                <span className="text-[#D4AF37] font-bold">R29 (Ida) • R30 (Volta)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>PRÊMIO COPA ELITE</span>
            <span className="text-emerald-400 font-bold">R$ 300,00 + 🏆</span>
          </div>
        </div>

      </div>
    </div>
  );
}
