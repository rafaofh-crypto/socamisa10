import React from "react";
import TeamShield from "./TeamShield";
import { Award, Sparkles, Trophy, Calendar } from "lucide-react";

interface StandingTeam {
  id: string;
  name: string;
  owner: string;
  shieldUrl: string;
  calculatedPoints: number;
}

interface DashboardSocialCardProps {
  turnoType: "acumulado" | "turno1" | "turno2";
  standings: StandingTeam[];
  currentRound?: number;
}

const GENERAL_AWARDS = [
  "R$ 280,00", // 1º
  "R$ 200,00", // 2º
  "R$ 180,00", // 3º
  "R$ 160,00", // 4º
  "R$ 120,00", // 5º
  "R$ 75,00",  // 6º
  "R$ 60,00",  // 7º
  "R$ 40,00",  // 8º
  "R$ 40,00",  // 9º
  "R$ 40,00"   // 10º
];

const TURNO_AWARDS = [
  "R$ 160,00", // 1º
  "R$ 110,00", // 2º
  "R$ 90,00"   // 3º
];

export default function DashboardSocialCard({ turnoType, standings, currentRound = 1 }: DashboardSocialCardProps) {
  let cardTitle = "Quadro Oficial de Premiações • Geral Acumulado";
  let badgeLabel = "PREMIAÇÕES ATIVAS DO CAMPEONATO";
  let subtitle = "RANKING GERAL ACUMULADO";
  let isTurno = turnoType !== "acumulado";

  if (turnoType === "turno1") {
    cardTitle = "Quadro Oficial de Premiações • Medalhistas do 1º Turno";
    badgeLabel = "PREMIAÇÃO DO RETROSPECTO TURNO 1";
    subtitle = "RODADAS 01 A 19 FINALIZADAS";
  } else if (turnoType === "turno2") {
    cardTitle = "Quadro Oficial de Premiações • Medalhistas do 2º Turno";
    badgeLabel = "PREMIAÇÃO DO RETROSPECTO TURNO 2";
    subtitle = "RODADAS 20 A 38 EM EXIBIÇÃO";
  }

  // Calculate dynamic progress labels & status
  const rAcumulado = Math.min(currentRound, 38);
  const rTurno1 = Math.min(currentRound, 19);
  const rTurno2 = Math.max(20, Math.min(currentRound, 38));

  let progressLabel = "";
  let progressStatus = "em_andamento"; // 'em_andamento' | 'consolidado' | 'nao_iniciado'

  if (turnoType === "acumulado") {
    progressLabel = `NO ACUMULADO ${rAcumulado}/38 Rodadas`;
    progressStatus = currentRound >= 38 ? "consolidado" : "em_andamento";
  } else if (turnoType === "turno1") {
    progressLabel = `No 1º Turno ${rTurno1}/19 Rodadas`;
    progressStatus = currentRound >= 19 ? "consolidado" : "em_andamento";
  } else if (turnoType === "turno2") {
    progressLabel = `no 2º Turno ${rTurno2}/38 Rodadas`;
    if (currentRound < 20) {
      progressStatus = "nao_iniciado";
    } else if (currentRound >= 38) {
      progressStatus = "consolidado";
    } else {
      progressStatus = "em_andamento";
    }
  }

  // Dynamic Font Scaling helper for team names
  const getFontSizeClass = (name: string) => {
    if (name.length > 20) return "text-xs sm:text-sm font-bold truncate";
    if (name.length > 14) return "text-sm sm:text-base font-extrabold truncate";
    return "text-base sm:text-lg font-black truncate";
  };

  return (
    <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all duration-300">
      {/* Visual Ambient Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Identity Header */}
      <div className="border-b border-white/10 pb-5 mb-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            {badgeLabel}
          </div>
          <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight">
            {cardTitle}
          </h3>
          <p className="text-xs text-slate-400">
            Vitrine nativa consolidada com os respectivos valores em dinheiro assegurados aos líderes.
          </p>
        </div>

        <div className="flex items-center">
          <span className="text-[10px] font-mono font-black text-white bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-4 py-2 rounded-lg shadow-md border border-white/10 uppercase tracking-widest">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Showcase Status & Rounds Tracker Banner Segment */}
      <div className="relative z-10 bg-black/40 border border-white/5 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {progressStatus === "consolidado" ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-xl text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              🏆 CONSOLIDADO
            </div>
          ) : progressStatus === "em_andamento" ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff6b35]/15 text-[#ff6b35] border border-[#ff6b35]/25 rounded-xl text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-ping" />
              🟢 EM ANDAMENTO
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-500/10 text-slate-400 border border-slate-500/25 rounded-xl text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-450" />
              🕒 AGUARDANDO INÍCIO
            </div>
          )}
          
          <div className="text-[11px] sm:text-[12px] text-slate-300 font-sans">
            {progressStatus === "consolidado" ? (
              <span>Premiação final totalmente consolidada e encerrada.</span>
            ) : progressStatus === "em_andamento" ? (
              <span>Em disputa acirrada! Acompanhe as movimentações de pontuação rodada a rodada.</span>
            ) : (
              <span>Aguardando o início oficial do returno do campeonato brasileiro (Rodada 20).</span>
            )}
          </div>
        </div>

        {/* Highlighted Progress Round indicator */}
        <div className="px-4 py-2 bg-[#161a22] rounded-xl border border-gold/25 flex items-center gap-2 shrink-0">
          <Calendar className="w-4 h-4 text-gold animate-pulse" />
          <span className="font-mono text-xs font-extrabold text-[#D4AF37] uppercase tracking-wider">
            {progressLabel}
          </span>
        </div>
      </div>

      {/* Main Award Winners Layout */}
      <div className="relative z-10 w-full">
        {isTurno ? (
          // Turn Layout: Big Horizontal Cards for the Top 3 podium
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {standings.slice(0, 3).map((team, idx) => {
              const award = TURNO_AWARDS[idx] || "R$ 0,00";
              const emojis = ["🥇", "🥈", "🥉"];
              const placementColors = [
                "border-[#D4AF37]/50 bg-[#D4AF37]/10 hover:border-[#D4AF37]/80 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]",
                "border-slate-400/35 bg-slate-400/5 hover:border-slate-400/60",
                "border-amber-700/35 bg-amber-700/5 hover:border-amber-700/60"
              ];
              const decorationLabel = ["CAMPEÃO DO TURNO", "VICE-CAMPEÃO", "3º COLOCADO"];

              return (
                <div 
                  key={team.id} 
                  className={`rounded-2xl p-5 border flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:scale-[1.01] ${placementColors[idx]}`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-wider">
                      {decorationLabel[idx]}
                    </span>
                    <span className="text-xl shrink-0 leading-none">{emojis[idx]}</span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="w-11 h-11 bg-black/40 p-1.5 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                      <TeamShield shieldUrl={team.shieldUrl} fallbackText={team.name} />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(team.name)}`}>
                        {team.name}
                      </h4>
                      <p className="text-[10.5px] text-slate-400 font-semibold truncate">Dono: {team.owner}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline justify-between">
                    <span className="text-[10px] font-mono text-[#D4AF37] font-bold">{team.calculatedPoints} pts</span>
                    <span className="text-sm font-display font-black text-white shrink-0 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                      {award}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Complete General Acumulado Row (Top 10 bento list layout split into elegant cards)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standings.slice(0, 10).map((team, idx) => {
              const award = GENERAL_AWARDS[idx] || "R$ 0,00";
              const isTop3 = idx < 3;
              const medalEmoji = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
              
              const rowColors = idx === 0 
                ? "border-[#D4AF37]/45 bg-[#D4AF37]/10" 
                : "border-white/5 bg-slate-800/20";

              return (
                <div 
                  key={team.id} 
                  className={`rounded-xl p-3.5 border flex items-center justify-between gap-3 transition-all duration-300 hover:border-white/15 hover:bg-slate-800/30 ${rowColors}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-6 text-center select-none shrink-0 font-mono text-xs font-black text-slate-450">
                      {medalEmoji ? (
                        <span className="text-base">{medalEmoji}</span>
                      ) : (
                        <span>{idx + 1}º</span>
                      )}
                    </div>
                    
                    <div className="w-9 h-9 bg-black/40 p-1 rounded-full border border-white/5 flex items-center justify-center shrink-0">
                      <TeamShield shieldUrl={team.shieldUrl} fallbackText={team.name} />
                    </div>

                    <div className="min-w-0">
                      <h5 className={`uppercase font-display tracking-tight text-white leading-tight ${getFontSizeClass(team.name)}`}>
                        {team.name}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-semibold truncate">Téc. {team.owner} &bull; <span className="font-mono font-bold text-slate-350">{team.calculatedPoints} pts</span></p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className="text-[11px] font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/35 px-2.5 py-1 rounded">
                      {award}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Decorative Stamp bottom */}
      <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-slate-500 font-mono text-[9px] relative z-10">
        <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>VITRINE FINANCEIRA SÓ CAMISA 10 &bull; ATUALIZADA EM TEMPO REAL COM O FILTRO ATIVO</span>
      </div>
    </div>
  );
}
