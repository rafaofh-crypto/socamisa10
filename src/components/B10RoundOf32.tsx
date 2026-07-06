import React, { useMemo } from 'react';
import { CartolaTeam } from '../services/cartolaService';
import TeamShield from './TeamShield';
import { Trophy, Crown, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

interface B10RoundOf32Props {
  teams: CartolaTeam[];
  mappedB10Teams: any[];
  playoffMatches: any[];
  b10Round: number;
  currentRound: number;
  isSimulatorsEnabled?: boolean;
}

export const B10RoundOf32 = ({
  teams = [],
  mappedB10Teams = [],
  playoffMatches = [],
  b10Round,
  currentRound,
  isSimulatorsEnabled = true
}: B10RoundOf32Props) => {
  const f4Round = b10Round + 5; // Round 6 of Copa B10
  const isRound6Completed = isSimulatorsEnabled || currentRound >= f4Round;

  // 1. Get the 16 Elite teams from Phase 1 (1º to 16º)
  const eliteTeams = useMemo(() => {
    return [...mappedB10Teams]
      .filter(t => t.category === 'ELITE')
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 16);
  }, [mappedB10Teams]);

  // 2. Compute the playoff winners from Phase 3 (Playoffs - Round 5)
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
          seedRank: winnerTeam.rank // Position in Phase 1
        };
      } else {
        // Play-offs are not played yet (Virtual Mode)
        // High rank number represents a lower quality seed.
        // Seeding 17 to 32 is simulated gracefully.
        return {
          isVirtual: true,
          id: `v-winner-${match.id}`,
          name: `Vencedor Play-off #${match.id}`,
          owner: `Definido pelo duelo: ${match.team1.name} vs ${match.team2.name}`,
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

  // 3. Sort Playoff Winners (descending seedRank means worse seed quality matches top elite seeds)
  const sortedWinnersDesc = useMemo(() => {
    return [...playoffWinners].sort((a, b) => b.seedRank - a.seedRank);
  }, [playoffWinners]);

  // 4. Generate the 16 Round of 32 Matches
  const roundOf32Matches = useMemo(() => {
    const matchesList = [];

    for (let i = 0; i < 16; i++) {
      const home = eliteTeams[i];
      const away = sortedWinnersDesc[i];

      if (home && away) {
        const scoreHome = (isSimulatorsEnabled || f4Round <= currentRound) && typeof home.scores[f4Round] === 'number' ? home.scores[f4Round] : 0;
        const scoreAway = (isSimulatorsEnabled || f4Round <= currentRound) && typeof away.scores[f4Round] === 'number' ? away.scores[f4Round] : 0;

        let winner: 'home' | 'away' | null = null;
        let tiebreakerApplied = false;

        // Determine winner if round is played and away team is not a placeholder
        if (isRound6Completed && !away.isVirtual) {
          if (scoreHome > scoreAway) {
            winner = 'home';
          } else if (scoreAway > scoreHome) {
            winner = 'away';
          } else {
            // Tiebreaker: General Cartola FC ranking (lower leagueRank is better)
            winner = (home.leagueRank || 99) < (away.leagueRank || 99) ? 'home' : 'away';
            tiebreakerApplied = true;
          }
        }

        matchesList.push({
          id: i + 1,
          home,
          away,
          scoreHome,
          scoreAway,
          winner,
          tiebreakerApplied,
          isPlayed: isRound6Completed && !away.isVirtual,
          f4Round
        });
      }
    }

    return matchesList;
  }, [eliteTeams, sortedWinnersDesc, f4Round, isRound6Completed]);

  // Helper for dynamic font scaling on long names
  const formatNameClass = (name: string) => {
    if (name.length > 18) {
      return 'text-[9px] sm:text-[10px] leading-[1.1] font-bold';
    } else if (name.length > 14) {
      return 'text-[10px] sm:text-xs leading-tight font-extrabold';
    }
    return 'text-xs sm:text-sm font-black';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner - Hall da Fama */}
      <div className="relative overflow-hidden p-6 rounded-3xl border border-[#D4AF37]/35 bg-[#121212]/90 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-2.5 py-0.5 rounded text-[9px] font-mono uppercase font-black tracking-widest mb-2">
              <Crown className="w-2.5 h-2.5" /> Fase 4 (Elite) • 16-avos de Final
            </span>
            <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">
              Copa de Elite — Rodada {f4Round}
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Os 16 times da elite (1º ao 16º da Fase 1) encaram os 16 sobreviventes dos Play-offs em cruzamentos de puro mérito.
            </p>
          </div>
          
          <div className="bg-black/40 border border-white/5 p-3 rounded-2xl flex items-center gap-3.5 flex-shrink-0 text-xs font-mono">
            <div className="p-2 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
              <Trophy className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">Objetivo</span>
              <span className="text-[#D4AF37] font-extrabold uppercase text-[10px]">Avançar para as Oitavas</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> Lógica de Cruzamento: 1º Geral vs Pior Classificado do Play-off, 2º vs 2º Pior...
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Desempate: Maior pontuação agregada da Liga Cartola original.
          </span>
        </div>
      </div>

      {/* Grid of Round of 32 Matches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {roundOf32Matches.map((match) => {
          const { home, away, scoreHome, scoreAway, winner, isPlayed, tiebreakerApplied } = match;

          return (
            <div 
              key={match.id}
              className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/25 hover:border-[#D4AF37]/75 bg-black/55 backdrop-blur-[12px] p-4 transition-all duration-300 shadow-lg group hover:shadow-[0_8px_25px_rgba(212,175,55,0.06)] flex flex-col justify-between min-h-[165px]"
            >
              {/* Header Matchup Tag */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-[9px] font-mono">
                <span className="text-slate-400 uppercase tracking-wider font-extrabold">
                  Duelo #{match.id}
                </span>
                {isPlayed ? (
                  <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                    Finalizado
                  </span>
                ) : (
                  <span className="text-[8px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25 font-black tracking-widest uppercase px-1.5 py-0.5 rounded">
                    A confirmar (R{match.f4Round})
                  </span>
                )}
              </div>

              {/* Side-by-side Matchup Flow */}
              <div className="grid grid-cols-11 items-center gap-1 py-1">
                
                {/* Home/Elite Team (Left) */}
                <div className="col-span-4 flex flex-col items-center text-center">
                  <div className={`w-11 h-11 bg-zinc-950 rounded-full border p-1.5 flex items-center justify-center mb-1.5 shadow-inner transition-transform group-hover:scale-105 duration-300 ${
                    winner === 'home' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 bg-gradient-to-b from-[#D4AF37]/15 to-transparent' : 'border-white/5'
                  }`}>
                    <TeamShield shieldUrl={home.shieldUrl} fallbackText={home.name} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="h-8 flex flex-col justify-center min-w-0 w-full mb-1">
                    <span className={`uppercase truncate font-display tracking-wide ${formatNameClass(home.name)} ${
                      winner === 'home' ? 'text-white font-black' : winner === 'away' ? 'text-slate-500' : 'text-slate-200'
                    }`}>
                      {home.name}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono truncate">
                      Téc: {home.owner}
                    </span>
                  </div>

                  {/* Seed Badge */}
                  <span className="text-[7.5px] font-mono px-1 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15 uppercase font-black tracking-wide">
                    {home.category === 'ELITE' ? `#${home.rank}º Elite` : `#${home.rank}º`}
                  </span>
                </div>

                {/* VS Panel (Center) */}
                <div className="col-span-3 flex flex-col items-center justify-center">
                  {isPlayed ? (
                    <div className="flex flex-col items-center gap-1 w-full">
                      <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-black w-full bg-black/60 border border-white/5 py-1 px-1.5 rounded-lg">
                        <span className={winner === 'home' ? 'text-[#D4AF37] font-black' : 'text-slate-400'}>
                          {scoreHome.toFixed(0)}
                        </span>
                        <span className="text-[8px] text-slate-600">:</span>
                        <span className={winner === 'away' ? 'text-[#D4AF37] font-black' : 'text-slate-400'}>
                          {scoreAway.toFixed(0)}
                        </span>
                      </div>
                      
                      <span className="text-[7px] font-mono uppercase bg-white/5 border border-white/5 text-slate-500 px-1 py-0.2 rounded mt-1">
                        {tiebreakerApplied ? 'C.D.' : 'VS'}
                      </span>
                    </div>
                  ) : (
                    <div className="relative flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/5 flex items-center justify-center text-[9px] font-mono font-black text-[#D4AF37] tracking-wider shadow">
                        VS
                      </div>
                    </div>
                  )}
                </div>

                {/* Away/Playoff Winner Team (Right) */}
                <div className="col-span-4 flex flex-col items-center text-center">
                  <div className={`w-11 h-11 bg-zinc-950 rounded-full border p-1.5 flex items-center justify-center mb-1.5 shadow-inner transition-transform group-hover:scale-105 duration-300 ${
                    winner === 'away' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 bg-gradient-to-b from-[#D4AF37]/15 to-transparent' : 'border-white/5'
                  }`}>
                    {away.shieldUrl ? (
                      <TeamShield shieldUrl={away.shieldUrl} fallbackText={away.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-full border border-white/10 text-[#D4AF37]">
                        <Crown className="w-4 h-4 opacity-75" />
                      </div>
                    )}
                  </div>
                  
                  <div className="h-8 flex flex-col justify-center min-w-0 w-full mb-1">
                    <span 
                      className={`uppercase truncate font-display tracking-wide ${formatNameClass(away.name)} ${
                        winner === 'away' ? 'text-white font-black' : winner === 'home' ? 'text-slate-500' : 'text-slate-200'
                      }`}
                      title={away.name}
                    >
                      {away.name}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono truncate" title={away.owner}>
                      Téc: {away.owner}
                    </span>
                  </div>

                  {/* Seed / Playoff Badge */}
                  <span className="text-[7.5px] font-mono px-1 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/15 uppercase font-medium">
                    {away.isVirtual ? 'Play-off' : `#${away.seedRank}º Playoff`}
                  </span>
                </div>

              </div>

              {/* Bottom Winner Bar */}
              {isPlayed && (
                <div className="mt-3.5 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono">
                  <span className="text-slate-500">Classificado:</span>
                  <div className="flex items-center gap-1 font-bold text-emerald-400 uppercase">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    <span className="truncate max-w-[95px]" title={winner === 'home' ? home.name : away.name}>
                      {winner === 'home' ? home.name : away.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
