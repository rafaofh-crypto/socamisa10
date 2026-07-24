import React from "react";
import { CartolaTeam } from "../services/cartollaApi";
import TeamShield from "./TeamShield";
import { Flame, Sparkles, Skull, Coins, Trophy, Award } from "lucide-react";

interface SocialCardProps {
  mito: CartolaTeam;
  mitoScore: number;
  lanterna: CartolaTeam | null;
  lanternaScore: number;
  magnata: CartolaTeam | null;
  magnataValue: number;
  round: number;
  recordeTeam?: CartolaTeam | null;
  recordeValue?: number;
  recordeRound?: number;
}

export default function SocialCard({ 
  mito, 
  mitoScore, 
  lanterna, 
  lanternaScore, 
  magnata, 
  magnataValue, 
  round,
  recordeTeam,
  recordeValue,
  recordeRound
}: SocialCardProps) {

  const recTeamName = recordeTeam?.name || "Floripamengao";
  const recTeamOwner = recordeTeam?.owner || "Dyego";
  const recShieldUrl = recordeTeam?.shieldUrl || "/escudos/Floripamengao.avif";
  const recPoints = recordeValue !== undefined ? recordeValue : 138.12;
  const recRoundNum = recordeRound || 13;

  // Dynamic Font Scaling helper to prevent text breaks or overflow for names > 16 chars
  const getFontSizeClass = (name: string) => {
    if (name.length > 22) return "text-sm sm:text-base font-bold leading-tight";
    if (name.length > 16) return "text-base sm:text-lg font-extrabold leading-tight";
    return "text-lg sm:text-xl font-black leading-tight";
  };

  return (
    <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden transition-all duration-300 shadow-2xl">
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Decorative Top header ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
            Vitrine de Consagração Oficial
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight uppercase">
            Quadro de Destaques <span className="text-[#D4AF37]">Rodada {round}</span>
          </h2>
          <p className="text-xs text-slate-400">
            A exibição definitiva dos feitos heroicos, táticas milionárias e as escalações trágicas deste ciclo.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-lg">
            Brasileirão Liga S10 2026
          </span>
        </div>
      </div>

      {/* Imposing Grid for the 4 Laureates Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        
        {/* LAUREADO 1: O MITO */}
        <div className="group bg-[#121212]/90 border border-[#D4AF37]/40 hover:border-[#D4AF37]/80 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[260px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-[#D4AF37] tracking-wider flex items-center gap-1 bg-[#D4AF37]/10 px-2.5 py-1 rounded-md border border-[#D4AF37]/15">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Mito
              </span>
              <span className="text-[9px] font-mono font-black text-[#D4AF37] tracking-wider">
                🥇 Pontuação Max
              </span>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="w-12 h-12 bg-black/40 p-1.5 rounded-full border border-[#D4AF37]/30 shadow-inner flex items-center justify-center shrink-0">
                <TeamShield shieldUrl={mito.shieldUrl} fallbackText={mito.name} />
              </div>
              <div className="min-w-0">
                <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(mito.name)}`}>
                  {mito.name}
                </h4>
                <p className="text-[10.5px] text-slate-400 truncate font-semibold">Téc. {mito.owner}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-baseline justify-between gap-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total da Rodada</span>
            <div className="text-right">
              <span className="font-mono text-2.5xl sm:text-3xl font-black text-white tracking-tight">
                {mitoScore.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-[10px] font-mono text-[#D4AF37] font-bold uppercase ml-1">pts</span>
            </div>
          </div>
        </div>

        {/* LAUREADO 2: O LANTERNA */}
        {lanterna && (
          <div className="group bg-[#121212]/90 border border-red-500/25 hover:border-red-550/60 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[260px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase text-red-400 tracking-wider flex items-center gap-1 bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/15">
                  <Skull className="w-3.5 h-3.5" />
                  Lanterna
                </span>
                <span className="text-[9px] font-mono font-black text-red-450 tracking-wider uppercase">
                  🤕 Gesso Geral
                </span>
              </div>

              <div className="flex items-center gap-3 py-1">
                <div className="w-12 h-12 bg-black/40 p-1.5 rounded-full border border-red-500/20 shadow-inner flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={lanterna.shieldUrl} fallbackText={lanterna.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(lanterna.name)}`}>
                    {lanterna.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 truncate font-semibold">Téc. {lanterna.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-baseline justify-between gap-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total da Rodada</span>
              <div className="text-right">
                <span className="font-mono text-2.5xl sm:text-3xl font-black text-red-400 tracking-tight">
                  {lanternaScore.toFixed(2).replace(".", ",")}
                </span>
                <span className="text-[10px] font-mono text-red-500 font-bold uppercase ml-1">pts</span>
              </div>
            </div>
          </div>
        )}

        {/* LAUREADO 3: O MAGNATA */}
        {magnata && (
          <div className="group bg-[#121212]/90 border border-emerald-500/25 hover:border-emerald-550/60 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[260px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/15">
                  <Coins className="w-3.5 h-3.5" />
                  O Magnata
                </span>
                <span className="text-[9px] font-mono font-black text-emerald-450 tracking-wider">
                  💰 Cofrinho Cheio
                </span>
              </div>

              <div className="flex items-center gap-3 py-1">
                <div className="w-12 h-12 bg-black/40 p-1.5 rounded-full border border-emerald-500/20 shadow-inner flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={magnata.shieldUrl} fallbackText={magnata.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(magnata.name)}`}>
                    {magnata.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 truncate font-semibold">Téc. {magnata.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-baseline justify-between gap-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Patrimônio Ativo</span>
              <div className="text-right">
                <span className="font-mono text-2.5xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                  C$ {magnataValue.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* LAUREADO 4: RECORDE HISTÓRICO */}
        <div className="group bg-[#121212]/90 border border-purple-550/25 hover:border-purple-550/60 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[260px] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(147,51,234,0.1)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-purple-400 tracking-wider flex items-center gap-1 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/15">
                <Trophy className="w-3.5 h-3.5" />
                Liga Recorde
              </span>
              <span className="text-[8px] font-mono font-black text-purple-450 bg-purple-500/15 px-2 py-0.5 rounded uppercase tracking-wider">
                👑 R{recRoundNum} Record
              </span>
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className="w-12 h-12 bg-black/40 p-1.5 rounded-full border border-purple-500/20 shadow-inner flex items-center justify-center shrink-0">
                <TeamShield shieldUrl={recShieldUrl} fallbackText={recTeamName} />
              </div>
              <div className="min-w-0">
                <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(recTeamName)}`}>
                  {recTeamName}
                </h4>
                <p className="text-[10.5px] text-slate-400 truncate font-semibold">Téc. {recTeamOwner}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-baseline justify-between gap-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Recorde Geral</span>
            <div className="text-right">
              <span className="font-mono text-2.5xl sm:text-3xl font-black text-purple-450 tracking-tight">
                {recPoints.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase ml-1">pts</span>
            </div>
          </div>
        </div>

      </div>

      {/* Elegant Bottom branding seal */}
      <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 font-mono text-[10px] relative z-10">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#D4AF37]" />
          <span>GALERIA CONVERTIDA NATIVA &bull; DESIGN PATENTEADO SOCAMISA10</span>
        </div>
        <div>
          <span>RECONHECIMENTO DE AUTOMOTIVAÇÃO INTEGRADA &bull; BRASILEIRÃO 2026</span>
        </div>
      </div>
    </div>
  );
}
