import React from "react";
import TeamShield from "./TeamShield";
import { Award, Sparkles, Trophy, Calendar, Coins, ArrowUpRight } from "lucide-react";

interface StandingTeam {
  id: number;
  name: string;
  owner: string;
  shieldUrl: string;
  monthlyPoints: number;
}

interface MonthlySocialCardProps {
  monthName: string;
  monthRounds: number[];
  standings: StandingTeam[];
  maiorPatrimonio?: {
    name: string;
    owner: string;
    valuation: string;
    shieldUrl: string;
  } | null;
  allMonthRounds?: number[];
  currentRound?: number;
}

export default function MonthlySocialCard({ 
  monthName, 
  monthRounds, 
  standings, 
  maiorPatrimonio,
  allMonthRounds = [],
  currentRound = 1
}: MonthlySocialCardProps) {

  // Monthly Cash Prizes configs (Top 3 of the month)
  const MONTHLY_GOLDEN_AWARDS = ["R$ 130,00", "R$ 90,00", "R$ 70,00"];

  // Get top 3 of the month
  const top1 = standings[0];
  const top2 = standings[1];
  const top3 = standings[2];

  // Evaluate completeness of the month
  const playedRounds = allMonthRounds.filter(r => r <= currentRound);
  const playedRoundsCount = playedRounds.length;
  const totalRoundsCount = allMonthRounds.length;

  const isConsolidated = playedRoundsCount === totalRoundsCount && totalRoundsCount > 0;
  const isRunning = playedRoundsCount > 0 && playedRoundsCount < totalRoundsCount;
  const isPending = playedRoundsCount === 0;

  // Dynamic Font Scaling helper for team names
  const getFontSizeClass = (name: string) => {
    if (name.length > 20) return "text-sm sm:text-base font-bold leading-tight";
    if (name.length > 14) return "text-base sm:text-lg font-extrabold leading-tight";
    return "text-lg sm:text-xl font-black leading-tight";
  };

  return (
    <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header element */}
      <div className="border-b border-white/10 pb-5 mb-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Consolidação do Mês de {monthName}
          </div>
          <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
            Premiações Recopa Mensal
          </h3>
          <p className="text-xs text-slate-400">
            Faturamento acumulado decorrente das rodadas {monthRounds.join(", ")}.
          </p>
        </div>

        <div className="flex items-center">
          <span className="text-[11px] font-mono font-black text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 px-4 py-2 rounded-lg tracking-widest uppercase">
            {monthName.substring(0, 3)} / 2026
          </span>
        </div>
      </div>

      {/* Showcase Status & Rounds Tracker Banner Segment */}
      <div className="relative z-10 bg-black/40 border border-white/5 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {isConsolidated ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-xl text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              🏆 CONSOLIDADO
            </div>
          ) : isRunning ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/25 rounded-xl text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-ping" />
              🟢 EM ANDAMENTO / ROLANDO
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-500/10 text-slate-450 border border-slate-500/25 rounded-xl text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              🕒 AGUARDANDO INÍCIO
            </div>
          )}
          
          <div className="text-[11px] text-slate-300">
            {isConsolidated ? (
              <span>Todas as <strong>{totalRoundsCount} rodadas</strong> de {monthName} concluídas! Pagamentos habilitados.</span>
            ) : isRunning ? (
              <span>Rodadas jogadas: <strong>{playedRoundsCount} de {totalRoundsCount}</strong>. Vitrine renovada em tempo real pelas parciais.</span>
            ) : (
              <span>Aguardando a bola rolar para as rodadas do mês de {monthName}.</span>
            )}
          </div>
        </div>

        {/* Month rounds list with completed ones crossed off */}
        {totalRoundsCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] sm:text-[11px]">
            <span className="text-slate-400 font-sans text-[11px] font-bold uppercase mr-1">Rondas:</span>
            {allMonthRounds.map((round) => {
              const completed = round <= currentRound;
              return (
                <div 
                  key={round}
                  className={`px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 leading-none ${
                    completed 
                      ? "border-emerald-500/25 bg-emerald-500/5 text-emerald-400 line-through opacity-75" 
                      : "border-slate-800 bg-[#121212] text-slate-300 font-bold"
                  }`}
                  title={completed ? `Rodada R${round} Finalizada` : `Rodada R${round} Pendente`}
                >
                  <span>R{round}</span>
                  {completed && <span className="text-[9px] text-emerald-450">✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main cards: Top 3 and Magnata side-by-side or in a full column list */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        
        {/* MONTH CHAMPION: 1ST */}
        {top1 && (
          <div className="group bg-[#121212]/95 border-2 border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.18)] rounded-2xl p-5 flex flex-col justify-between h-full min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded">
                  🥇 CAMPEÃO MENSAL
                </span>
                <Trophy className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-black/40 p-1.5 rounded-full border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={top1.shieldUrl} fallbackText={top1.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(top1.name)}`}>
                    {top1.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {top1.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">{top1.monthlyPoints.toFixed(2)} pts</span>
              <span className="text-xs font-display font-black text-white bg-[#D4AF37]/25 px-2.5 py-1 rounded border border-[#D4AF37]/45">
                {MONTHLY_GOLDEN_AWARDS[0]}
              </span>
            </div>
          </div>
        )}

        {/* MONTH CHAMPION: 2ND */}
        {top2 && (
          <div className="group bg-[#121212]/95 border border-slate-400/25 hover:border-slate-400/50 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-slate-400 bg-slate-400/10 border border-slate-400/20 px-2 py-0.5 rounded">
                  🥈 VICE-CAMPEÃO MENSAL
                </span>
                <Award className="w-4 h-4 text-slate-450" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 p-1 rounded-full border border-slate-400/20 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={top2.shieldUrl} fallbackText={top2.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(top2.name)}`}>
                    {top2.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {top2.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">{top2.monthlyPoints.toFixed(2)} pts</span>
              <span className="text-xs font-display font-black text-white bg-slate-400/15 px-2.5 py-1 rounded border border-slate-400/30">
                {MONTHLY_GOLDEN_AWARDS[1]}
              </span>
            </div>
          </div>
        )}

        {/* MONTH CHAMPION: 3RD */}
        {top3 && (
          <div className="group bg-[#121212]/95 border border-amber-700/25 hover:border-amber-700/50 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-amber-600 bg-amber-700/10 border border-amber-700/20 px-2 py-0.5 rounded">
                  🥉 3º COLOCADO MENSAL
                </span>
                <Award className="w-4 h-4 text-amber-700" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 p-1 rounded-full border border-amber-700/20 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={top3.shieldUrl} fallbackText={top3.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(top3.name)}`}>
                    {top3.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {top3.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400">{top3.monthlyPoints.toFixed(2)} pts</span>
              <span className="text-xs font-display font-black text-white bg-amber-750/15 px-2.5 py-1 rounded border border-amber-700/30">
                {MONTHLY_GOLDEN_AWARDS[2]}
              </span>
            </div>
          </div>
        )}

        {/* MAGNATA DO MÊS */}
        {maiorPatrimonio && (
          <div className="group bg-[#121212]/95 border border-emerald-500/25 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <Coins className="w-3 h-3 text-emerald-450" />
                  MAGNATA DO MÊS
                </span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 p-1 rounded-full border border-emerald-500/35 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={maiorPatrimonio.shieldUrl} fallbackText={maiorPatrimonio.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(maiorPatrimonio.name)}`}>
                    {maiorPatrimonio.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {maiorPatrimonio.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[10px] font-mono text-slate-400">Patrimônio Mensal</span>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/15 px-2 py-1 rounded border border-emerald-500/25">
                {maiorPatrimonio.valuation}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Decorative Stamp row */}
      <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-slate-500 font-mono text-[9px] relative z-10">
        <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>VITRINE RECOPA MENSAL SÓ CAMISA 10 &bull; EXCLUSIVIDADE NATIVA EXIBIDA COM DESTAQUES EM VIGOR</span>
      </div>
    </div>
  );
}
