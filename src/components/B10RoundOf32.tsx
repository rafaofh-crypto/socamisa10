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
  isSimulatorsEnabled = false
}: B10RoundOf32Props) => {
  const f4Leg1Round = b10Round + 4; // Rodada 29 (Ida da Fase 4)
  const f4Leg2Round = b10Round + 5; // Rodada 30 (Volta da Fase 4)
  const isRound6Completed = isSimulatorsEnabled || currentRound >= f4Leg2Round;
  const isAwaitingRound25 = !isSimulatorsEnabled && currentRound < 25;

  // 1. Get the 16 Elite teams from Phase 1 (1º to 16º)
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
        // Safe check for official scores in R29 (Ida) and R30 (Volta)
        const homeScoreLeg1 = (home.scores && typeof home.scores[f4Leg1Round] === 'number') ? home.scores[f4Leg1Round] : null;
        const awayScoreLeg1 = (away.scores && typeof away.scores[f4Leg1Round] === 'number') ? away.scores[f4Leg1Round] : null;
        
        const homeScoreLeg2 = (home.scores && typeof home.scores[f4Leg2Round] === 'number') ? home.scores[f4Leg2Round] : null;
        const awayScoreLeg2 = (away.scores && typeof away.scores[f4Leg2Round] === 'number') ? away.scores[f4Leg2Round] : null;

        const hasLeg1Data = (homeScoreLeg1 !== null && awayScoreLeg1 !== null) || isSimulatorsEnabled;
        const hasLeg2Data = (homeScoreLeg2 !== null && awayScoreLeg2 !== null) || (isSimulatorsEnabled && homeScoreLeg2 !== null);

        const isFullyPlayed = hasLeg1Data && hasLeg2Data && !away.isVirtual;
        const isLeg1Played = hasLeg1Data && !away.isVirtual;

        // Cumulative aggregate is only computed when both legs have official scores
        const aggregateHome = isFullyPlayed 
          ? Number(((homeScoreLeg1 ?? 0) + (homeScoreLeg2 ?? 0)).toFixed(2))
          : null;
        const aggregateAway = isFullyPlayed 
          ? Number(((awayScoreLeg1 ?? 0) + (awayScoreLeg2 ?? 0)).toFixed(2))
          : null;

        let winner: 'home' | 'away' | null = null;
        let tiebreakerApplied = false;

        // ONLY determine winner when the phase is concluded with both legs played
        if (isFullyPlayed && aggregateHome !== null && aggregateAway !== null) {
          if (aggregateHome > aggregateAway) {
            winner = 'home';
          } else if (aggregateAway > aggregateHome) {
            winner = 'away';
          } else {
            // Regulamento Oficial Copa B10 - Hierarquia de Desempates:
            // 1. Melhor Semente de Categoria (Elite #1-16 vs Playoff) -> Home é Elite
            // 2. Melhor pontuação na Rodada de Corte (R25)
            // 3. Melhor posição no Ranking Geral Acumulado
            winner = (home.rank < (away.seedRank || away.rank || 99)) ? 'home' : (
              (home.scores?.[b10Round] || 0) > (away.scores?.[b10Round] || 0) ? 'home' : (
                (home.leagueRank || 99) <= (away.leagueRank || 99) ? 'home' : 'away'
              )
            );
            tiebreakerApplied = true;
          }
        }

        // Parcial after Leg 1 (when Leg 2 is still pending)
        let provisionalAdvantage: {
          leader: 'home' | 'away' | 'tied';
          diff: number;
          text: string;
        } | null = null;

        if (isLeg1Played && !isFullyPlayed && homeScoreLeg1 !== null && awayScoreLeg1 !== null) {
          const diff = Number((homeScoreLeg1 - awayScoreLeg1).toFixed(2));
          if (diff > 0) {
            provisionalAdvantage = {
              leader: 'home',
              diff,
              text: `+${diff.toFixed(2)} pts para ${home.name}`
            };
          } else if (diff < 0) {
            provisionalAdvantage = {
              leader: 'away',
              diff: Math.abs(diff),
              text: `+${Math.abs(diff).toFixed(2)} pts para ${away.name}`
            };
          } else {
            provisionalAdvantage = {
              leader: 'tied',
              diff: 0,
              text: 'Empate provisório'
            };
          }
        }

        matchesList.push({
          id: i + 1,
          home,
          away,
          homeScoreLeg1,
          homeScoreLeg2,
          awayScoreLeg1,
          awayScoreLeg2,
          aggregateHome,
          aggregateAway,
          winner,
          tiebreakerApplied,
          isFullyPlayed,
          isLeg1Played,
          provisionalAdvantage,
          f4Leg1Round,
          f4Leg2Round
        });
      }
    }

    return matchesList;
  }, [eliteTeams, sortedWinnersDesc, f4Leg1Round, f4Leg2Round, isSimulatorsEnabled, b10Round]);

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
              Copa de Elite — Rodadas {f4Leg1Round} e {f4Leg2Round} (Agregado de 180 Min)
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
          const { 
            home, 
            away, 
            homeScoreLeg1, 
            homeScoreLeg2, 
            awayScoreLeg1, 
            awayScoreLeg2, 
            aggregateHome, 
            aggregateAway, 
            winner, 
            tiebreakerApplied, 
            isFullyPlayed, 
            isLeg1Played, 
            provisionalAdvantage 
          } = match;

          return (
            <div 
              key={match.id}
              className={`relative overflow-hidden rounded-2xl border bg-black/60 backdrop-blur-[12px] p-4 transition-all duration-300 shadow-lg flex flex-col justify-between min-h-[195px] group ${
                isFullyPlayed 
                  ? 'border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_8px_25px_rgba(16,185,129,0.08)]' 
                  : isLeg1Played 
                    ? 'border-[#D4AF37]/35 hover:border-[#D4AF37]/75 shadow-[0_8px_25px_rgba(212,175,55,0.08)]' 
                    : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Header Matchup Tag */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[9px] font-mono">
                <span className="text-[#D4AF37] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isFullyPlayed ? 'bg-emerald-400' : isLeg1Played ? 'bg-[#D4AF37] animate-pulse' : 'bg-slate-500'}`} />
                  Duelo #{match.id}
                </span>
                {isFullyPlayed ? (
                  <span className="text-[8px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black tracking-widest uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Finalizado (R{match.f4Leg1Round} e R{match.f4Leg2Round})
                  </span>
                ) : isLeg1Played ? (
                  <span className="text-[8px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-black tracking-widest uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" /> Parcial da Ida (R{match.f4Leg1Round}) • Volta Pendente (R{match.f4Leg2Round})
                  </span>
                ) : (
                  <span className="text-[8px] bg-slate-500/10 text-slate-400 border border-slate-500/20 font-black tracking-widest uppercase px-1.5 py-0.5 rounded">
                    A confirmar (R{match.f4Leg1Round} e R{match.f4Leg2Round})
                  </span>
                )}
              </div>

              {/* Side-by-side Matchup Flow */}
              <div className="grid grid-cols-11 items-center gap-1 py-1">
                
                {/* Home/Elite Team (Left) */}
                <div className="col-span-4 flex flex-col items-center text-center">
                  <div className={`w-11 h-11 bg-zinc-950 rounded-full border p-1.5 flex items-center justify-center mb-1.5 shadow-inner transition-transform group-hover:scale-105 duration-300 ${
                    winner === 'home' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 bg-gradient-to-b from-[#D4AF37]/15 to-transparent' : 'border-white/10'
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

                  {/* Leg Breakdown Box */}
                  <div className="w-full mt-2 bg-black/50 border border-white/5 rounded-lg p-1 text-[8px] font-mono">
                    <div className="flex items-center justify-between text-slate-500 text-[7px] mb-0.5">
                      <span>IDA (R{match.f4Leg1Round})</span>
                      <span>VOLTA (R{match.f4Leg2Round})</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className={homeScoreLeg1 !== null ? 'text-white' : 'text-slate-500'}>
                        {homeScoreLeg1 !== null ? homeScoreLeg1.toFixed(2) : '—'}
                      </span>
                      <span className="text-slate-700">:</span>
                      <span className={homeScoreLeg2 !== null ? 'text-white' : 'text-amber-400/70 italic text-[7px]'}>
                        {homeScoreLeg2 !== null ? homeScoreLeg2.toFixed(2) : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* VS / Score Panel (Center) */}
                <div className="col-span-3 flex flex-col items-center justify-center">
                  {isFullyPlayed && aggregateHome !== null && aggregateAway !== null ? (
                    <div className="flex flex-col items-center gap-1 w-full">
                      <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-black w-full bg-black/80 border border-emerald-500/30 py-1.5 px-1 rounded-lg shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                        <span className={winner === 'home' ? 'text-emerald-400 font-black' : 'text-slate-400'}>
                          {aggregateHome.toFixed(2)}
                        </span>
                        <span className="text-[8px] text-slate-600">:</span>
                        <span className={winner === 'away' ? 'text-emerald-400 font-black' : 'text-slate-400'}>
                          {aggregateAway.toFixed(2)}
                        </span>
                      </div>
                      
                      <span className="text-[6.5px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 py-0.5 rounded font-black tracking-wider text-center">
                        {tiebreakerApplied ? 'C.D. Regulamento' : 'Agregado Final'}
                      </span>
                    </div>
                  ) : isLeg1Played && homeScoreLeg1 !== null && awayScoreLeg1 !== null ? (
                    <div className="flex flex-col items-center gap-1 w-full">
                      <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-black w-full bg-black/80 border border-[#D4AF37]/40 py-1.5 px-1 rounded-lg shadow-[0_0_12px_rgba(212,175,55,0.12)]">
                        <span className={homeScoreLeg1 > awayScoreLeg1 ? 'text-[#D4AF37] font-black' : homeScoreLeg1 < awayScoreLeg1 ? 'text-slate-400' : 'text-white'}>
                          {homeScoreLeg1.toFixed(2)}
                        </span>
                        <span className="text-[8px] text-slate-600">:</span>
                        <span className={awayScoreLeg1 > homeScoreLeg1 ? 'text-[#D4AF37] font-black' : awayScoreLeg1 < homeScoreLeg1 ? 'text-slate-400' : 'text-white'}>
                          {awayScoreLeg1.toFixed(2)}
                        </span>
                      </div>
                      
                      <span className="text-[6.5px] font-mono uppercase bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-1 py-0.5 rounded font-black tracking-wider text-center">
                        Ida (90 Min)
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
                    winner === 'away' ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 bg-gradient-to-b from-[#D4AF37]/15 to-transparent' : 'border-white/10'
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

                  {/* Leg Breakdown Box */}
                  <div className="w-full mt-2 bg-black/50 border border-white/5 rounded-lg p-1 text-[8px] font-mono">
                    <div className="flex items-center justify-between text-slate-500 text-[7px] mb-0.5">
                      <span>IDA (R{match.f4Leg1Round})</span>
                      <span>VOLTA (R{match.f4Leg2Round})</span>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className={awayScoreLeg1 !== null ? 'text-white' : 'text-slate-500'}>
                        {awayScoreLeg1 !== null ? awayScoreLeg1.toFixed(2) : '—'}
                      </span>
                      <span className="text-slate-700">:</span>
                      <span className={awayScoreLeg2 !== null ? 'text-white' : 'text-amber-400/70 italic text-[7px]'}>
                        {awayScoreLeg2 !== null ? awayScoreLeg2.toFixed(2) : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Winner Bar / Provisional Advantage Bar */}
              {isFullyPlayed && winner ? (
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono">
                  <span className="text-slate-500 uppercase tracking-wider font-bold">Classificado:</span>
                  <div className="flex items-center gap-1 font-bold text-emerald-400 uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="truncate max-w-[125px]" title={winner === 'home' ? home.name : away.name}>
                      {winner === 'home' ? home.name : away.name}
                    </span>
                  </div>
                </div>
              ) : isLeg1Played && provisionalAdvantage ? (
                <div className="mt-3 pt-2 border-t border-white/5 flex flex-col gap-1 text-[8px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 uppercase font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" /> Vantagem Provisória:
                    </span>
                    <span className={`font-black uppercase truncate max-w-[130px] ${
                      provisionalAdvantage.leader === 'home' ? 'text-[#D4AF37]' : provisionalAdvantage.leader === 'away' ? 'text-blue-300' : 'text-slate-300'
                    }`} title={provisionalAdvantage.text}>
                      {provisionalAdvantage.text}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[7.5px] text-slate-500 pt-0.5">
                    <span>Decisão da vaga:</span>
                    <span className="text-amber-400/80 font-bold uppercase">Volta na R30 (Jogo Aberto)</span>
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-slate-500">
                  <span>Duelo de 180 Minutos</span>
                  <span>Aguardando R29 e R30</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
