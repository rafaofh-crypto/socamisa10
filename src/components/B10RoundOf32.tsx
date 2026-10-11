import React, { useMemo } from 'react';
import { CartolaTeam } from '../services/cartolaService';
import TeamShield from './TeamShield';
import { Trophy, Crown, Sparkles, Flame } from 'lucide-react';

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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 rounded-3xl border border-[#D4AF37]/35 bg-[#121212]/90 backdrop-blur-md shadow-2xl">
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> Sementes Espelhadas: 1º Geral vs 16º Play-off, 2º vs 15º...
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Desempate Regulamentar: Semente de Elite &gt; R25 &gt; Rank Geral da Liga
          </span>
        </div>
      </div>

      {/* Grid of 16 Matchups - Exato padrão visual da Fase 3 (Play-offs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
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

          // Destaque visual em verde:
          // Se finalizado (R30 homologada): para o classificado definitivo (winner)
          // Se em andamento (R29 homologada, R30 pendente): para quem possui a vantagem provisória
          const isHomeHighlighted = isFullyPlayed 
            ? winner === 'home' 
            : (isLeg1Played && provisionalAdvantage?.leader === 'home');

          const isAwayHighlighted = isFullyPlayed 
            ? winner === 'away' 
            : (isLeg1Played && provisionalAdvantage?.leader === 'away');

          return (
            <div 
              key={match.id}
              className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 bg-[#090909]/95 backdrop-blur-md p-5 transition-all duration-350 shadow-2xl flex flex-col justify-between group"
            >
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-[10px] font-mono">
                <span className="text-[#D4AF37] uppercase tracking-widest font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] inline-block shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  CONFRONTO #{match.id}
                </span>
                <span className="bg-[#141414] border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                  IDA: R{match.f4Leg1Round} • VOLTA: R{match.f4Leg2Round}
                </span>
              </div>

              {/* Teams Side-by-Side with Center VS */}
              <div className="relative grid grid-cols-2 gap-3 items-start my-2">
                
                {/* VS Circle Badge Centered */}
                <div className="absolute left-1/2 top-11 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-[#181408] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] text-[10px] font-mono font-black shadow-lg">
                  VS
                </div>

                {/* Team 1 (Left - Home / Elite) */}
                <div className="flex flex-col items-center text-center min-w-0">
                  {/* Shield */}
                  <div className="w-16 h-16 bg-[#121212] rounded-full border border-white/10 p-2 flex items-center justify-center mb-2 shadow-inner">
                    {!home.shieldUrl ? (
                      <div className="w-full h-full rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                      </div>
                    ) : (
                      <TeamShield shieldUrl={home.shieldUrl} fallbackText={home.name} className="w-full h-full object-contain" />
                    )}
                  </div>

                  {/* Name */}
                  <h4 className="font-display font-black text-sm uppercase tracking-wide text-white truncate max-w-full px-1 text-center leading-tight">
                    {home.name}
                  </h4>

                  {/* Owner */}
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-full text-center mt-0.5">
                    Téc: {home.owner}
                  </p>

                  {/* Position Tag */}
                  <div className="flex justify-center mt-1.5 mb-3">
                    <span className="bg-[#141414] border border-white/10 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
                      #{home.rank}º Elite
                    </span>
                  </div>

                  {/* Legs Box: IDA (R29) | VOLTA (R30) */}
                  <div className={`w-full bg-[#121212] rounded-xl p-2.5 shadow-sm transition-all duration-300 ${
                    isHomeHighlighted
                      ? 'border-2 border-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.35)]'
                      : 'border border-white/10'
                  }`}>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 font-bold px-1 mb-1">
                      <span>IDA (R{match.f4Leg1Round})</span>
                      <span className="text-slate-600 font-normal">|</span>
                      <span>VOLTA (R{match.f4Leg2Round})</span>
                    </div>
                    <div className="flex items-center justify-around font-mono text-xs font-bold text-white">
                      <span className={homeScoreLeg1 !== null ? 'text-white' : 'text-slate-500 tracking-widest'}>
                        {homeScoreLeg1 !== null ? homeScoreLeg1.toFixed(2) : '———'}
                      </span>
                      <span className="text-slate-600 font-normal">:</span>
                      <span className={homeScoreLeg2 !== null ? 'text-white' : 'text-slate-500 tracking-widest'}>
                        {homeScoreLeg2 !== null ? homeScoreLeg2.toFixed(2) : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team 2 (Right - Away / Play-off) */}
                <div className="flex flex-col items-center text-center min-w-0">
                  {/* Shield */}
                  <div className="w-16 h-16 bg-[#121212] rounded-full border border-white/10 p-2 flex items-center justify-center mb-2 shadow-inner">
                    {away.isVirtual || !away.shieldUrl ? (
                      <div className="w-full h-full rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                        <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                      </div>
                    ) : (
                      <TeamShield shieldUrl={away.shieldUrl} fallbackText={away.name} className="w-full h-full object-contain" />
                    )}
                  </div>

                  {/* Name */}
                  <h4 className="font-display font-black text-sm uppercase tracking-wide text-white truncate max-w-full px-1 text-center leading-tight">
                    {away.name}
                  </h4>

                  {/* Owner */}
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-full text-center mt-0.5">
                    {away.isVirtual ? 'Definido pelo Play-off' : `Téc: ${away.owner}`}
                  </p>

                  {/* Position Tag */}
                  <div className="flex justify-center mt-1.5 mb-3">
                    <span className="bg-[#141414] border border-white/10 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
                      {away.isVirtual ? 'Play-off' : `#${away.seedRank || away.rank}º Playoff`}
                    </span>
                  </div>

                  {/* Legs Box: IDA (R29) | VOLTA (R30) */}
                  <div className={`w-full bg-[#121212] rounded-xl p-2.5 shadow-sm transition-all duration-300 ${
                    isAwayHighlighted
                      ? 'border-2 border-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.35)]'
                      : 'border border-white/10'
                  }`}>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 font-bold px-1 mb-1">
                      <span>IDA (R{match.f4Leg1Round})</span>
                      <span className="text-slate-600 font-normal">|</span>
                      <span>VOLTA (R{match.f4Leg2Round})</span>
                    </div>
                    <div className="flex items-center justify-around font-mono text-xs font-bold text-white">
                      <span className={awayScoreLeg1 !== null ? 'text-white' : 'text-slate-500 tracking-widest'}>
                        {awayScoreLeg1 !== null ? awayScoreLeg1.toFixed(2) : '———'}
                      </span>
                      <span className="text-slate-600 font-normal">:</span>
                      <span className={awayScoreLeg2 !== null ? 'text-white' : 'text-slate-500 tracking-widest'}>
                        {awayScoreLeg2 !== null ? awayScoreLeg2.toFixed(2) : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Agregado Bottom Green Capsule */}
              <div className="mt-4 w-full bg-[#052319] border border-emerald-500/40 rounded-2xl py-3 px-4 flex flex-col items-center justify-center shadow-inner transition-all">
                <span className="text-emerald-400 text-[10px] font-mono font-black tracking-widest uppercase mb-1">
                  {isFullyPlayed ? 'AGREGADO FINAL' : isLeg1Played ? 'AGREGADO PARCIAL' : 'AGREGADO'}
                </span>
                
                <div className="flex items-center justify-center gap-3 font-mono font-black text-xl sm:text-2xl tracking-wider text-white">
                  {isFullyPlayed && aggregateHome !== null && aggregateAway !== null ? (
                    <>
                      <span>{aggregateHome.toFixed(2)}</span>
                      <span className="text-emerald-500 font-bold">:</span>
                      <span>{aggregateAway.toFixed(2)}</span>
                    </>
                  ) : isLeg1Played && homeScoreLeg1 !== null && awayScoreLeg1 !== null ? (
                    <>
                      <span>{homeScoreLeg1.toFixed(2)}</span>
                      <span className="text-emerald-500 font-bold">:</span>
                      <span>{awayScoreLeg1.toFixed(2)}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-400">—</span>
                      <span className="text-emerald-500/60 font-bold">×</span>
                      <span className="text-slate-400">—</span>
                    </>
                  )}
                </div>

                {/* Vencedor definitivo ou status da disputa */}
                {isFullyPlayed && winner ? (
                  <div className="mt-2.5 pt-2 border-t border-emerald-500/25 w-full flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wide">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>CLASSIFICADO: {winner === 'home' ? home.name : away.name}</span>
                    {tiebreakerApplied && (
                      <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded ml-1">
                        (Critério de Desempate)
                      </span>
                    )}
                  </div>
                ) : isLeg1Played && provisionalAdvantage ? (
                  <div className="mt-2.5 pt-2 border-t border-emerald-500/25 w-full flex flex-col items-center justify-center gap-1 text-[11px] font-mono">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-bold uppercase tracking-wide">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>
                        VANTAGEM PROVISÓRIA: {provisionalAdvantage.leader === 'home' ? home.name : provisionalAdvantage.leader === 'away' ? away.name : 'EMPATE'}
                      </span>
                    </div>
                    <span className="text-[9px] text-emerald-400/80 font-mono">
                      {provisionalAdvantage.text} • Decisão na Volta (R{match.f4Leg2Round})
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 text-[9px] font-mono text-emerald-400/60 uppercase tracking-wider">
                    Aguardando início dos confrontos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
