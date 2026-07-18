import React, { useState, useMemo, useEffect } from 'react';
import { CartolaTeam } from '../services/cartolaService';
import TeamShield from '../components/TeamShield';
import { B10RoundOf32 } from '../components/B10RoundOf32';
import { B10FinalBracket } from '../components/B10FinalBracket';
import TournamentCalendarView from '../components/TournamentCalendarView';
import { 
  Trophy, 
  Crown, 
  Award, 
  Sparkles, 
  Search, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  ChevronRight, 
  Activity, 
  ShieldAlert, 
  Star,
  Calendar
} from 'lucide-react';

interface CopaB10Props {
  teams: CartolaTeam[];
  currentRound: number;
  isSimulatorsEnabled?: boolean;
}

const CopaB10 = ({ teams = [], currentRound = 17, isSimulatorsEnabled = false }: CopaB10Props) => {
  const isAwaitingRound25 = !isSimulatorsEnabled && currentRound < 25;

  // Local state for Copa B10 selection of evaluation round (Fase 1: Corte)
  // Default to round 25 (or currentRound if smaller, or up to 38)
  const [b10Round, setB10Round] = useState<number>(25);

  const [activeSubTab, setActiveSubTab] = useState<'funil' | 'playoffs' | 'fase4' | 'fasefinal' | 'tabela' | 'cronograma' | 'regulamento'>('tabela');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync or lock b10Round when awaiting or currentRound changes
  useEffect(() => {
    if (isAwaitingRound25) {
      setB10Round(25);
    } else {
      const defaultRound = isSimulatorsEnabled ? 25 : currentRound;
      setB10Round(Math.min(defaultRound, currentRound > 0 ? currentRound : 25));
    }
  }, [isAwaitingRound25, currentRound, isSimulatorsEnabled]);

  // 1. Calculate the General Cartola League Ranking for all teams (to serve as Tiebreaker #2)
  // Summing all round scores up to currentRound
  const teamsWithLeagueRank = useMemo(() => {
    if (!teams || teams.length === 0) return [];

    return [...teams]
      .map(t => {
        const totalPoints = Object.keys(t.scores)
          .map(Number)
          .filter(r => r <= currentRound)
          .reduce((sum, r) => sum + (t.scores[r] || 0), 0);
        return {
          team: t,
          totalPoints: Number(totalPoints.toFixed(2))
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((item, idx) => ({
        ...item.team,
        totalLeaguePoints: item.totalPoints,
        leagueRank: idx + 1 // Official general league rank starting at 1
      }));
  }, [teams, currentRound]);

  // 2. Perform the sorting for Copa B10 - Round of Cut (b10Round)
  // Apply tiebreakers:
  // - Tiebreaker #1: Score of previous phase (none in Phase 1, so 0)
  // - Tiebreaker #2: Position in General Cartola League Ranking (smaller index is better)
  const sortedB10Standings = useMemo(() => {
    if (teamsWithLeagueRank.length === 0) return [];

    if (isAwaitingRound25) {
      // Under awaiting state (no simulators, round < 25), return teams in alphabetical order with 0.00 score
      return [...teamsWithLeagueRank]
        .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
        .map((t, idx) => ({
          ...t,
          b10RoundScore: 0,
          prevPhaseScore: 0
        }));
    }

    return [...teamsWithLeagueRank]
      .map(t => {
        const scoreInRound = (isSimulatorsEnabled || b10Round <= currentRound) && typeof t.scores[b10Round] === 'number' ? t.scores[b10Round] : 0;
        // previous phase pts = 0 (since it is Phase 1: Corte)
        const prevPhaseScore = 0; 

        return {
          ...t,
          b10RoundScore: Number(scoreInRound.toFixed(2)),
          prevPhaseScore
        };
      })
      .sort((a, b) => {
        // Primary criterion: score of the round
        if (Math.abs(b.b10RoundScore - a.b10RoundScore) > 0.001) {
          return b.b10RoundScore - a.b10RoundScore;
        }

        // Secondary criterion: points of previous phase (0 for Phase 1)
        if (Math.abs(b.prevPhaseScore - a.prevPhaseScore) > 0.001) {
          return b.prevPhaseScore - a.prevPhaseScore;
        }

        // Tertiary criterion: official general league rank on Cartola (smaller number is better)
        return a.leagueRank - b.leagueRank;
      });
  }, [teamsWithLeagueRank, b10Round, currentRound, isSimulatorsEnabled, isAwaitingRound25]);

  // 3. Mark destinations for each rank placement (Afunilamento mapping)
  // - 1st to 16th (Indices 0 to 15): ELITE (Fase 4 slot)
  // - 17th to 46th (Indices 16 to 45): ACESSO (Fase 3 play-offs slot)
  // - 47th to 50th (Indices 46 to 49): REPESCAGEM (Fase 2 battle slot)
  const mappedB10Teams = useMemo(() => {
    return sortedB10Standings.map((team, index) => {
      let category: 'ELITE' | 'ACESSO' | 'REPESCAGEM' = 'ACESSO';
      let destinationLabel = 'Fase 3 (Play-offs)';
      let badgeStyle = 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      let destinationCode = 3;

      if (index < 16) {
        category = 'ELITE';
        destinationLabel = 'Fase 4 (Direct)';
        badgeStyle = 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.05)]';
        destinationCode = 4;
      } else if (index >= 46) {
        category = 'REPESCAGEM';
        destinationLabel = 'Fase 2 (Repescagem)';
        badgeStyle = 'bg-red-500/15 text-red-400 border-red-500/30';
        destinationCode = 2;
      }

      // Check if this team is tied with another team in round score to flag the tiebreaker
      const isTiedWithSomeone = sortedB10Standings.some(
        other => other.id !== team.id && Math.abs(other.b10RoundScore - team.b10RoundScore) < 0.001
      );

      return {
        ...team,
        rank: index + 1,
        category,
        destinationLabel,
        badgeStyle,
        destinationCode,
        isTiedWithSomeone
      };
    });
  }, [sortedB10Standings]);

  // 4. Derive Top 3 Elite Teams for the selected round
  const top3Elite = useMemo(() => {
    if (isAwaitingRound25) {
      return [
        {
          id: 'mock-elite-1',
          name: 'Aguardando 1º Lugar',
          owner: 'A definir',
          shieldUrl: '',
          b10RoundScore: 0,
        },
        {
          id: 'mock-elite-2',
          name: 'Aguardando 2º Lugar',
          owner: 'A definir',
          shieldUrl: '',
          b10RoundScore: 0,
        },
        {
          id: 'mock-elite-3',
          name: 'Aguardando 3º Lugar',
          owner: 'A definir',
          shieldUrl: '',
          b10RoundScore: 0,
        },
      ];
    }
    return mappedB10Teams.slice(0, 3);
  }, [mappedB10Teams, isAwaitingRound25]);

  // 5. Phase 2 (Repescagem) scoring and qualification logic
  const repescagemData = useMemo(() => {
    if (isAwaitingRound25) {
      // Return 4 placeholder teams under awaiting state
      return Array.from({ length: 4 }, (_, idx) => ({
        id: `mock-rep-${idx}`,
        name: `Aguardando Classificado #${47 + idx}`,
        owner: "Pendente",
        shieldUrl: "",
        totalLeaguePoints: 0,
        b10RoundScore: 0,
        leagueRank: 47 + idx,
        scoreR2: 0,
        scoreR3: 0,
        scoreR4: 0,
        totalAccumulated: 0,
        f2Rounds: [26, 27, 28],
        f2Rank: idx + 1,
        status: 'classifying' as const,
        statusLabel: 'Pendente',
        statusBadgeStyle: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
        isTop2: idx < 2
      }));
    }

    // Identify the 4 teams destined to Phase 2 (rank 47th to 50th from Phase 1, category REPESCAGEM)
    const f2TeamsOriginal = mappedB10Teams.filter(t => t.category === 'REPESCAGEM');
    
    // Map of Cartola FC rounds that corresponds to Phase 2 (Rounds 2, 3 and 4 of Copa B10, corresponding to b10Round + 1, b10Round + 2, b10Round + 3)
    const f2Rounds = [b10Round + 1, b10Round + 2, b10Round + 3];

    const computedF2Teams = f2TeamsOriginal.map((t) => {
      const scoreR2 = (isSimulatorsEnabled || f2Rounds[0] <= currentRound) && typeof t.scores[f2Rounds[0]] === 'number' ? t.scores[f2Rounds[0]] : 0;
      const scoreR3 = (isSimulatorsEnabled || f2Rounds[1] <= currentRound) && typeof t.scores[f2Rounds[1]] === 'number' ? t.scores[f2Rounds[1]] : 0;
      const scoreR4 = (isSimulatorsEnabled || f2Rounds[2] <= currentRound) && typeof t.scores[f2Rounds[2]] === 'number' ? t.scores[f2Rounds[2]] : 0;

      const totalAccumulated = Number((scoreR2 + scoreR3 + scoreR4).toFixed(2));

      return {
        ...t,
        scoreR2,
        scoreR3,
        scoreR4,
        totalAccumulated,
        f2Rounds
      };
    });

    // Sort them by Phase 2 Accumulated Points
    // Tiebreaker:
    // - Primary: totalAccumulated points in Phase 2
    // - Secondary: leagueRank in General Liga (lower rank is better)
    const sortedF2 = [...computedF2Teams].sort((a, b) => {
      if (Math.abs(b.totalAccumulated - a.totalAccumulated) > 0.001) {
        return b.totalAccumulated - a.totalAccumulated;
      }
      return a.leagueRank - b.leagueRank;
    });

    const isRound4Completed = isSimulatorsEnabled || currentRound >= b10Round + 3;

    // Mark classification trigger status (Top 2 qualify to Phase 3, bottom 2 are eliminated)
    return sortedF2.map((t, idx) => {
      const isTop2 = idx < 2;
      let status: 'classifying' | 'classified' | 'eliminating' | 'eliminated';
      let statusLabel = '';
      let statusBadgeStyle = '';

      if (isTop2) {
        status = isRound4Completed ? 'classified' : 'classifying';
        statusLabel = isRound4Completed ? 'Classificado' : 'Sendo Classificado (G2)';
        statusBadgeStyle = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      } else {
        status = isRound4Completed ? 'eliminated' : 'eliminating';
        statusLabel = isRound4Completed ? 'Eliminado' : 'Sendo Eliminado';
        statusBadgeStyle = 'bg-red-500/15 text-red-400 border-red-500/30';
      }

      return {
        ...t,
        f2Rank: idx + 1,
        status,
        statusLabel,
        statusBadgeStyle,
        isTop2
      };
    });
  }, [mappedB10Teams, b10Round, currentRound, isSimulatorsEnabled, isAwaitingRound25]);

  // Filter classified lists based on search parameter
  const filteredB10Teams = useMemo(() => {
    if (!searchTerm.trim()) return mappedB10Teams;
    const lower = searchTerm.toLowerCase();
    return mappedB10Teams.filter(
      t => t.name.toLowerCase().includes(lower) || t.owner.toLowerCase().includes(lower)
    );
  }, [mappedB10Teams, searchTerm]);

  // Categorized chunks for SubTab Funil
  const eliteGroup = useMemo(() => mappedB10Teams.filter(t => t.category === 'ELITE'), [mappedB10Teams]);
  const acessoGroup = useMemo(() => mappedB10Teams.filter(t => t.category === 'ACESSO'), [mappedB10Teams]);
  const repescagemGroup = useMemo(() => mappedB10Teams.filter(t => t.category === 'REPESCAGEM'), [mappedB10Teams]);

  // 6. Hook to compute Phase 3 Playoffs (Mata-mata de Acesso)
  const playoffMatches = useMemo(() => {
    const f3Round = b10Round + 4; // Round 5 of Copa B10
    const isRound5Completed = isSimulatorsEnabled || currentRound >= f3Round;

    if (isAwaitingRound25) {
      return Array.from({ length: 16 }, (_, idx) => ({
        id: idx + 1,
        team1: {
          id: `mock-playoff-1-${idx}`,
          name: `Aguardando #${idx + 17}`,
          owner: "Pendente",
          shieldUrl: "",
          b10RoundScore: 0,
          totalLeaguePoints: 0,
          leagueRank: idx + 17,
          isVirtual: true,
          scores: {}
        },
        team2: {
          id: `mock-playoff-2-${idx}`,
          name: idx === 0 ? "Aguardando 2º Repescagem" : idx === 1 ? "Aguardando 1º Repescagem" : `Aguardando #${50 - idx + 1}`,
          owner: "Pendente",
          shieldUrl: "",
          b10RoundScore: 0,
          totalLeaguePoints: 0,
          leagueRank: 50 - idx + 1,
          isVirtual: true,
          scores: {}
        },
        title: `Confronto ${idx + 1}`,
        score1: 0,
        score2: 0,
        winner: null,
        tiebreakerApplied: false,
        isPlayed: false,
        f3Round
      }));
    }

    // Filter classified teams from Repescagem (Phase 2)
    const repClassified = repescagemData.filter(t => t.isTop2);
    // Note: repClassified[0] is the top team (1º da Repescagem), repClassified[1] is the runner-up (2º da Repescagem)

    const matchesList = [];

    // Match 1: 17º Colocado vs 2º da Repescagem
    // acessoGroup[0] represents the 17th placed team (first in acessoGroup)
    if (acessoGroup[0] && repClassified[1]) {
      matchesList.push({
        id: 1,
        team1: acessoGroup[0],
        team2: repClassified[1],
        title: "Confronto 1"
      });
    }

    // Match 2: 18º Colocado vs 1º da Repescagem
    // acessoGroup[1] represents the 18th placed team
    if (acessoGroup[1] && repClassified[0]) {
      matchesList.push({
        id: 2,
        team1: acessoGroup[1],
        team2: repClassified[0],
        title: "Confronto 2"
      });
    }

    // Matches 3 to 16: Mirror pairing format
    // acessoGroup length is 30 (from index 0 to 29)
    // 19º is index 2, 46º is index 29 (mirror index)
    // 20º is index 3, 45º is index 28, etc.
    // loops 14 times
    for (let i = 0; i < 14; i++) {
      const idx1 = 2 + i; // starts at 19º (index 2) up to 32º (index 15)
      const idx2 = 29 - i; // starts at 46º (index 29) down to 33º (index 16)
      const team1 = acessoGroup[idx1];
      const team2 = acessoGroup[idx2];

      if (team1 && team2) {
        matchesList.push({
          id: 3 + i,
          team1,
          team2,
          title: `Confronto ${3 + i}`
        });
      }
    }

    // Map matches with dynamic Cartola scores, winner determination and tiebreaking status
    return matchesList.map((m) => {
      const score1 = (isSimulatorsEnabled || f3Round <= currentRound) && typeof m.team1.scores[f3Round] === 'number' ? m.team1.scores[f3Round] : 0;
      const score2 = (isSimulatorsEnabled || f3Round <= currentRound) && typeof m.team2.scores[f3Round] === 'number' ? m.team2.scores[f3Round] : 0;

      let winner: 'team1' | 'team2' | null = null;
      let tiebreakerApplied = false;

      if (isRound5Completed) {
        if (score1 > score2) {
          winner = 'team1';
        } else if (score2 > score1) {
          winner = 'team2';
        } else {
          // Tiebreaker rule: Better Cartola FC General League Rank is preferred (smaller rank is better)
          winner = m.team1.leagueRank < m.team2.leagueRank ? 'team1' : 'team2';
          tiebreakerApplied = true;
        }
      }

      return {
        ...m,
        score1,
        score2,
        winner,
        tiebreakerApplied,
        isPlayed: isRound5Completed,
        f3Round
      };
    });
  }, [acessoGroup, repescagemData, b10Round, currentRound, isSimulatorsEnabled, isAwaitingRound25]);

  // Available rounds for selector
  const availableRounds = useMemo(() => {
    if (isAwaitingRound25) {
      return [25];
    }
    const rounds = [];
    const limit = isSimulatorsEnabled ? Math.max(currentRound, 18) : currentRound;
    for (let r = 1; r <= Math.min(limit, 38); r++) {
      rounds.push(r);
    }
    return rounds;
  }, [currentRound, isSimulatorsEnabled, isAwaitingRound25]);

  return (
    <div className="space-y-8 animate-fadeIn text-slate-200">
      
      {/* Upper header action matrix */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-white/5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-3">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Copa B10 Especial
          </span>
          <h1 className="text-3xl font-display font-black tracking-tight text-white uppercase sm:text-4xl">
            Copa B10
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Plataforma isolada para gerenciamento do afunilamento e corte da Copa B10
          </p>
        </div>

        {/* Dynamic Cartola FC Evaluation Round selector */}
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 p-3 rounded-2xl md:w-80">
          <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
            <Activity className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="flex-grow">
            <label className="block text-[9px] font-mono uppercase text-slate-400 tracking-wider">
              Rodada de Avaliação (Fase 1)
            </label>
            <select
              value={b10Round}
              onChange={(e) => setB10Round(Number(e.target.value))}
              className="bg-transparent text-xs font-mono font-bold text-white pr-8 focus:ring-0 focus:outline-none cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAwaitingRound25}
            >
              {availableRounds.map((r) => (
                <option key={r} value={r} className="bg-[#121212] text-white font-mono text-xs">
                  Rodada {r} {r === currentRound ? " (Atual)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 1. Vitrine de Premiados - Top 3 da Elite (Glassmorphism design with imposing typography) */}
      <section className="relative overflow-hidden p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-[#121212]/30 backdrop-blur-xl shadow-[0_24px_50px_rgba(0,0,0,0.5)]">
        {/* Glow effect */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-[#D4AF37]/3 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
              <Crown className="w-6 h-6 text-[#D4AF37] animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black tracking-wider text-white uppercase">
                Vitrine Premiada de Elite
              </h2>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Top 3 Colocados da Rodada {b10Round} da Copa B10
              </p>
            </div>
          </div>
          <p className="hidden sm:block text-[10px] font-mono bg-white/5 px-3 py-1 rounded-full text-slate-400 border border-white/5">
            Mapeamento: 1º ao 16º Avançam Direto
          </p>
        </div>

        {/* The Premium podium layout divided with Termômetro */}
        {top3Elite.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 pt-2">
            
            {/* Column for podium - takes 8 cols on desktop */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div className="mb-3">
                <span className="text-[10px] uppercase font-mono font-black text-slate-400 tracking-wider bg-white/5 p-1.5 rounded-lg border border-white/5">
                  Podium de Elite da Rodada
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 2nd Place (Silver theme) - position left on large screens */}
                {top3Elite[1] && (
                  <div className="order-2 md:order-1 flex flex-col justify-between p-4 rounded-2xl border border-white/5 bg-black/30 hover:bg-black/40 hover:border-slate-400/30 transition duration-300 group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-400/10 border border-slate-400/20 text-slate-300 flex items-center justify-center font-mono font-black text-[10px]">
                          2º
                        </span>
                        <span className="text-[8px] font-mono font-bold bg-slate-400/15 text-slate-300 px-1.5 py-0.5 rounded uppercase">
                          Prata
                        </span>
                      </div>
                      <Award className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="my-5 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-zinc-950/50 rounded-full border border-slate-400/25 p-1.5 shadow-inner group-hover:scale-105 transition duration-300">
                        <TeamShield shieldUrl={top3Elite[1].shieldUrl} fallbackText={top3Elite[1].name} className="w-full h-full object-contain" />
                      </div>
                      <h3 className="font-display font-black text-xs uppercase text-slate-200 tracking-wide line-clamp-1 group-hover:text-white transition">
                        {top3Elite[1].name}
                      </h3>
                      <p className="text-[9px] text-slate-400 font-mono">
                        Téc: {top3Elite[1].owner}
                      </p>
                    </div>

                    <div className="mt-1 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-550">R{b10Round} Score</span>
                      <span className="font-bold text-slate-300">{top3Elite[1].b10RoundScore.toFixed(2)} pts</span>
                    </div>
                  </div>
                )}

                {/* 1st Place (Gold theme with crown) - centered and elevated */}
                {top3Elite[0] && (
                  <div className="order-1 md:order-2 flex flex-col justify-between p-5 rounded-2xl border-2 border-[#D4AF37]/50 bg-gradient-to-b from-[#D4AF37]/10 to-black/40 hover:from-[#D4AF37]/15 hover:to-black/50 transition duration-300 group relative shadow-[0_15px_35px_rgba(212,175,55,0.12)]">
                    {/* Crown placement badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#F1C40F] text-black px-3 py-0.5 rounded-full font-mono font-black text-[8px] uppercase tracking-widest flex items-center gap-1 shadow-lg">
                      <Crown className="w-2.5 h-2.5 fill-black" strokeWidth={2.5} /> Campeão
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center font-mono font-black text-xs">
                          1º
                        </span>
                        <span className="text-[8px] font-mono font-black bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded uppercase">
                          Elite
                        </span>
                      </div>
                      <Trophy className="w-4 h-4 text-[#D4AF37]" strokeWidth={2.5} />
                    </div>

                    <div className="my-4 text-center">
                      <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center bg-[#D4AF37]/5 rounded-full border-2 border-[#D4AF37] p-2 shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:scale-110 transition duration-300">
                        <TeamShield shieldUrl={top3Elite[0].shieldUrl} fallbackText={top3Elite[0].name} className="w-full h-full object-contain" />
                      </div>
                      <h3 className="font-display font-black text-sm uppercase text-white tracking-wider line-clamp-1">
                        {top3Elite[0].name}
                      </h3>
                      <p className="text-[9px] text-[#D4AF37] font-mono font-semibold uppercase">
                        Téc: {top3Elite[0].owner}
                      </p>
                    </div>

                    <div className="mt-1 pt-2 border-t border-[#D4AF37]/25 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">R{b10Round} Score</span>
                      <span className="font-black text-[#D4AF37]">{top3Elite[0].b10RoundScore.toFixed(2)} pts</span>
                    </div>
                  </div>
                )}

                {/* 3rd Place (Bronze theme) - position right */}
                {top3Elite[2] && (
                  <div className="order-3 md:order-3 flex flex-col justify-between p-4 rounded-2xl border border-white/5 bg-black/30 hover:bg-black/40 hover:border-[#CD7F32]/30 transition duration-300 group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#CD7F32]/10 border border-[#CD7F32]/20 text-[#CD7F32] flex items-center justify-center font-mono font-black text-[10px]">
                          3º
                        </span>
                        <span className="text-[8px] font-mono font-bold bg-[#CD7F32]/15 text-[#CD7F32] px-1.5 py-0.5 rounded uppercase">
                          Bronze
                        </span>
                      </div>
                      <Star className="w-4 h-4 text-[#CD7F32]" />
                    </div>

                    <div className="my-5 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-zinc-950/50 rounded-full border border-[#CD7F32]/25 p-1.5 shadow-inner group-hover:scale-105 transition duration-300">
                        <TeamShield shieldUrl={top3Elite[2].shieldUrl} fallbackText={top3Elite[2].name} className="w-full h-full object-contain" />
                      </div>
                      <h3 className="font-display font-black text-xs uppercase text-slate-200 tracking-wide line-clamp-1 group-hover:text-white transition">
                        {top3Elite[2].name}
                      </h3>
                      <p className="text-[9px] text-slate-400 font-mono">
                        Téc: {top3Elite[2].owner}
                      </p>
                    </div>

                    <div className="mt-1 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-550">R{b10Round} Score</span>
                      <span className="font-bold text-[#CD7F32]">{top3Elite[2].b10RoundScore.toFixed(2)} pts</span>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Column for Termômetro da Repescagem - takes 4 cols on desktop */}
            <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-3xl border border-white/10 bg-black/50 backdrop-blur-md relative overflow-hidden group">
              {/* Fiery top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 bg-red-500/10 rounded-full filter blur-[20px] pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-500 animate-pulse fill-red-500/20" />
                    <h3 className="font-display font-black text-[11px] uppercase text-white tracking-wider">
                      Termômetro da Repescagem
                    </h3>
                  </div>
                  <span className="text-[8px] font-mono font-bold uppercase py-0.5 px-2 rounded bg-red-500/20 text-red-400 border border-red-500/35">
                    Fase 2 (B10)
                  </span>
                </div>

                <p className="text-[9px] font-mono text-slate-400 mb-2.5 leading-normal">
                  Soma de R2, R3 e R4 da Copa B10 (R{b10Round+1} a R{b10Round+3})
                </p>

                <div className="space-y-2">
                  {repescagemData.map((team, idx) => {
                    const maxPts = Math.max(...repescagemData.map(x => x.totalAccumulated), 10);
                    const progressPercent = Math.min(100, Math.max(8, (team.totalAccumulated / maxPts) * 100));

                    return (
                      <div key={team.id} className="space-y-1 p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition duration-200">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`w-4 h-4 rounded-md flex items-center justify-center font-mono font-black text-[9px] ${
                              team.isTop2 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 shadow-[0_0_8px_rgba(16,185,129,0.1)]' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/35'
                            }`}>
                              {idx + 1}º
                            </span>
                            <div className="w-4 h-4 flex-shrink-0">
                              <TeamShield shieldUrl={team.shieldUrl} fallbackText={team.name} className="w-full h-full object-contain" />
                            </div>
                            <span className="font-bold text-white uppercase truncate text-[9px] tracking-wide" title={team.name}>
                              {team.name}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-black text-white text-[10px]">{team.totalAccumulated.toFixed(2)} pts</span>
                          </div>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full h-1.5 bg-black/45 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              team.isTop2 
                                ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)]' 
                                : 'bg-gradient-to-r from-red-600 to-red-400'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
                          <div className="flex gap-1 text-[8px] text-slate-400">
                            <span>R2:{team.scoreR2.toFixed(0)}</span>
                            <span>•</span>
                            <span>R3:{team.scoreR3.toFixed(0)}</span>
                            <span>•</span>
                            <span>R4:{team.scoreR4.toFixed(0)}</span>
                          </div>
                          
                          <span className={`font-black tracking-widest text-[7px] uppercase px-1 rounded ${
                            team.isTop2 
                              ? 'text-emerald-400 bg-emerald-500/10' 
                              : 'text-red-400 bg-red-500/10'
                          }`}>
                            {team.statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-slate-500">
                <span>Top 2 classificam</span>
                <span>Desempate: Rank Geral</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <p className="text-sm font-mono text-slate-400">Carregando dados da rodada para consolidar os premiados...</p>
          </div>
        )}
      </section>

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-white/10 text-xs font-mono overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('tabela')}
          className={`px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors flex-shrink-0 flex items-center gap-2 ${
            activeSubTab === 'tabela' 
              ? 'border-[#D4AF37] text-[#D4AF37]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" /> Tabela de Classificação
        </button>
        <button
          onClick={() => setActiveSubTab('funil')}
          className={`px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors flex-shrink-0 flex items-center gap-2 ${
            activeSubTab === 'funil' 
              ? 'border-[#D4AF37] text-[#D4AF37]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4" /> Funil de Destinos (3 Divisões)
        </button>
        <button
          onClick={() => setActiveSubTab('playoffs')}
          className={`px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors flex-shrink-0 flex items-center gap-2 ${
            activeSubTab === 'playoffs' 
              ? 'border-[#D4AF37] text-white bg-[#D4AF37]/5' 
              : 'border-transparent text-[#D4AF37]/70 hover:text-[#D4AF37]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Play-offs (Fase 3)
        </button>
        <button
          onClick={() => setActiveSubTab('fase4')}
          className={`px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors flex-shrink-0 flex items-center gap-2 ${
            activeSubTab === 'fase4' 
              ? 'border-[#D4AF37] text-white bg-[#D4AF37]/5' 
              : 'border-transparent text-[#D4AF37]/70 hover:text-[#D4AF37]'
          }`}
        >
          <Crown className="w-4 h-4 text-[#D4AF37]" /> Elite 32 (Fase 4)
        </button>
        <button
          onClick={() => setActiveSubTab('fasefinal')}
          className={`px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors flex-shrink-0 flex items-center gap-2 ${
            activeSubTab === 'fasefinal' 
              ? 'border-[#D4AF37] text-white bg-[#D4AF37]/5' 
              : 'border-transparent text-[#D4AF37]/70 hover:text-[#D4AF37]'
          }`}
        >
          <Trophy className="w-4 h-4 text-[#D4AF37]" /> Fase Final (Chaves)
        </button>
        <button
          onClick={() => setActiveSubTab('cronograma')}
          className={`px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors flex-shrink-0 flex items-center gap-2 ${
            activeSubTab === 'cronograma' 
              ? 'border-[#D4AF37] text-white bg-[#D4AF37]/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#D4AF37]" /> Calendário Oficial
        </button>
        <button
          onClick={() => setActiveSubTab('regulamento')}
          className={`px-5 py-3 border-b-2 font-bold tracking-wider uppercase transition-colors flex-shrink-0 flex items-center gap-2 ${
            activeSubTab === 'regulamento' 
              ? 'border-[#D4AF37] text-[#D4AF37]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Regulamento & Desempate
        </button>
      </div>

      {/* Warning banner when awaiting Round 25 */}
      {isAwaitingRound25 && activeSubTab !== 'cronograma' && activeSubTab !== 'regulamento' && (
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20 text-[#D4AF37] animate-pulse">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                Aguardando Rodada de Corte (R25) da Copa B10
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                A rodada oficial de corte é a Rodada 25. Como os simuladores estão desativados no momento, as fases e divisões exibem times pendentes. Você pode ativar os simuladores no menu superior/Administração para simular projeções.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RENDER ACTIVE TAB CONTENT */}

      {/* Tab 1: Funil de Destinos */}
      {activeSubTab === 'funil' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h3 className="text-xs font-mono font-black uppercase text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4AF37]" /> Afunilamento Estruturado
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Os 50 times são divididos em 3 chaves de destino baseando-se estritamente na Rodada {b10Round}.
              </p>
            </div>
            
            <div className="flex gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded-lg border border-[#D4AF37]/25">
                Elite: 16
              </span>
              <span className="flex items-center gap-1 bg-blue-500/10 text-blue-300 px-2 py-1 rounded-lg border border-blue-500/25">
                Acesso: 30
              </span>
              <span className="flex items-center gap-1 bg-red-500/10 text-red-400 px-2 py-1 rounded-lg border border-red-500/25">
                Repescagem: 4
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Category 1: ELITE (1st to 16th) */}
            <div className="space-y-3">
              <div className="bg-[#D4AF37]/15 p-4 rounded-t-2xl border-t border-x border-[#D4AF37]/35 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-[#D4AF37] text-black">
                      <Trophy className="w-3.5 h-3.5" />
                    </span>
                    GRUPO ELITE
                  </h4>
                  <p className="text-[9px] text-slate-300 font-mono mt-1">
                    1º ao 16º Colocados
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-black text-[#D4AF37] uppercase bg-black/40 border border-[#D4AF37]/30 px-2 py-0.5 rounded-md">
                    Fase 4
                  </span>
                </div>
              </div>
              
              <div className="bg-black/35 border-x border-b border-white/5 rounded-b-2xl p-4 space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar">
                <div className="text-[9px] font-mono text-[#D4AF37]/90 leading-relaxed mb-3 p-2 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-lg">
                  Estes 16 times pulam etapas e avançam diretamente para os confrontos de <strong>Fase 4 (Copas de Elite)</strong>.
                </div>
                
                {eliteGroup.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/30 transition">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-[10px] text-slate-400 text-center w-5 bg-black/30 rounded py-0.5">
                        {t.rank}º
                      </span>
                      <div className="w-7 h-7 bg-zinc-900 rounded-full border border-white/5 flex-shrink-0 flex items-center justify-center p-1">
                        <TeamShield shieldUrl={t.shieldUrl} fallbackText={t.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs uppercase text-slate-100 tracking-wide line-clamp-1">{t.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">Téc: {t.owner}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs font-extrabold text-[#D4AF37]">{t.b10RoundScore.toFixed(2)}</p>
                      <p className="text-[8px] text-slate-500 font-mono">P. Geral: {t.totalLeaguePoints.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2: ACESSO (17th to 46th) */}
            <div className="space-y-3">
              <div className="bg-blue-500/15 p-4 rounded-t-2xl border-t border-x border-blue-500/35 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-blue-500 text-white">
                      <Crown className="w-3.5 h-3.5" />
                    </span>
                    GRUPO ACESSO
                  </h4>
                  <p className="text-[9px] text-slate-300 font-mono mt-1">
                    17º ao 46º Colocados
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-black text-blue-300 uppercase bg-black/40 border border-blue-500/30 px-2 py-0.5 rounded-md">
                    Fase 3
                  </span>
                </div>
              </div>
              
              <div className="bg-black/35 border-x border-b border-white/5 rounded-b-2xl p-4 space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar">
                <div className="text-[9px] font-mono text-blue-300/90 leading-relaxed mb-3 p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                  Estes 30 times garantem vaga nos <strong>Play-offs de Fase 3</strong>, disputando a sobrevida da competição.
                </div>
                
                {acessoGroup.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-[10px] text-slate-400 text-center w-5 bg-black/30 rounded py-0.5">
                        {t.rank}º
                      </span>
                      <div className="w-7 h-7 bg-zinc-900 rounded-full border border-white/5 flex-shrink-0 flex items-center justify-center p-1">
                        <TeamShield shieldUrl={t.shieldUrl} fallbackText={t.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs uppercase text-slate-100 tracking-wide line-clamp-1">{t.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">Téc: {t.owner}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs font-extrabold text-blue-200">{t.b10RoundScore.toFixed(2)}</p>
                      <p className="text-[8px] text-slate-500 font-mono">P. Geral: {t.totalLeaguePoints.toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 3: REPESCAGEM (47th to 50th) */}
            <div className="space-y-3">
              <div className="bg-red-500/15 p-4 rounded-t-2xl border-t border-x border-red-500/35 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-red-500 text-white">
                      <ShieldAlert className="w-3.5 h-3.5" />
                    </span>
                    REPESCAGEM
                  </h4>
                  <p className="text-[9px] text-slate-300 font-mono mt-1">
                    47º ao 50º Colocados
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-black text-red-300 uppercase bg-black/40 border border-red-500/30 px-2 py-0.5 rounded-md">
                    Fase 2
                  </span>
                </div>
              </div>
              
              <div className="bg-black/35 border-x border-b border-white/5 rounded-b-2xl p-4 space-y-2.5 max-h-[480px] overflow-y-auto custom-scrollbar">
                <div className="text-[9px] font-mono text-red-300/90 leading-relaxed mb-3 p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                  Estes 4 times ficam na zona crítica e disputam a <strong>Repescagem na Fase 2 (Rounds B10 2, 3 e 4)</strong>. Apenas os 2 melhores avançam!
                </div>
                
                {repescagemData.map((t) => (
                  <div key={t.id} className={`flex flex-col gap-2 p-2.5 rounded-xl border transition ${
                    t.isTop2 
                      ? 'bg-emerald-500/5 border-emerald-500/15 hover:border-emerald-500/35' 
                      : 'bg-red-500/5 border-red-500/15 hover:border-red-500/35'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono font-black text-[10px] text-center w-5 bg-black/30 rounded py-0.5 ${
                          t.isTop2 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {t.f2Rank}º
                        </span>
                        <div className="w-7 h-7 bg-zinc-900 rounded-full border border-white/5 flex-shrink-0 flex items-center justify-center p-1">
                          <TeamShield shieldUrl={t.shieldUrl} fallbackText={t.name} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs uppercase text-slate-100 tracking-wide line-clamp-1">{t.name}</p>
                          <p className="text-[9px] text-slate-400 font-mono">Téc: {t.owner}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-mono text-xs font-black ${t.isTop2 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {t.totalAccumulated.toFixed(2)}
                        </p>
                        <p className="text-[8px] text-slate-500 font-mono">Acumulado</p>
                      </div>
                    </div>

                    {/* Breakdown pill */}
                    <div className="flex items-center justify-between text-[8px] font-mono border-t border-white/5 pt-1.5 mt-0.5 text-slate-400">
                      <div className="flex gap-1 bg-black/25 px-1.5 py-0.5 rounded border border-white/5">
                        <span>R2:{t.scoreR2.toFixed(0)}</span>
                        <span>•</span>
                        <span>R3:{t.scoreR3.toFixed(0)}</span>
                        <span>•</span>
                        <span>R4:{t.scoreR4.toFixed(0)}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded uppercase font-black text-[7px] ${
                        t.isTop2 ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'
                      }`}>
                        {t.statusLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 1.5: Play-offs (Fase 3) */}
      {activeSubTab === 'playoffs' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header block with visual premium aesthetics */}
          <div className="relative overflow-hidden p-6 rounded-3xl border border-[#D4AF37]/35 bg-[#121212]/90 backdrop-blur-md">
            <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-black tracking-widest mb-2">
                  <Sparkles className="w-2.5 h-2.5" /> Fase 3 (Play-offs) • Mata-mata de Acesso
                </span>
                <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">
                  Jogos de Sobrevivência — Rodada {b10Round + 4}
                </h2>
                <p className="text-xs text-slate-300 font-mono mt-1">
                  Os 30 times do Grupo Acesso competem com os 2 times que escaparam da Repescagem em 16 duelos diretos de semente espelhada.
                </p>
              </div>
              
              <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex items-center gap-3.5 flex-shrink-0 text-xs font-mono">
                <div className="p-2 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
                  <Trophy className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Recompensa</span>
                  <span className="text-[#D4AF37] font-extrabold uppercase text-[10px]">Vaga na Fase 4 (Elite)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" /> Sementes Espelhadas: 17º vs 2º Rep, 18º vs 1º Rep, etc.
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Critério de Desempate: Rank Geral na Liga
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Vencedor garante permanência e joga Fase de Grupos da Elite (Fase 4)
              </span>
            </div>
          </div>

          {/* Grid of 16 Matchups */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playoffMatches.map((match) => {
              const { team1, team2, score1, score2, winner, isPlayed, tiebreakerApplied } = match;

              // Size configuration for long names (>16 characters)
              const nameSize1 = team1.name.length > 16 ? 'text-[9px] sm:text-[10px] leading-tight' : 'text-xs font-extrabold';
              const nameSize2 = team2.name.length > 16 ? 'text-[9px] sm:text-[10px] leading-tight' : 'text-xs font-extrabold';

              return (
                <div 
                  key={match.id}
                  className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 bg-black/50 backdrop-blur-md p-4 transition-all duration-350 shadow-lg group hover:shadow-[0_8px_20px_rgba(212,175,55,0.08)] flex flex-col justify-between min-h-[160px]"
                >
                  {/* Card top banner */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-[9px] font-mono">
                    <span className="text-slate-400 uppercase tracking-widest font-black">
                      Confronto #{match.id}
                    </span>
                    {isPlayed ? (
                      <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                        Finalizado (R{match.f3Round})
                      </span>
                    ) : (
                      <span className="text-[8px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20 font-black tracking-widest uppercase px-2 py-0.5 rounded-full animate-pulse">
                        A realizar (R{match.f3Round})
                      </span>
                    )}
                  </div>

                  {/* Layout com escudos de times lado a lado e o "VS" estilizado */}
                  <div className="grid grid-cols-11 items-center gap-1 py-1">
                    
                    {/* Team 1 Side (Left) */}
                    <div className={`col-span-4 flex flex-col items-center text-center transition-all duration-300 ${
                      isPlayed && winner === 'team2' ? 'grayscale opacity-40' : ''
                    }`}>
                      <div className={`w-11 h-11 bg-zinc-950 rounded-full border p-1.5 flex items-center justify-center mb-1.5 shadow-inner transition-transform group-hover:scale-105 duration-300 ${
                        winner === 'team1' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 bg-gradient-to-b from-[#D4AF37]/10 to-transparent' : 'border-white/5'
                      }`}>
                        <TeamShield shieldUrl={team1.shieldUrl} fallbackText={team1.name} className="w-full h-full object-contain" />
                      </div>
                      
                      <div className="h-8 flex flex-col justify-center min-w-0 w-full mb-1">
                        <span className={`uppercase truncate font-display tracking-wide ${nameSize1} ${
                          winner === 'team1' ? 'text-white font-black' : winner === 'team2' ? 'text-slate-500' : 'text-slate-200'
                        }`}>
                          {team1.name}
                        </span>
                        <span className="text-[8px] text-slate-550 font-mono truncate">
                          Téc: {team1.owner}
                        </span>
                      </div>

                      {/* Rank badge */}
                      <span className="text-[8px] font-mono px-1 rounded bg-white/5 text-slate-400">
                        {team1.category === 'REPESCAGEM' ? `${team1.f2Rank}º Rep.` : `#${team1.rank}º`}
                      </span>
                    </div>

                    {/* VS & Scores Center Panel */}
                    <div className="col-span-3 flex flex-col items-center justify-center">
                      {isPlayed ? (
                        <div className="flex flex-col items-center gap-1 w-full">
                          {/* Rich comparison display */}
                          <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-black w-full bg-black/50 border border-white/5 py-1 px-1 rounded-lg">
                            <span className={winner === 'team1' ? 'text-[#D4AF37] font-black' : 'text-slate-400'}>
                              {score1.toFixed(0)}
                            </span>
                            <span className="text-[8px] text-slate-600 font-normal">:</span>
                            <span className={winner === 'team2' ? 'text-[#D4AF37] font-black' : 'text-slate-400'}>
                              {score2.toFixed(0)}
                            </span>
                          </div>
                          
                          {/* VS / Tiebreaker indicators */}
                          <span className="text-[7px] font-mono uppercase bg-white/5 border border-white/5 text-slate-500 px-1 py-0.2 rounded mt-1">
                            {tiebreakerApplied ? 'C.D.' : 'VS'}
                          </span>
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 flex items-center justify-center text-[9px] font-mono font-black text-[#D4AF37] tracking-wider">
                          VS
                        </div>
                      )}
                    </div>

                    {/* Team 2 Side (Right) */}
                    <div className={`col-span-4 flex flex-col items-center text-center transition-all duration-300 ${
                      isPlayed && winner === 'team1' ? 'grayscale opacity-40' : ''
                    }`}>
                      <div className={`w-11 h-11 bg-zinc-950 rounded-full border p-1.5 flex items-center justify-center mb-1.5 shadow-inner transition-transform group-hover:scale-105 duration-300 ${
                        winner === 'team2' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 bg-gradient-to-b from-[#D4AF37]/10 to-transparent' : 'border-white/5'
                      }`}>
                        <TeamShield shieldUrl={team2.shieldUrl} fallbackText={team2.name} className="w-full h-full object-contain" />
                      </div>
                      
                      <div className="h-8 flex flex-col justify-center min-w-0 w-full mb-1">
                        <span className={`uppercase truncate font-display tracking-wide ${nameSize2} ${
                          winner === 'team2' ? 'text-white font-black' : winner === 'team1' ? 'text-slate-500' : 'text-slate-200'
                        }`}>
                          {team2.name}
                        </span>
                        <span className="text-[8px] text-slate-550 font-mono truncate">
                          Téc: {team2.owner}
                        </span>
                      </div>

                      {/* Rank badge */}
                      <span className="text-[8px] font-mono px-1 rounded bg-white/5 text-slate-400">
                        {team2.category === 'REPESCAGEM' ? `${team2.f2Rank}º Rep.` : `#${team2.rank}º`}
                      </span>
                    </div>

                  </div>

                  {/* Winner indicator or matchup help */}
                  {isPlayed && (
                    <div className="mt-3.5 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono">
                      <span className="text-slate-500">Garante Vaga:</span>
                      <div className="flex items-center gap-1 font-bold text-emerald-400 uppercase">
                        <Trophy className="w-2.5 h-2.5 text-[#D4AF37]" />
                        <span className="truncate max-w-[90px]">
                          {winner === 'team1' ? team1.name : team2.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 1.75: Elite 32 (Fase 4) */}
      {activeSubTab === 'fase4' && (
        <B10RoundOf32
          teams={teams}
          mappedB10Teams={mappedB10Teams}
          playoffMatches={playoffMatches}
          b10Round={b10Round}
          currentRound={currentRound}
          isSimulatorsEnabled={isSimulatorsEnabled}
        />
      )}

      {/* Tab 1.85: Fase Final */}
      {activeSubTab === 'fasefinal' && (
        <B10FinalBracket
          teams={teams}
          mappedB10Teams={mappedB10Teams}
          playoffMatches={playoffMatches}
          b10Round={b10Round}
          currentRound={currentRound}
          isSimulatorsEnabled={isSimulatorsEnabled}
        />
      )}

      {/* Tab 2: Tabela de Classificação */}
      {activeSubTab === 'tabela' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Filtering Header bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-[#121212]/60 border border-white/5 rounded-2xl">
            <div>
              <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Tabela Consolidada (R{b10Round})
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Classificação completa dos 50 times ordenada pela rodada e critérios de desempate.
              </p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="Buscar time ou técnico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 text-xs text-white placeholder-slate-500 pl-9 pr-4 py-2 border border-white/10 rounded-xl focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Core Table Grid */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#121212]/90">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/50 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-white/10">
                    <th className="py-3.5 px-4 text-center w-14">Pos</th>
                    <th className="py-3.5 px-4">Clube & Cartoleiro</th>
                    <th className="py-3.5 px-4 text-center w-40">Divisão / Destino</th>
                    <th className="py-3.5 px-4 text-right w-28">Score R{b10Round}</th>
                    <th className="py-3.5 px-4 text-right w-36">Rank Geral Liga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredB10Teams.map((t) => {
                    return (
                      <tr 
                        key={t.id} 
                        className={`hover:bg-white/5 transition duration-200 ${
                          t.category === 'ELITE' 
                            ? 'bg-[#D4AF37]/3' 
                            : t.category === 'REPESCAGEM'
                              ? 'bg-red-500/3'
                              : ''
                        }`}
                      >
                        {/* Position */}
                        <td className="py-3 px-4 text-center font-mono text-xs font-black">
                          <span className={
                            t.category === 'ELITE' 
                              ? "text-[#D4AF37]" 
                              : t.category === 'REPESCAGEM' 
                                ? "text-red-400" 
                                : "text-white"
                          }>
                            {t.rank}º
                          </span>
                        </td>

                        {/* Logo Shield & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex-shrink-0 bg-black/45 rounded-full border border-white/10 flex items-center justify-center p-1">
                              <TeamShield shieldUrl={t.shieldUrl} fallbackText={t.name} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-xs uppercase tracking-wide text-white line-clamp-1">{t.name}</span>
                                {t.isTiedWithSomeone && (
                                  <span 
                                    className="px-1.5 py-0.5 rounded text-[8px] bg-white/5 border border-white/10 font-mono text-slate-300"
                                    title="Desempatado por Ranking Geral do Cartola FC"
                                  >
                                    C.D.
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono">Téc: {t.owner}</p>
                            </div>
                          </div>
                        </td>

                        {/* Mapped Destination */}
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider border ${t.badgeStyle}`}>
                            {t.category === 'ELITE' && <Crown className="w-2.5 h-2.5" />}
                            {t.category === 'ACESSO' && <Activity className="w-1.5 h-2.5" />}
                            {t.category === 'REPESCAGEM' && <ShieldAlert className="w-2.5 h-2.5" />}
                            {t.category}
                          </span>
                        </td>

                        {/* Score of Selected Round */}
                        <td className={`py-3 px-4 text-right font-mono text-xs font-extrabold ${
                          t.category === 'ELITE' 
                            ? "text-[#D4AF37]" 
                            : t.category === 'REPESCAGEM' 
                              ? "text-red-400" 
                              : "text-white"
                        }`}>
                          {t.b10RoundScore.toFixed(2)}
                        </td>

                        {/* General League Position + Tiebreaker help */}
                        <td className="py-3 px-4 text-right font-mono">
                          <div className="text-xs text-slate-300 font-bold">
                            #{t.leagueRank} Colocado
                          </div>
                          <div className="text-[9px] text-slate-500">
                            {t.totalLeaguePoints.toFixed(2)} pts acumulados
                          </div>
                        </td>

                      </tr>
                    );
                  })}

                  {filteredB10Teams.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs font-mono text-slate-400">
                        Nenhum clube correspondente aos critérios de busca "{searchTerm}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Unified Official Tournament Calendar */}
      {activeSubTab === 'cronograma' && (
        <div className="mt-6">
          <TournamentCalendarView currentRound={currentRound} />
        </div>
      )}

      {/* Tab 3: Regulamento & Desempates */}
      {activeSubTab === 'regulamento' && (
        <section className="p-6 rounded-2xl border border-white/10 bg-[#121212]/80 space-y-6 text-slate-300 animate-fadeIn">
          <div>
            <h3 className="text-base font-display font-black text-white uppercase flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#D4AF37]" /> Regulamento Especial da Copa B10
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">Conheça as regras de afunilamento, divisões e a prioridade matemática do desempate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase text-white font-black tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/5">
                <span className="w-1.5 h-3 bg-[#D4AF37] rounded-sm" /> Mapeamento de Destinos (Fase 1)
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                A Copa B10 se inicia com a <strong>Fase 1: Rodada de Corte</strong>. A partir do desempenho individual colhido na Cartola FC na rodada de corte (padrão: Rodada {b10Round}), os clubes inscritos são direcionados para três caminhos competitivos:
              </p>
              
              <ul className="space-y-3.5 text-xs font-mono">
                <li className="flex gap-2.5 items-start">
                  <ChevronRight className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#D4AF37]">Grupo ELITE (Rank 1 a 16):</strong> Avança direto pulando fases iniciais e indo direto para a <strong>Fase 4 (Round of 32 / Copas de Elite)</strong>.
                  </div>
                </li>
                <li className="flex gap-2.5 items-start">
                  <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-blue-300">Grupo ACESSO (Rank 17 a 46):</strong> Se classificam para os <strong>Play-offs de Fase 3</strong>, onde disputam acesso para se juntarem à elite na Fase 4.
                  </div>
                </li>
                <li className="flex gap-2.5 items-start">
                  <ChevronRight className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-400">Grupo REPESCAGEM (Rank 47 a 50):</strong> Entram na repescagem imediata da <strong>Fase 2</strong>, tentando escapar da eliminação precoce do torneio.
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase text-white font-black tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/5">
                <span className="w-1.5 h-3 bg-[#D4AF37] rounded-sm" /> Hierarquia de Desempate (Sênior)
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                Havendo igualdade exata na pontuação conquistada na rodada de corte, a plataforma executa de forma eletrônica e nativa a seguinte hierarquia matemática de desempate:
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">1</span>
                    <span className="font-bold text-white text-[11px] uppercase">Pontos da Fase Anterior</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Maior pontuação acumulada na fase anterior (Se houver). Como a rodada é a Fase 1 (Rodada de Corte), este critério padrão resulta em zero e passa para o critério subsequente.
                  </p>
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#D4AF37] text-black w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">2</span>
                    <span className="font-bold text-white text-[11px] uppercase">Ranking Geral da Liga</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Soma de todos os pontos acumulados por cada clube desde o início da Liga até a rodada atual no Cartola FC. O clube que ocupar a melhor posição (maior volume de pontos e por consequência, menor índice de Ranking Geral) consome a vantagem do desequilíbrio e assume a classificação.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

    </div>
  );
};

export default CopaB10;
