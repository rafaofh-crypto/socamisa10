import React, { useState, useMemo } from "react";
import { CartolaTeam } from "../services/cartolaService";
import { Team } from "../types";
import { getBestThirdPlaced, allocateThirdPlacedTeams } from "../tournamentData";
import { 
  processCuttingRound, 
  buildFullBracket, 
  processMatchResults, 
  determineFinalRankings 
} from "../services/knockout";

import TeamShield from "../components/TeamShield";
import CopaSocialCard from "../components/CopaSocialCard";
import GroupCards from "../components/GroupCards";
import BracketVisualization from "../components/BracketVisualization";
import TournamentCalendarView from "../components/TournamentCalendarView";
import { Trophy, ShieldCheck, HelpCircle, RefreshCw, Search, Calendar } from "lucide-react";

interface MataMataProps {
  teams: CartolaTeam[];
  currentRound: number;
  cutRound: number;
  isSimulatorsEnabled?: boolean;
}

export default function MataMata({ teams, currentRound, cutRound, isSimulatorsEnabled = false }: MataMataProps) {
  const [subTab, setSubTab] = useState<"classification" | "groups" | "bracket" | "calendar">("classification");
  const [manualScores, setManualScores] = useState<Record<string, { home: number; away: number }>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const isAwaitingRound20 = !isSimulatorsEnabled && currentRound < 20;

  // 1. Compute the cutting round and original unpopulated groups
  const cuttingResult = useMemo(() => {
    if (teams.length === 0) return null;
    try {
      return processCuttingRound(cutRound, teams, isSimulatorsEnabled, currentRound);
    } catch (e) {
      console.error("Error processing cut round:", e);
      return null;
    }
  }, [teams, cutRound, isSimulatorsEnabled, currentRound]);

  // 2. Standings of all 50 teams at Cutoff Round (including Esperneio of Copa M10)
  const standingsAtCut = useMemo(() => {
    if (isAwaitingRound20) {
      return [...teams]
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
        .map((t, idx) => ({
          id: t.id,
          name: t.name,
          owner: t.owner,
          shieldUrl: t.shieldUrl,
          points: 0,
          esperneioScore: undefined as number | undefined,
          rank: idx + 1,
          status: "direct" as "seeded" | "direct" | "esperneio_win" | "esperneio_lost"
        }));
    }
    if (cuttingResult?.allRanked) {
      return cuttingResult.allRanked;
    }
    return [...teams]
      .map((t, idx) => {
        const scoreInCutRound = (isSimulatorsEnabled || cutRound <= currentRound) ? (t.scores[cutRound] || 0) : 0;
        let cumulativePoints = 0;
        for (let r = 1; r <= cutRound; r++) {
          if (isSimulatorsEnabled || r <= currentRound) {
            cumulativePoints += t.scores[r] || 0;
          }
        }
        return {
          id: t.id,
          name: t.name,
          owner: t.owner,
          shieldUrl: t.shieldUrl,
          points: Number(scoreInCutRound.toFixed(2)),
          cumulativePoints: Number(cumulativePoints.toFixed(2)),
          esperneioScore: undefined as number | undefined,
          rank: idx + 1,
          status: (idx < 12 ? "seeded" : idx >= 48 ? "esperneio_lost" : "direct") as "seeded" | "direct" | "esperneio_win" | "esperneio_lost"
        };
      })
      .sort((a, b) => {
        if (Math.abs(b.points - a.points) > 0.001) return b.points - a.points;
        return b.cumulativePoints - a.cumulativePoints;
      })
      .map((t, i) => ({ ...t, rank: i + 1 }));
  }, [teams, cutRound, cuttingResult, isAwaitingRound20, isSimulatorsEnabled, currentRound]);

  // Filter standings based on search query
  const filteredStandings = useMemo(() => {
    if (!searchTerm.trim()) return standingsAtCut;
    const lower = searchTerm.toLowerCase();
    return standingsAtCut.filter(
      t => t.name.toLowerCase().includes(lower) || t.owner.toLowerCase().includes(lower)
    );
  }, [standingsAtCut, searchTerm]);

  // 3. Populate groups with real round scores (R22, R23, R24 after cutRound)
  const populatedGroups = useMemo(() => {
    if (isAwaitingRound20) {
      const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
      const mockGroups: Record<string, Team[]> = {};
      letters.forEach((letter) => {
        mockGroups[letter] = Array.from({ length: 4 }, (_, idx) => ({
          group: letters.indexOf(letter),
          name: "Aguardando Rod 20",
          owner: "—",
          shieldUrl: "",
          points: 0,
          groupRound1: 0,
          groupRound2: 0,
          groupRound3: 0,
          position: idx + 1,
          qualifyingPosition: idx + 1,
          originalIndex: idx,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          matchesPlayed: 0
        }));
      });
      return mockGroups;
    }
    if (!cuttingResult) return {};
    const groupsToPopulate = cuttingResult.groups as Record<string, Team[]>;
    const result: Record<string, Team[]> = {};

    for (const [letter, teamList] of Object.entries(groupsToPopulate)) {
      result[letter] = (teamList as Team[]).map(t => {
        const match = teams.find(ct => ct.name === t.name);
        // Scores for group stage: R22 (cutRound + 2), R23 (cutRound + 3), R24 (cutRound + 4)
        // R21 is exclusively the Esperneio round
        const r1Round = cutRound + 2; // R22
        const r2Round = cutRound + 3; // R23
        const r3Round = cutRound + 4; // R24

        const r1 = match && (isSimulatorsEnabled || r1Round <= currentRound) ? (match.scores[r1Round] || 0) : 0;
        const r2 = match && (isSimulatorsEnabled || r2Round <= currentRound) ? (match.scores[r2Round] || 0) : 0;
        const r3 = match && (isSimulatorsEnabled || r3Round <= currentRound) ? (match.scores[r3Round] || 0) : 0;
        return {
          ...t,
          groupRound1: r1,
          groupRound2: r2,
          groupRound3: r3,
          points: Number((r1 + r2 + r3).toFixed(2))
        };
      });
    }
    return result;
  }, [cuttingResult, teams, cutRound, isSimulatorsEnabled, currentRound, isAwaitingRound20]);

  // 4. Sort groups results and assemble the initial bracket of 32 teams
  const { initialBracket, allGroupTeams } = useMemo(() => {
    // Check if group classification has completed (round >= cutRound + 4 i.e. R24 or simulators active with simulated scores)
    const hasGroupStageCompleted = !isAwaitingRound20 && (
      currentRound >= (cutRound + 4) ||
      (isSimulatorsEnabled && Object.keys(manualScores).length > 0)
    );

    if (isAwaitingRound20 || !hasGroupStageCompleted) {
      return {
        initialBracket: buildFullBracket({}, {}),
        allGroupTeams: []
      };
    }
    if (!populatedGroups || Object.keys(populatedGroups).length === 0) {
      return { initialBracket: null, allGroupTeams: [] };
    }

    const groupResults: Record<string, { first: Team; second: Team; third: Team; fourth: Team }> = {};
    const allTeamsList: Team[] = [];

    for (const [letter, teamList] of Object.entries(populatedGroups) as [string, Team[]][]) {
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

    return {
      initialBracket: bracket,
      allGroupTeams: allTeamsList
    };
  }, [populatedGroups, isAwaitingRound20, currentRound, cutRound, isSimulatorsEnabled, manualScores]);

  // 5. Computed bracket of knockout results from manual edits or simulations
  const { computedBracket, finalRankings } = useMemo(() => {
    if (!initialBracket) return { computedBracket: null, finalRankings: null };
    const clonedBracket = JSON.parse(JSON.stringify(initialBracket));

    // Build tiebreakers from teams
    const tiebreakers: Record<number, { groupPoints: number; qualifyingPos: number; cartolaRank: number }> = {};
    for (const team of allGroupTeams) {
      tiebreakers[team.qualifyingPosition] = {
        groupPoints: team.points,
        qualifyingPos: team.qualifyingPosition,
        cartolaRank: team.originalIndex
      };
    }

    // Process matches per phase
    processMatchResults(clonedBracket, 'round_of_32', manualScores, tiebreakers);
    processMatchResults(clonedBracket, 'round_of_16', manualScores, tiebreakers);
    processMatchResults(clonedBracket, 'quarterfinals', manualScores, tiebreakers);
    processMatchResults(clonedBracket, 'semifinals', manualScores, tiebreakers);
    processMatchResults(clonedBracket, 'final', manualScores, tiebreakers);
    processMatchResults(clonedBracket, 'third_place', manualScores, tiebreakers);

    let rankings = null;
    try {
      rankings = determineFinalRankings(clonedBracket);
    } catch (e) {
      // Rankings cannot be determined if the final/matches are not simulated yet.
    }

    return {
      computedBracket: clonedBracket,
      finalRankings: rankings
    };
  }, [initialBracket, manualScores, allGroupTeams]);

  // Handle score edits
  const handleMatchScoreChange = (matchCode: string, isHome: boolean, val: string) => {
    const score = parseFloat(val) || 0;
    setManualScores(prev => {
      const current = prev[matchCode] || { home: 0, away: 0 };
      return {
        ...prev,
        [matchCode]: isHome ? { ...current, home: score } : { ...current, away: score }
      };
    });
  };

  // Simulate whole bracket randomly
  const handleSimulateCompleteBracket = () => {
    const simulated: Record<string, { home: number; away: number }> = {};
    
    // R32 matches
    const r32Matches = ['M49', 'M50', 'M51', 'M52', 'M53', 'M54', 'M55', 'M56', 'M57', 'M58', 'M59', 'M60', 'M61', 'M62', 'M63', 'M64'];
    for (const code of r32Matches) {
      simulated[code] = {
        home: parseFloat((Math.random() * 100).toFixed(2)),
        away: parseFloat((Math.random() * 100).toFixed(2))
      };
    }
    
    // R16 matches
    const r16Matches = ['M81', 'M83', 'M85', 'M87', 'M89', 'M91', 'M93', 'M95'];
    for (const code of r16Matches) {
      simulated[code] = {
        home: parseFloat((Math.random() * 100).toFixed(2)),
        away: parseFloat((Math.random() * 100).toFixed(2))
      };
    }
    
    // Quarterfinals
    const qfMatches = ['M90', 'M92', 'M94', 'M96'];
    for (const code of qfMatches) {
      simulated[code] = {
        home: parseFloat((Math.random() * 100).toFixed(2)),
        away: parseFloat((Math.random() * 100).toFixed(2))
      };
    }
    
    // Semifinals
    const sfMatches = ['M98', 'M100'];
    for (const code of sfMatches) {
      simulated[code] = {
        home: parseFloat((Math.random() * 100).toFixed(2)),
        away: parseFloat((Math.random() * 100).toFixed(2))
      };
    }
    
    // Finals
    simulated['M101'] = {
      home: parseFloat((Math.random() * 100).toFixed(2)),
      away: parseFloat((Math.random() * 100).toFixed(2))
    };
    simulated['M102'] = {
      home: parseFloat((Math.random() * 100).toFixed(2)),
      away: parseFloat((Math.random() * 100).toFixed(2))
    };

    setManualScores(simulated);
  };

  if (teams.length === 0) {
    return (
      <div className="p-16 text-center space-y-4 bg-charcoal-dark/40 border border-gold/10 rounded-2xl">
        <RefreshCw className="w-10 h-10 text-gold animate-spin mx-auto" />
        <p className="font-display font-extrabold text-sm uppercase text-slate-400">
          Aguardando carregamento da Copa M10...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro info bar */}
      <div className="p-4 bg-gold/5 border border-gold/15 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex gap-2.5 items-center">
          <Trophy className="w-5 h-5 text-gold" />
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">COPA M10 BRASIL 2026</h2>
            <p className="text-[10px] text-slate-400 font-mono">Fases: Corte (R{cutRound}) &gt; Grupos (R{cutRound+1}-R{cutRound+3}) &gt; Chaveamento Finais</p>
          </div>
        </div>
        <div className="flex gap-2 select-none">
          <button
            onClick={() => setSubTab("classification")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${subTab === "classification" ? "bg-gold text-charcoal-dark shadow-md" : "text-slate-400 bg-white/5 hover:text-white"}`}
          >
            Fase de Corte
          </button>
          <button
            onClick={() => setSubTab("groups")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${subTab === "groups" ? "bg-gold text-charcoal-dark shadow-md" : "text-slate-400 bg-white/5 hover:text-white"}`}
          >
            Fase de Grupos
          </button>
          <button
            onClick={() => setSubTab("bracket")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${subTab === "bracket" ? "bg-gold text-charcoal-dark shadow-md" : "text-slate-400 bg-white/5 hover:text-white"}`}
          >
            Chave Mata-Mata
          </button>
          <button
            onClick={() => setSubTab("calendar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${subTab === "calendar" ? "bg-gold text-charcoal-dark shadow-md" : "text-slate-400 bg-white/5 hover:text-white"}`}
          >
            Calendário Oficial
          </button>
        </div>
      </div>

      {/* Main card representation */}
      {subTab !== "calendar" && (
        <CopaSocialCard 
          subTab={subTab} 
          cutRound={cutRound} 
          standingsAtCut={standingsAtCut} 
          finalRankings={finalRankings} 
          groups={populatedGroups} 
          isAwaitingRound20={isAwaitingRound20}
          esperneioTeams={cuttingResult?.esperneioTeams}
        />
      )}

      {/* Classification table for the cutting/cutoff stage */}
      {subTab === "classification" && (
        <div className="space-y-4 animate-fadeIn">
          {!isAwaitingRound20 && cuttingResult?.esperneioTeams && cuttingResult.esperneioTeams.length > 0 && (
            <div className="p-4 bg-gradient-to-br from-[#c5a880]/10 via-black/40 to-black/60 border border-[#c5a880]/20 rounded-2xl space-y-3.5 shadow-lg backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c5a880]/15 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#c5a880]/15 flex items-center justify-center border border-[#c5a880]/25 text-[#c5a880] text-xs font-black">
                    ⚔️
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      Rodada do Esperneio <span className="text-[10px] text-[#c5a880] font-normal lowercase">(limbo de corte)</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">Disputa direta na rodada R{cutRound + 1} para os times do 47º ao 50º lugar.</p>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded bg-black/40 border border-white/5 font-mono text-[9px] text-[#c5a880] self-start sm:self-center">
                  Vagas 47 e 48 da Copa M10
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {cuttingResult.esperneioTeams.map((cand) => {
                  const hasPlayed = cand.esperneioScore > 0;
                  const isWinner = hasPlayed && cand.status === "vencedor";
                  return (
                    <div 
                      key={cand.team.id} 
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                        !hasPlayed
                          ? "bg-[#121212]/80 border-[#c5a880]/20"
                          : isWinner 
                            ? "bg-gradient-to-b from-[#c5a880]/10 to-[#c5a880]/2 border-[#c5a880]/30 shadow-[0_0_12px_rgba(197,168,128,0.05)]" 
                            : "bg-[#121212]/50 border-white/5 opacity-65"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6.5 h-6.5 flex-shrink-0 bg-black/45 rounded-full overflow-hidden border border-white/10 flex items-center justify-center">
                          <TeamShield shieldUrl={cand.team.shieldUrl} fallbackText={cand.team.name} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-extrabold text-white uppercase truncate tracking-wide">{cand.team.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono uppercase truncate">Téc: {cand.team.owner}</p>
                        </div>
                      </div>
                      <div className="mt-3.5 pt-2 border-t border-white/5 flex justify-between items-end">
                        <div>
                          <p className="text-[8px] text-slate-500 font-mono uppercase">Pontos Esperneio</p>
                          <p className={`text-xs font-black font-mono ${hasPlayed && isWinner ? "text-[#c5a880]" : "text-slate-400"}`}>
                            {cand.esperneioScore.toFixed(2)} pts
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider ${
                          !hasPlayed
                            ? "bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/25"
                            : isWinner 
                              ? "bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/20" 
                              : "bg-white/5 text-slate-400"
                        }`}>
                          {!hasPlayed 
                            ? "Em disputa" 
                            : isWinner 
                              ? `Avançou (Vaga ${cand.rankAfter})` 
                              : "Eliminado"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center p-4 bg-[#121212]/50 border border-white/5 rounded-2xl">
            <div>
              <h3 className="text-xs font-mono font-black text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold" strokeWidth={2.5} />
                Tabela Completa de Classificação (R{cutRound})
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Visão consolidada das posições classificatórias dos 50 times pós-corte</p>
            </div>
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5 text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="Buscar time ou técnico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 text-xs text-white placeholder-slate-500 pl-9 pr-4 py-2 border border-white/10 rounded-xl focus:border-[#D4AF37]/50 focus:ring-0 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#121212]/90 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-white/10">
                    <th className="py-3 px-4 text-center w-14">Pos</th>
                    <th className="py-3 px-4 font-semibold">Time / Cartoleiro</th>
                    <th className="py-3 px-4 text-center w-48">Status do Corte</th>
                    <th className="py-3 px-4 text-right w-32">Pontuação R{cutRound}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#121212]/40 text-slate-200">
                  {filteredStandings.map((t) => {
                    const idx = t.rank - 1;
                    const isSeeded = !isAwaitingRound20 && t.status === "seeded";
                    const isEsperneioWin = !isAwaitingRound20 && t.status === "esperneio_win";
                    const isEsperneioLost = !isAwaitingRound20 && t.status === "esperneio_lost";
                    const hasPlayedEsperneio = t.esperneioScore !== undefined && t.esperneioScore > 0;
                    const isEliminated = isEsperneioLost && hasPlayedEsperneio;
                    const isAwaitingEsperneio = isEsperneioLost && !hasPlayedEsperneio;
                    
                    let badgeColor = isAwaitingRound20 
                      ? "bg-white/5 text-slate-400 border-white/5" 
                      : "bg-white/5 text-slate-300 border-white/10";
                    let badgeLabel = isAwaitingRound20 ? "Aguardando Rodada 20" : "Classificado";
                    
                    if (isSeeded) {
                      badgeColor = "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25";
                      badgeLabel = "Cabeça de Chave";
                    } else if (isEsperneioWin) {
                      badgeColor = "bg-[#c5a880]/15 text-[#c5a880] border-[#c5a880]/30 shadow-[0_0_10px_rgba(197,168,128,0.05)]";
                      badgeLabel = "Sobrevivente do Esperneio";
                    } else if (isAwaitingEsperneio) {
                      badgeColor = "bg-[#c5a880]/15 text-[#c5a880] border-[#c5a880]/30 shadow-[0_0_10px_rgba(197,168,128,0.05)]";
                      badgeLabel = "Aguardando Rod. do Esperneio";
                    } else if (isEliminated) {
                      badgeColor = "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.05)]";
                      badgeLabel = "Cortado / Eliminado";
                    }

                    return (
                      <tr 
                        key={t.id} 
                        className={`hover:bg-white/5 transition duration-200 ${
                          isEliminated 
                            ? "bg-red-950/10 opacity-75 hover:opacity-90" 
                            : isSeeded 
                              ? "bg-[#D4AF37]/5" 
                              : isEsperneioWin
                                ? "bg-[#c5a880]/5 hover:bg-[#c5a880]/10"
                                : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-mono text-xs font-black">
                          <span className={isSeeded ? "text-[#D4AF37]" : isEliminated ? "text-red-400" : isEsperneioWin ? "text-[#c5a880]" : "text-slate-300"}>
                            {t.rank}º
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center overflow-hidden bg-black/35 rounded-full border border-white/5">
                              <TeamShield shieldUrl={t.shieldUrl} fallbackText={t.name} />
                            </div>
                            <div>
                              <p className={`font-semibold text-xs tracking-wide uppercase ${isEliminated ? "line-through text-slate-400" : "text-white"}`}>{t.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">Téc: {t.owner}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase border tracking-wider ${badgeColor}`}>
                            {badgeLabel}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right font-mono text-xs font-extrabold tracking-wide ${isSeeded ? "text-[#D4AF37]" : isEliminated ? "text-red-400" : isEsperneioWin ? "text-[#c5a880]" : "text-white"}`}>
                          <div>{t.points.toFixed(2)} pts</div>
                          {t.esperneioScore !== undefined && (
                            <div className="text-[10px] text-[#c5a880] font-normal font-mono mt-0.5">
                              Esperneio: {t.esperneioScore.toFixed(2)} pts
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStandings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-xs text-slate-400 font-mono">
                        Nenhum time encontrado para a busca "{searchTerm}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Group Phase Cards */}
      {subTab === "groups" && (
        <div className="mt-6">
          <GroupCards groups={populatedGroups} isAwaitingRound20={isAwaitingRound20} />
        </div>
      )}

      {/* Brackets block */}
      {subTab === "bracket" && (
        <div className="mt-6">
          <BracketVisualization 
            bracket={computedBracket} 
            finalRankings={finalRankings} 
            manualScores={manualScores} 
            onMatchScoreChange={handleMatchScoreChange} 
            onSimulateCompleteBracket={handleSimulateCompleteBracket} 
            isSimulatorsEnabled={isSimulatorsEnabled}
          />
        </div>
      )}

      {/* Calendar block */}
      {subTab === "calendar" && (
        <div className="mt-6">
          <TournamentCalendarView currentRound={currentRound} />
        </div>
      )}
    </div>
  );
}
