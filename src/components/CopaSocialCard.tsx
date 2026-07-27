import React from "react";
import TeamShield from "./TeamShield";
import { Trophy, Star, Sparkles, ShieldCheck, Award, AlertCircle } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  owner: string;
  shieldUrl: string;
  points: number;
}

interface CopaSocialCardProps {
  subTab: "classification" | "groups" | "bracket";
  cutRound: number;
  standingsAtCut: Participant[];
  finalRankings: any; // FinalRankings | null
  groups: Record<string, any[]>;
  isAwaitingRound20?: boolean;
}

export default function CopaSocialCard({
  subTab,
  cutRound,
  standingsAtCut,
  finalRankings,
  groups,
  isAwaitingRound20 = false
}: CopaSocialCardProps) {

  const getTeamInitials = (name: string) => {
    if (!name) return "S10";
    const clean = name.replace(/[^a-zA-Z0-9 ]/g, "").trim();
    const words = clean.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase();
  };

  // Dynamic Font Scaling helper for team names
  const getFontSizeClass = (name: string) => {
    if (name.length > 20) return "text-sm sm:text-base font-bold leading-tight";
    if (name.length > 14) return "text-base sm:text-lg font-extrabold leading-tight";
    return "text-lg sm:text-xl font-black leading-tight";
  };

  // Render PREMIUM PODIUM FOR BRACKET VIEW (The ultimate tournament champions showcase)
  if (subTab === "bracket") {
    if (isAwaitingRound20) {
      return (
        <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl text-center">
          <Trophy className="w-12 h-12 text-[#D4AF37]/40 mx-auto mb-4 animate-pulse" />
          <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
            Galeria da Glória Eterna
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
            A galeria de campeões será aberta assim que a fase final do mata-mata for iniciada, após a consolidação da rodada 20.
          </p>
        </div>
      );
    }
    const champ = finalRankings?.champion || { name: "DOIS VIZINHOS SA", owner: "Angelo Cassol" };
    const runner = finalRankings?.runner_up || { name: "CRF GALO", owner: "Renato Galo" };
    const third = finalRankings?.third_place || { name: "DUDUMATHIAS FC", owner: "Evandro Rebelatto" };
    const fourth = finalRankings?.fourth_place || { name: "MARIXCO FC", owner: "dudu" };
    const fifth = finalRankings?.fifth_place || { name: "DIDA82 FC", owner: "Anderson D da Rosa" };

    const initials = getTeamInitials(champ.name);

    return (
      <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all duration-300">
        {/* Aesthetic Overlay glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        {/* Header segment */}
        <div className="border-b border-white/10 pb-5 mb-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-mono font-black uppercase tracking-wider animate-pulse">
              <Trophy className="w-3.5 h-3.5" />
              Consagração dos Campeões • Copa M10
            </div>
            <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
              Galeria da Glória Eterna
            </h3>
            <p className="text-xs text-slate-400">
              O pódio oficial consagrando os titãs que aniquilaram seus oponentes no chaveamento mata-mata.
            </p>
          </div>

          <div className="flex items-center">
            <span className="text-[11px] font-mono font-black text-white bg-gradient-to-r from-purple-600 to-[#D4AF37] px-4 py-2 rounded-lg border border-white/10 tracking-widest uppercase shadow-md">
              MATA-MATA ATIVO
            </span>
          </div>
        </div>

        {/* Majestic Podium Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          
          {/* CHAMPION: 1º COLOCADO (Special styling center) */}
          <div className="group md:col-span-2 bg-gradient-to-b from-[#121212]/95 to-purple-950/20 border-2 border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.22)] rounded-2xl p-6 flex flex-col justify-between min-h-[240px] transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#D4AF37]" />
                  CAMPEÃO DOS CAMPEÕES
                </span>
                <Trophy className="w-5 h-5 text-[#D4AF37] animate-bounce" />
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="w-14 h-14 bg-[#D4AF37]/15 p-2 rounded-full border-2 border-[#D4AF37] shadow-lg flex items-center justify-center shrink-0">
                  <span className="font-display font-black text-lg text-[#D4AF37]">{initials}</span>
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(champ.name)}`}>
                    {champ.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-semibold truncate">Dono: {champ.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[10px] font-mono text-[#D4AF37] font-bold">1º LUGAR INVICTO</span>
              <span className="text-[11px] font-mono font-black text-white bg-gradient-to-r from-yellow-500 to-amber-600 px-3.5 py-1.5 rounded-lg border border-white/15 uppercase tracking-wide">
                R$ 300,00 + 🏆
              </span>
            </div>
          </div>

          {/* BRACKET: 2º COLOCADO */}
          <div className="group bg-[#121212]/95 border border-slate-400/25 hover:border-slate-400/50 rounded-2xl p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-slate-300 bg-slate-400/10 border border-slate-400/20 px-2 py-0.5 rounded">
                  🥈 VICE-CAMPEÃO
                </span>
                <Award className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 p-1.5 rounded-full border border-slate-400/20 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={runner.shieldUrl} fallbackText={runner.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(runner.name)}`}>
                    {runner.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {runner.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[9px] font-mono text-slate-400">2º LUGAR</span>
              <span className="text-xs font-mono font-black text-slate-200 bg-slate-400/15 px-2.5 py-1 rounded">
                R$ 150,00
              </span>
            </div>
          </div>

          {/* BRACKET: 3º COLOCADO */}
          <div className="group bg-[#121212]/95 border border-amber-700/25 hover:border-amber-700/50 rounded-2xl p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-amber-600 bg-amber-700/10 border border-amber-700/20 px-2 py-0.5 rounded">
                  🥉 3º COLOCADO
                </span>
                <Award className="w-4 h-4 text-amber-700" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 p-1.5 rounded-full border border-amber-700/20 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={third.shieldUrl} fallbackText={third.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(third.name)}`}>
                    {third.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {third.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[9px] font-mono text-slate-400">3º LUGAR</span>
              <span className="text-xs font-mono font-black text-amber-500 bg-amber-700/15 px-2.5 py-1 rounded">
                R$ 80,00
              </span>
            </div>
          </div>

          {/* BRACKET: 4º COLOCADO */}
          <div className="group bg-[#121212]/95 border border-purple-550/25 hover:border-purple-550/50 rounded-2xl p-5 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:scale-[1.01]">
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-[9px] font-mono font-black text-purple-400 bg-purple-550/10 border border-purple-550/20 px-2 py-0.5 rounded">
                  🏅 4º COLOCADO
                </span>
                <Award className="w-4 h-4 text-purple-400" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 p-1.5 rounded-full border border-purple-550/20 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={fourth.shieldUrl} fallbackText={fourth.name} />
                </div>
                <div className="min-w-0">
                  <h4 className={`uppercase font-display tracking-tight text-white ${getFontSizeClass(fourth.name)}`}>
                    {fourth.name}
                  </h4>
                  <p className="text-[10.5px] text-slate-400 font-semibold truncate">Téc. {fourth.owner}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
              <span className="text-[9px] font-mono text-slate-400">4º LUGAR</span>
              <span className="text-xs font-mono font-black text-purple-400 bg-purple-550/15 px-2.5 py-1 rounded">
                R$ 50,00
              </span>
            </div>
          </div>

        </div>

        {/* Bottom banner seal */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-slate-500 font-mono text-[9px] relative z-10">
          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>PAINEL DOS CAMPEÕES COPA M10 &bull; ATUALIZADO CONFORME O CHAVEAMENTO SIMULADO OU REAL</span>
        </div>
      </div>
    );
  }

  // Render CLASSIFICATION/GROUPS PRE-CUTOFF VIEW (Qualifiers List template)
  const isGroups = subTab === "groups";

  const cabecasDeChave = isAwaitingRound20
    ? Array.from({ length: 12 }, (_, i) => ({
        id: `placeholder-head-${i}`,
        name: "Aguardando Rod 20",
        owner: "—",
        points: 0,
        shieldUrl: ""
      }))
    : standingsAtCut.slice(0, 12);

  const eliminados = isAwaitingRound20
    ? Array.from({ length: 2 }, (_, i) => ({
        id: `placeholder-elim-${i}`,
        name: "Aguardando Rod 20",
        owner: "—",
        points: 0,
        shieldUrl: ""
      }))
    : (standingsAtCut.length >= 50
        ? standingsAtCut.slice(48, 50)
        : standingsAtCut.slice(-2));
  
  return (
    <div className="w-full bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all duration-300">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header element */}
      <div className="border-b border-white/10 pb-5 mb-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-full text-[10px] font-mono font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isGroups ? "Qualificação de Grupos Ativos" : `Fase Classificatória • Corte R${cutRound}`}
          </div>
          <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
            {isGroups ? "Sorteio de Grupos & Cabeças de Chave" : "Destaques da Fase Classificatória"}
          </h3>
          <p className="text-xs text-slate-400">
            {isGroups 
              ? "Exibindo os classificados oficiais alocados nos grupos." 
              : `Consolidado dos 12 Cabeças de Chave principais e os times na disputa do Esperneio.`}
          </p>
        </div>

        <div className="flex items-center">
          <span className="text-[11px] font-mono font-black text-[#D4AF37] bg-white/5 border border-[#D4AF37]/30 px-4 py-2 rounded-lg tracking-widest uppercase">
            {isGroups ? "12 CABEÇAS DE CHAVE" : "VITRINE DE CORTES"}
          </span>
        </div>
      </div>

      {/* Grid listing Cabeças de Chave */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4.5 h-4.5 text-[#D4AF37]" />
          <h4 className="text-xs font-mono font-black text-[#D4AF37] uppercase tracking-wider">
            👑 OS 12 CABEÇAS DE CHAVE (POTE 1 / TOP 12)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cabecasDeChave.map((team, idx) => {
            return (
              <div 
                key={team.id} 
                className={`rounded-xl p-3.5 border flex items-center gap-3 transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 border-[#D4AF37]/20 bg-[#D4AF37]/10`}
              >
                <div className="w-6 text-center shrink-0 font-mono text-xs font-black text-[#D4AF37] flex flex-col items-center">
                  <span>{idx + 1}º</span>
                  <Star className="w-2.5 h-2.5 fill-[#D4AF37]" />
                </div>

                <div className="w-8 h-8 bg-black/40 p-1 rounded-full border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                  <TeamShield shieldUrl={team.shieldUrl} fallbackText={team.name} />
                </div>

                <div className="min-w-0 flex-1">
                  <h5 className={`uppercase font-display tracking-tight text-white leading-tight ${getFontSizeClass(team.name)}`}>
                    {team.name}
                  </h5>
                  <p className="text-[9.5px] text-slate-400 truncate">Téc: {team.owner}</p>
                  <p className="text-[10px] text-[#D4AF37] font-mono font-black mt-0.5 flex flex-wrap items-center gap-1">
                    <span>{team.points.toFixed(2)} pts</span>
                    <span className="text-[8px] bg-[#D4AF37]/20 px-1 py-0.2 rounded font-sans uppercase font-extrabold tracking-wide">CABEÇA</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section listing the Cutoff Esperneio elements */}
      {!isGroups && eliminados.length > 0 && (
        <div className="relative z-10 pt-6 border-t border-white/10 mb-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4.5 h-4.5 text-[#c5a880] animate-pulse" />
            <h4 className="text-xs font-mono font-black text-[#c5a880] uppercase tracking-wider">
              ⚔️ DISPUTA DO ESPERNEIO (LINHA DE CORTE - 49º & 50º)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eliminados.map((team, idx) => {
              const realRank = standingsAtCut.findIndex(t => t.id === team.id) + 1;
              const displayRank = realRank > 0 ? realRank : 49 + idx;
              
              return (
                <div 
                  key={team.id || idx} 
                  className="rounded-xl p-4 border flex items-center gap-3 transition-all duration-300 hover:border-[#c5a880]/40 hover:bg-[#c5a880]/15 border-[#c5a880]/25 bg-[#c5a880]/10"
                >
                  <div className="w-6 text-center shrink-0 font-mono text-xs font-black text-[#c5a880]">
                    <span>{displayRank}º</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="uppercase font-display tracking-tight text-white font-bold leading-tight text-xs sm:text-sm">
                      AGUARDANDO ROD. DO ESPERNEIO
                    </h5>
                    <p className="text-[10px] text-[#c5a880] font-mono font-bold mt-0.5 flex items-center gap-1.5">
                      <span>Pontuação R20: {team.points.toFixed(2)} pts</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer stamp bar */}
      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-slate-500 font-mono text-[9px] relative z-10 w-full">
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>VITRINE OFICIAL DE CLASSIFICAÇÃO &bull; EXIBINDO OS 12 CABEÇAS DE CHAVE PRINCIPAIS E OS TIMES DA RODADA DO ESPERNEIO</span>
        </div>
      </div>
    </div>
  );
}
